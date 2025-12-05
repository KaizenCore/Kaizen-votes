package core.dev.kaizenVotesPlugin.api;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import core.dev.kaizenVotesPlugin.KaizenVotesPlugin;
import core.dev.kaizenVotesPlugin.api.models.PairingResponse;
import core.dev.kaizenVotesPlugin.api.models.VoteEvent;
import core.dev.kaizenVotesPlugin.config.ConfigManager;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;

/**
 * Client WebSocket pour les événements temps réel de Kaizen
 */
public class KaizenWebSocketClient {

    private final KaizenVotesPlugin plugin;
    private final ConfigManager config;
    private final Gson gson;

    private WebSocketClient client;
    private boolean connected = false;
    private boolean shouldReconnect = true;
    private int reconnectAttempts = 0;
    private static final int MAX_RECONNECT_ATTEMPTS = 10;

    // Event handlers
    private Consumer<VoteEvent> onVoteReceived;
    private Consumer<PairingResponse> onPairingConfirmed;
    private Runnable onConnected;
    private Consumer<String> onDisconnected;
    private Consumer<String> onError;

    public KaizenWebSocketClient(KaizenVotesPlugin plugin) {
        this.plugin = plugin;
        this.config = plugin.getConfigManager();
        this.gson = new GsonBuilder()
                .setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
                .create();
    }

    /**
     * Connecte au serveur WebSocket
     */
    public void connect() {
        if (!config.isLinked()) {
            plugin.getLogger().info("Serveur non lié, WebSocket non connecté");
            return;
        }

        shouldReconnect = true;
        reconnectAttempts = 0;
        createAndConnect();
    }

    /**
     * Connecte en mode pairing (avant d'avoir un token)
     */
    public void connectForPairing(String pairingCode, String validationToken) {
        String wsUrl = config.getWebSocketUrl() + "/pairing?code=" + pairingCode + "&token=" + validationToken;
        createAndConnect(wsUrl, new HashMap<>());
    }

    private void createAndConnect() {
        String wsUrl = config.getWebSocketUrl() + "/server";
        Map<String, String> headers = new HashMap<>();
        headers.put("Authorization", "Bearer " + config.getServerToken());
        headers.put("X-Server-Id", config.getServerId());
        createAndConnect(wsUrl, headers);
    }

    private void createAndConnect(String wsUrl, Map<String, String> headers) {
        try {
            URI uri = new URI(wsUrl);

            client = new WebSocketClient(uri, headers) {
                @Override
                public void onOpen(ServerHandshake handshake) {
                    connected = true;
                    reconnectAttempts = 0;
                    plugin.getLogger().info("WebSocket connecté à Kaizen");

                    if (onConnected != null) {
                        plugin.getServer().getScheduler().runTask(plugin, onConnected);
                    }
                }

                @Override
                public void onMessage(String message) {
                    handleMessage(message);
                }

                @Override
                public void onClose(int code, String reason, boolean remote) {
                    connected = false;
                    plugin.getLogger().info("WebSocket déconnecté: " + reason);

                    if (onDisconnected != null) {
                        plugin.getServer().getScheduler().runTask(plugin, () -> onDisconnected.accept(reason));
                    }

                    // Tenter une reconnexion si nécessaire
                    if (shouldReconnect && config.isLinked()) {
                        scheduleReconnect();
                    }
                }

                @Override
                public void onError(Exception ex) {
                    plugin.getLogger().warning("Erreur WebSocket: " + ex.getMessage());

                    if (onError != null) {
                        plugin.getServer().getScheduler().runTask(plugin, () -> onError.accept(ex.getMessage()));
                    }
                }
            };

            client.setConnectionLostTimeout(30);
            client.connect();

        } catch (Exception e) {
            plugin.getLogger().severe("Erreur lors de la création du WebSocket: " + e.getMessage());
        }
    }

    /**
     * Traite les messages reçus du WebSocket
     */
    private void handleMessage(String message) {
        try {
            JsonObject json = JsonParser.parseString(message).getAsJsonObject();
            String type = json.has("type") ? json.get("type").getAsString() : "";
            JsonObject data = json.has("data") ? json.getAsJsonObject("data") : null;

            switch (type) {
                case "vote.received":
                    if (data != null && onVoteReceived != null) {
                        VoteEvent vote = gson.fromJson(data, VoteEvent.class);
                        plugin.getServer().getScheduler().runTask(plugin, () -> onVoteReceived.accept(vote));
                    }
                    break;

                case "pairing.confirmed":
                    if (data != null && onPairingConfirmed != null) {
                        PairingResponse pairing = gson.fromJson(data, PairingResponse.class);
                        plugin.getServer().getScheduler().runTask(plugin, () -> onPairingConfirmed.accept(pairing));
                    }
                    break;

                case "ping":
                    // Répondre au ping pour maintenir la connexion
                    send("{\"type\":\"pong\"}");
                    break;

                case "error":
                    String errorMsg = data != null && data.has("message")
                            ? data.get("message").getAsString()
                            : "Erreur inconnue";
                    plugin.getLogger().warning("Erreur WebSocket: " + errorMsg);
                    break;

                default:
                    plugin.getLogger().fine("Message WebSocket non géré: " + type);
            }
        } catch (Exception e) {
            plugin.getLogger().warning("Erreur parsing message WebSocket: " + e.getMessage());
        }
    }

    /**
     * Envoie un message au serveur WebSocket
     */
    public void send(String message) {
        if (client != null && connected) {
            client.send(message);
        }
    }

    /**
     * Envoie un message JSON
     */
    public void send(String type, Object data) {
        JsonObject message = new JsonObject();
        message.addProperty("type", type);
        if (data != null) {
            message.add("data", gson.toJsonTree(data));
        }
        send(message.toString());
    }

    /**
     * Planifie une reconnexion avec backoff exponentiel
     */
    private void scheduleReconnect() {
        if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
            plugin.getLogger().warning("Nombre maximum de tentatives de reconnexion atteint");
            return;
        }

        reconnectAttempts++;
        long delay = Math.min(30, (long) Math.pow(2, reconnectAttempts)); // Max 30 secondes

        plugin.getLogger().info("Reconnexion WebSocket dans " + delay + " secondes (tentative " + reconnectAttempts + ")");

        plugin.getServer().getScheduler().runTaskLaterAsynchronously(plugin, () -> {
            if (shouldReconnect && !connected && config.isLinked()) {
                createAndConnect();
            }
        }, delay * 20L); // Convertir en ticks
    }

    /**
     * Déconnecte le WebSocket
     */
    public void disconnect() {
        shouldReconnect = false;
        if (client != null) {
            client.close();
            client = null;
        }
        connected = false;
    }

    /**
     * Vérifie si le client est connecté
     */
    public boolean isConnected() {
        return connected && client != null && client.isOpen();
    }

    // ==================== Event Setters ====================

    public KaizenWebSocketClient onVoteReceived(Consumer<VoteEvent> handler) {
        this.onVoteReceived = handler;
        return this;
    }

    public KaizenWebSocketClient onPairingConfirmed(Consumer<PairingResponse> handler) {
        this.onPairingConfirmed = handler;
        return this;
    }

    public KaizenWebSocketClient onConnected(Runnable handler) {
        this.onConnected = handler;
        return this;
    }

    public KaizenWebSocketClient onDisconnected(Consumer<String> handler) {
        this.onDisconnected = handler;
        return this;
    }

    public KaizenWebSocketClient onError(Consumer<String> handler) {
        this.onError = handler;
        return this;
    }
}
