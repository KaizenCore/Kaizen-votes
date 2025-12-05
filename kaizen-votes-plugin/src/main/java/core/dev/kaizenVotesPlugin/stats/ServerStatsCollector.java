package core.dev.kaizenVotesPlugin.stats;

import core.dev.kaizenVotesPlugin.KaizenVotesPlugin;
import core.dev.kaizenVotesPlugin.api.models.ServerInfo;
import core.dev.kaizenVotesPlugin.api.models.VoteEvent;
import core.dev.kaizenVotesPlugin.config.ConfigManager;
import org.bukkit.Bukkit;
import org.bukkit.Server;
import org.bukkit.entity.Player;
import org.bukkit.scheduler.BukkitTask;

/**
 * Collecteur et synchroniseur des statistiques du serveur
 */
public class ServerStatsCollector {

    private final KaizenVotesPlugin plugin;
    private final ConfigManager config;

    private BukkitTask syncTask;
    private BukkitTask votePollingTask;
    private long serverStartTime;

    public ServerStatsCollector(KaizenVotesPlugin plugin) {
        this.plugin = plugin;
        this.config = plugin.getConfigManager();
        this.serverStartTime = System.currentTimeMillis();
    }

    /**
     * Démarre la synchronisation périodique des stats
     */
    public void start() {
        if (!config.isStatsEnabled()) {
            plugin.getLogger().info("Synchronisation des stats désactivée");
            return;
        }

        if (!config.isLinked()) {
            plugin.getLogger().info("Serveur non lié, sync des stats en attente");
            return;
        }

        int intervalSeconds = config.getStatsSyncInterval();
        long intervalTicks = intervalSeconds * 20L;

        // Annuler la tâche existante si présente
        stop();

        // Démarrer la nouvelle tâche de stats
        syncTask = plugin.getServer().getScheduler().runTaskTimerAsynchronously(
                plugin,
                this::syncStats,
                100L, // Délai initial de 5 secondes
                intervalTicks
        );

        // Démarrer le polling des votes si WebSocket est désactivé
        if (!config.isWebSocketEnabled()) {
            startVotePolling();
        }

        plugin.getLogger().info("Synchronisation des stats démarrée (intervalle: " + intervalSeconds + "s)");
    }

    /**
     * Arrête la synchronisation
     */
    public void stop() {
        if (syncTask != null) {
            syncTask.cancel();
            syncTask = null;
        }
        if (votePollingTask != null) {
            votePollingTask.cancel();
            votePollingTask = null;
        }
    }

    /**
     * Démarre le polling périodique des votes
     */
    private void startVotePolling() {
        // Poll toutes les 10 secondes (200 ticks)
        votePollingTask = plugin.getServer().getScheduler().runTaskTimerAsynchronously(
                plugin,
                this::pollPendingVotes,
                60L, // Délai initial de 3 secondes
                200L // Toutes les 10 secondes
        );
        plugin.getLogger().info("Polling des votes activé (WebSocket désactivé)");
    }

    /**
     * Poll l'API pour les votes en attente et les traite
     */
    private void pollPendingVotes() {
        if (!config.isLinked()) {
            return;
        }

        plugin.getApiClient().getPendingVotes().thenAccept(response -> {
            if (!response.isSuccess()) {
                plugin.getLogger().warning("Erreur polling votes: " + response.getError());
                return;
            }

            VoteEvent[] votes = response.getData();
            if (votes == null || votes.length == 0) {
                return;
            }

            // Traiter chaque vote
            for (VoteEvent vote : votes) {
                processVote(vote);
            }
        }).exceptionally(ex -> {
            plugin.getLogger().warning("Erreur polling votes: " + ex.getMessage());
            return null;
        });
    }

    /**
     * Traite un vote individuel
     */
    private void processVote(VoteEvent vote) {
        // Vérifier si le joueur est en ligne (par son username)
        Player player = Bukkit.getPlayer(vote.getPlayerName());

        if (player != null && player.isOnline()) {
            // Le joueur est en ligne, distribuer les récompenses
            plugin.getServer().getScheduler().runTask(plugin, () -> {
                plugin.getRewardManager().processIncomingVote(vote);
            });
        }
        // Si le joueur n'est pas en ligne, les récompenses seront réclamées plus tard
    }

    /**
     * Synchronise les stats avec le backend
     */
    private void syncStats() {
        if (!config.isLinked()) {
            return;
        }

        ServerInfo stats = collectStats();

        plugin.getApiClient().sendServerStats(stats).thenAccept(response -> {
            if (!response.isSuccess()) {
                plugin.getLogger().warning("Erreur sync stats: " + response.getError());
            }
        }).exceptionally(ex -> {
            plugin.getLogger().warning("Erreur sync stats: " + ex.getMessage());
            return null;
        });
    }

    /**
     * Collecte les statistiques actuelles du serveur
     */
    public ServerInfo collectStats() {
        Server server = plugin.getServer();

        return ServerInfo.builder()
                .serverId(config.getServerId())
                .name(config.getServerName())
                .ip(server.getIp().isEmpty() ? "0.0.0.0" : server.getIp())
                .port(server.getPort())
                .version(server.getMinecraftVersion())
                .playersOnline(server.getOnlinePlayers().size())
                .maxPlayers(server.getMaxPlayers())
                .tps(getAverageTps())
                .uptime(getUptime())
                .pluginVersion(plugin.getDescription().getVersion())
                .build();
    }

    /**
     * Récupère le TPS moyen du serveur
     */
    private double getAverageTps() {
        try {
            // Paper API pour récupérer le TPS
            double[] tps = plugin.getServer().getTPS();
            if (tps.length > 0) {
                // TPS des dernières 1 minute, plafonné à 20
                return Math.min(20.0, tps[0]);
            }
        } catch (Exception e) {
            // Fallback si l'API n'est pas disponible
        }
        return 20.0;
    }

    /**
     * Récupère l'uptime du serveur en secondes
     */
    private long getUptime() {
        return (System.currentTimeMillis() - serverStartTime) / 1000;
    }

    /**
     * Force une synchronisation immédiate
     */
    public void forceSyncNow() {
        plugin.getServer().getScheduler().runTaskAsynchronously(plugin, this::syncStats);
    }
}
