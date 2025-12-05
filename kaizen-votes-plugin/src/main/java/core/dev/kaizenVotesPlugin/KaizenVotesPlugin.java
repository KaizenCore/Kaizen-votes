package core.dev.kaizenVotesPlugin;

import core.dev.kaizenVotesPlugin.api.KaizenApiClient;
import core.dev.kaizenVotesPlugin.api.KaizenWebSocketClient;
import core.dev.kaizenVotesPlugin.commands.KaizenCommand;
import core.dev.kaizenVotesPlugin.commands.RewardsCommand;
import core.dev.kaizenVotesPlugin.commands.VoteCommand;
import core.dev.kaizenVotesPlugin.commands.VoteTopCommand;
import core.dev.kaizenVotesPlugin.config.ConfigManager;
import core.dev.kaizenVotesPlugin.config.LanguageManager;
import core.dev.kaizenVotesPlugin.listeners.PlayerJoinListener;
import core.dev.kaizenVotesPlugin.rewards.RewardManager;
import core.dev.kaizenVotesPlugin.stats.ServerStatsCollector;
import core.dev.kaizenVotesPlugin.utils.TokenGenerator;
import org.bukkit.plugin.java.JavaPlugin;

/**
 * Plugin principal Kaizen Votes
 * Système de vote nouvelle génération pour serveurs Minecraft
 */
public final class KaizenVotesPlugin extends JavaPlugin {

    private static KaizenVotesPlugin instance;

    // Managers
    private ConfigManager configManager;
    private LanguageManager languageManager;
    private TokenGenerator tokenGenerator;
    private KaizenApiClient apiClient;
    private KaizenWebSocketClient webSocketClient;
    private RewardManager rewardManager;
    private ServerStatsCollector statsCollector;

    @Override
    public void onEnable() {
        instance = this;

        // Afficher le banner
        printBanner();

        // Initialiser les composants
        getLogger().info("Initialisation des composants...");

        // 1. Configuration
        configManager = new ConfigManager(this);
        getLogger().info("✓ Configuration chargée");

        // 1.5. Language Manager
        languageManager = new LanguageManager(this);
        languageManager.load(configManager.getLanguage());
        getLogger().info("✓ Langue chargée: " + languageManager.getCurrentLanguage());

        // 2. Token Generator
        tokenGenerator = new TokenGenerator();
        getLogger().info("✓ Générateur de tokens initialisé");

        // 3. API Client
        apiClient = new KaizenApiClient(this);
        getLogger().info("✓ Client API initialisé");

        // 4. WebSocket Client (si activé)
        if (configManager.isWebSocketEnabled()) {
            webSocketClient = new KaizenWebSocketClient(this);
            setupWebSocketHandlers();
            getLogger().info("✓ Client WebSocket initialisé");
        } else {
            getLogger().info("○ WebSocket désactivé (utilisation du polling API)");
        }

        // 5. Reward Manager
        rewardManager = new RewardManager(this);
        getLogger().info("✓ Gestionnaire de récompenses initialisé");

        // 6. Stats Collector
        statsCollector = new ServerStatsCollector(this);
        getLogger().info("✓ Collecteur de statistiques initialisé");

        // Enregistrer les commandes
        registerCommands();
        getLogger().info("✓ Commandes enregistrées");

        // Enregistrer les listeners
        registerListeners();
        getLogger().info("✓ Listeners enregistrés");

        // Connexion automatique si déjà lié
        if (configManager.isLinked()) {
            getLogger().info("Serveur déjà lié, connexion au backend...");
            if (webSocketClient != null) {
                webSocketClient.connect();
            }
            statsCollector.start();
        } else {
            getLogger().info("Serveur non lié. Utilisez /kaizen link pour connecter.");
        }

        getLogger().info("Kaizen Votes v" + getDescription().getVersion() + " activé!");
    }

    @Override
    public void onDisable() {
        getLogger().info("Arrêt de Kaizen Votes...");

        // Arrêter le collecteur de stats
        if (statsCollector != null) {
            statsCollector.stop();
        }

        // Déconnecter le WebSocket
        if (webSocketClient != null) {
            webSocketClient.disconnect();
        }

        // Fermer le client HTTP
        if (apiClient != null) {
            apiClient.shutdown();
        }

        getLogger().info("Kaizen Votes désactivé.");
        instance = null;
    }

    /**
     * Affiche le banner au démarrage
     */
    private void printBanner() {
        getLogger().info("");
        getLogger().info("╔═══════════════════════════════════════╗");
        getLogger().info("║         KAIZEN VOTES v" + getDescription().getVersion() + "           ║");
        getLogger().info("║   Système de vote nouvelle génération  ║");
        getLogger().info("║           https://kaizen.gg            ║");
        getLogger().info("╚═══════════════════════════════════════╝");
        getLogger().info("");
    }

    /**
     * Enregistre les commandes
     */
    private void registerCommands() {
        KaizenCommand kaizenCmd = new KaizenCommand(this);
        getCommand("kaizen").setExecutor(kaizenCmd);
        getCommand("kaizen").setTabCompleter(kaizenCmd);

        getCommand("vote").setExecutor(new VoteCommand(this));
        getCommand("rewards").setExecutor(new RewardsCommand(this));
        getCommand("votetop").setExecutor(new VoteTopCommand(this));
    }

    /**
     * Enregistre les listeners
     */
    private void registerListeners() {
        getServer().getPluginManager().registerEvents(new PlayerJoinListener(this), this);
    }

    /**
     * Configure les handlers WebSocket
     */
    private void setupWebSocketHandlers() {
        webSocketClient
                .onVoteReceived(vote -> {
                    getLogger().info("Vote reçu de " + vote.getPlayerName());
                    rewardManager.processIncomingVote(vote);
                })
                .onConnected(() -> {
                    getLogger().info("WebSocket connecté au backend Kaizen");
                    // Démarrer la sync des stats si pas déjà fait
                    statsCollector.start();
                })
                .onDisconnected(reason -> {
                    getLogger().warning("WebSocket déconnecté: " + reason);
                })
                .onError(error -> {
                    getLogger().warning("Erreur WebSocket: " + error);
                });
    }

    // ==================== Getters ====================

    public static KaizenVotesPlugin getInstance() {
        return instance;
    }

    public ConfigManager getConfigManager() {
        return configManager;
    }

    public LanguageManager getLanguageManager() {
        return languageManager;
    }

    public TokenGenerator getTokenGenerator() {
        return tokenGenerator;
    }

    public KaizenApiClient getApiClient() {
        return apiClient;
    }

    public KaizenWebSocketClient getWebSocketClient() {
        return webSocketClient;
    }

    public RewardManager getRewardManager() {
        return rewardManager;
    }

    public ServerStatsCollector getStatsCollector() {
        return statsCollector;
    }
}
