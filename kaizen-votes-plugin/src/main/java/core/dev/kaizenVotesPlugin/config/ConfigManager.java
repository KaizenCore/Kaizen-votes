package core.dev.kaizenVotesPlugin.config;

import core.dev.kaizenVotesPlugin.KaizenVotesPlugin;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.serializer.legacy.LegacyComponentSerializer;
import org.bukkit.configuration.file.FileConfiguration;

import java.util.HashMap;
import java.util.Map;

/**
 * Gestionnaire de configuration pour le plugin Kaizen Votes.
 * Gère le chargement, la sauvegarde et l'accès aux valeurs de config.yml
 */
public class ConfigManager {

    private final KaizenVotesPlugin plugin;
    private FileConfiguration config;

    // Cache des messages formatés
    private final Map<String, String> messageCache = new HashMap<>();

    public ConfigManager(KaizenVotesPlugin plugin) {
        this.plugin = plugin;
        reload();
    }

    /**
     * Recharge la configuration depuis le fichier
     */
    public void reload() {
        plugin.saveDefaultConfig();
        plugin.reloadConfig();
        config = plugin.getConfig();
        messageCache.clear();
    }

    /**
     * Sauvegarde la configuration actuelle
     */
    public void save() {
        plugin.saveConfig();
    }

    // ==================== API Configuration ====================

    public String getApiBaseUrl() {
        return config.getString("api.base-url", "https://api.kaizen.gg");
    }

    public String getWebSocketUrl() {
        return config.getString("api.websocket-url", "wss://ws.kaizen.gg");
    }

    public boolean isWebSocketEnabled() {
        String wsUrl = getWebSocketUrl();
        return config.getBoolean("api.websocket-enabled", true)
            && wsUrl != null
            && !wsUrl.isEmpty();
    }

    // ==================== Auth Configuration ====================

    public String getServerToken() {
        return config.getString("auth.server-token", "");
    }

    public void setServerToken(String token) {
        config.set("auth.server-token", token);
        save();
    }

    public String getServerId() {
        return config.getString("auth.server-id", "");
    }

    public void setServerId(String serverId) {
        config.set("auth.server-id", serverId);
        save();
    }

    public boolean isLinked() {
        String token = getServerToken();
        String serverId = getServerId();
        return token != null && !token.isEmpty() && serverId != null && !serverId.isEmpty();
    }

    public void clearAuth() {
        config.set("auth.server-token", "");
        config.set("auth.server-id", "");
        save();
    }

    // ==================== Server Configuration ====================

    public String getServerName() {
        return config.getString("server.name", "Mon Serveur Minecraft");
    }

    // ==================== Rewards Configuration ====================

    public boolean isRewardsEnabled() {
        return config.getBoolean("rewards.enabled", true);
    }

    public boolean isBroadcastVotesEnabled() {
        return config.getBoolean("rewards.broadcast-votes", true);
    }

    public int getRewardExpirationDays() {
        return config.getInt("rewards.expiration-days", 30);
    }

    // ==================== Stats Configuration ====================

    public boolean isStatsEnabled() {
        return config.getBoolean("stats.enabled", true);
    }

    public int getStatsSyncInterval() {
        return config.getInt("stats.sync-interval", 60);
    }

    // ==================== Reminders Configuration ====================

    public boolean isRemindersEnabled() {
        return config.getBoolean("reminders.enabled", true);
    }

    public boolean isReminderOnJoinEnabled() {
        return config.getBoolean("reminders.on-join", true);
    }

    public int getReminderJoinDelay() {
        return config.getInt("reminders.join-delay", 5);
    }

    // ==================== Language ====================

    public String getLanguage() {
        return config.getString("language", "en");
    }

    // ==================== Messages (delegated to LanguageManager) ====================

    /**
     * Récupère un message formaté avec le préfixe
     * @param key La clé du message
     * @param placeholders Map des placeholders à remplacer (ex: {player} -> "Steve")
     * @return Le message formaté en Component
     */
    public Component getMessage(String key, Map<String, String> placeholders) {
        LanguageManager langManager = plugin.getLanguageManager();
        if (langManager != null) {
            return langManager.getMessage(key, placeholders);
        }
        // Fallback if language manager not initialized yet
        return LegacyComponentSerializer.legacyAmpersand().deserialize("&cMessage: " + key);
    }

    /**
     * Récupère un message formaté sans placeholders
     */
    public Component getMessage(String key) {
        return getMessage(key, null);
    }

    /**
     * Récupère un message formaté avec un seul placeholder
     */
    public Component getMessage(String key, String placeholderKey, String placeholderValue) {
        Map<String, String> placeholders = new HashMap<>();
        placeholders.put(placeholderKey, placeholderValue);
        return getMessage(key, placeholders);
    }

    /**
     * Récupère un message brut (sans préfixe, sans formatage)
     */
    public String getRawMessage(String key) {
        LanguageManager langManager = plugin.getLanguageManager();
        if (langManager != null) {
            return langManager.getRawMessage(key);
        }
        return "";
    }
}
