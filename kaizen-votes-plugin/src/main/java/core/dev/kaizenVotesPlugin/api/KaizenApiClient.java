package core.dev.kaizenVotesPlugin.api;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import core.dev.kaizenVotesPlugin.KaizenVotesPlugin;
import core.dev.kaizenVotesPlugin.api.models.*;
import core.dev.kaizenVotesPlugin.config.ConfigManager;
import okhttp3.*;

import java.io.IOException;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;

/**
 * Client HTTP pour communiquer avec l'API Kaizen
 */
public class KaizenApiClient {

    private final KaizenVotesPlugin plugin;
    private final ConfigManager config;
    private final OkHttpClient httpClient;
    private final Gson gson;

    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    public KaizenApiClient(KaizenVotesPlugin plugin) {
        this.plugin = plugin;
        this.config = plugin.getConfigManager();
        this.gson = new GsonBuilder()
                .setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
                .create();

        this.httpClient = new OkHttpClient.Builder()
                .connectTimeout(10, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .addInterceptor(this::addAuthHeader)
                .build();
    }

    /**
     * Intercepteur pour ajouter le header d'authentification
     */
    private Response addAuthHeader(Interceptor.Chain chain) throws IOException {
        Request original = chain.request();

        // Ajouter le token si disponible
        String token = config.getServerToken();
        if (token != null && !token.isEmpty()) {
            Request authenticated = original.newBuilder()
                    .header("Authorization", "Bearer " + token)
                    .header("X-Server-Id", config.getServerId())
                    .build();
            return chain.proceed(authenticated);
        }

        return chain.proceed(original);
    }

    /**
     * URL de base de l'API
     */
    private String getBaseUrl() {
        return config.getApiBaseUrl() + "/api/v1";
    }

    // ==================== Pairing ====================

    /**
     * Lie le serveur avec un code de pairing obtenu depuis le dashboard
     */
    public CompletableFuture<ApiResponse<PairingResponse>> pairWithCode(String pairingCode,
                                                                         String serverIp,
                                                                         int serverPort,
                                                                         String minecraftVersion,
                                                                         String pluginVersion) {
        // Créer le body de la requête selon l'API Laravel
        PairingRequest request = new PairingRequest();
        request.setPairingCode(pairingCode);
        request.setServerIp(serverIp);
        request.setServerPort(serverPort);
        request.setMinecraftVersion(minecraftVersion);
        request.setPluginVersion(pluginVersion);

        return postAsync("/servers/pair", request, PairingResponse.class);
    }

    // ==================== Server Status ====================

    /**
     * Envoie les statistiques du serveur
     */
    public CompletableFuture<ApiResponse<Void>> sendServerStats(ServerInfo stats) {
        return postAsync("/servers/" + config.getServerId() + "/stats", stats, Void.class);
    }

    /**
     * Récupère le statut de connexion du serveur
     */
    public CompletableFuture<ApiResponse<ServerInfo>> getServerStatus() {
        return getAsync("/servers/" + config.getServerId() + "/status", ServerInfo.class);
    }

    // ==================== Votes ====================

    /**
     * Récupère les votes en attente pour le serveur
     */
    public CompletableFuture<ApiResponse<VoteEvent[]>> getPendingVotes() {
        return getAsync("/servers/" + config.getServerId() + "/votes/pending", VoteEvent[].class);
    }

    /**
     * Récupère les votes en attente pour un joueur spécifique
     */
    public CompletableFuture<ApiResponse<VoteEvent[]>> getPlayerPendingVotes(String playerUuid) {
        return getAsync("/servers/" + config.getServerId() + "/votes/pending?player=" + playerUuid, VoteEvent[].class);
    }

    /**
     * Marque un vote comme réclamé et retourne les commandes à exécuter
     */
    public CompletableFuture<ApiResponse<ClaimResponse>> claimVote(String voteId) {
        return postAsync("/votes/" + voteId + "/claim", null, ClaimResponse.class);
    }

    // ==================== Leaderboard ====================

    /**
     * Récupère le classement des voteurs
     */
    public CompletableFuture<ApiResponse<LeaderboardEntry[]>> getLeaderboard(int page, int perPage) {
        return getAsync("/servers/" + config.getServerId() + "/leaderboard?page=" + page + "&per_page=" + perPage,
                LeaderboardEntry[].class);
    }

    /**
     * Récupère la position d'un joueur dans le classement
     */
    public CompletableFuture<ApiResponse<LeaderboardEntry>> getPlayerPosition(String playerUuid) {
        return getAsync("/servers/" + config.getServerId() + "/leaderboard/player/" + playerUuid,
                LeaderboardEntry.class);
    }

    // ==================== Vote Link ====================

    /**
     * Récupère le lien de vote pour le serveur
     */
    public CompletableFuture<ApiResponse<String>> getVoteLink() {
        return getAsync("/servers/" + config.getServerId() + "/vote-link", String.class);
    }

    // ==================== Internal HTTP Methods ====================

    private <T> CompletableFuture<ApiResponse<T>> getAsync(String endpoint, Class<T> responseClass) {
        String url = endpoint.startsWith("http") ? endpoint : getBaseUrl() + endpoint;

        Request request = new Request.Builder()
                .url(url)
                .get()
                .build();

        return executeAsync(request, responseClass);
    }

    private <T> CompletableFuture<ApiResponse<T>> postAsync(String endpoint, Object body, Class<T> responseClass) {
        String url = endpoint.startsWith("http") ? endpoint : getBaseUrl() + endpoint;

        RequestBody requestBody = body != null
                ? RequestBody.create(gson.toJson(body), JSON)
                : RequestBody.create("", JSON);

        Request request = new Request.Builder()
                .url(url)
                .post(requestBody)
                .build();

        return executeAsync(request, responseClass);
    }

    private <T> CompletableFuture<ApiResponse<T>> executeAsync(Request request, Class<T> responseClass) {
        CompletableFuture<ApiResponse<T>> future = new CompletableFuture<>();

        httpClient.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                future.complete(ApiResponse.error("Erreur de connexion: " + e.getMessage()));
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                try (ResponseBody body = response.body()) {
                    String bodyString = body != null ? body.string() : "";

                    if (response.isSuccessful()) {
                        if (responseClass == Void.class || bodyString.isEmpty()) {
                            future.complete(ApiResponse.success(null));
                        } else {
                            T data = gson.fromJson(bodyString, responseClass);
                            future.complete(ApiResponse.success(data));
                        }
                    } else {
                        // Essayer de parser l'erreur
                        try {
                            ErrorResponse error = gson.fromJson(bodyString, ErrorResponse.class);
                            future.complete(ApiResponse.error(error.getMessage()));
                        } catch (Exception e) {
                            future.complete(ApiResponse.error("Erreur HTTP " + response.code()));
                        }
                    }
                }
            }
        });

        return future;
    }

    /**
     * Ferme le client HTTP
     */
    public void shutdown() {
        httpClient.dispatcher().executorService().shutdown();
        httpClient.connectionPool().evictAll();
    }

    // ==================== Response Wrapper ====================

    /**
     * Wrapper pour les réponses API
     */
    public static class ApiResponse<T> {
        private final boolean success;
        private final T data;
        private final String error;

        private ApiResponse(boolean success, T data, String error) {
            this.success = success;
            this.data = data;
            this.error = error;
        }

        public static <T> ApiResponse<T> success(T data) {
            return new ApiResponse<>(true, data, null);
        }

        public static <T> ApiResponse<T> error(String error) {
            return new ApiResponse<>(false, null, error);
        }

        public boolean isSuccess() { return success; }
        public T getData() { return data; }
        public String getError() { return error; }
    }

    /**
     * Structure d'erreur de l'API
     */
    private static class ErrorResponse {
        private String error;
        private String message;

        public String getMessage() {
            return message != null ? message : error;
        }
    }
}
