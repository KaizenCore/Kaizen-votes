package core.dev.kaizenVotesPlugin.config;

import core.dev.kaizenVotesPlugin.KaizenVotesPlugin;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.serializer.legacy.LegacyComponentSerializer;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.configuration.file.YamlConfiguration;

import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * Manages language/translations for the plugin.
 * Supports multiple languages with fallback to English.
 */
public class LanguageManager {

    private final KaizenVotesPlugin plugin;
    private FileConfiguration messages;
    private FileConfiguration fallbackMessages;
    private String currentLanguage;

    private static final String[] SUPPORTED_LANGUAGES = {"en", "fr"};
    private static final String DEFAULT_LANGUAGE = "en";

    public LanguageManager(KaizenVotesPlugin plugin) {
        this.plugin = plugin;
        this.currentLanguage = DEFAULT_LANGUAGE;
    }

    /**
     * Load the language files based on config setting.
     */
    public void load(String language) {
        this.currentLanguage = isLanguageSupported(language) ? language : DEFAULT_LANGUAGE;

        // Save default language files if they don't exist
        saveDefaultLanguageFiles();

        // Load the selected language file
        File langFile = new File(plugin.getDataFolder(), "lang/messages_" + currentLanguage + ".yml");
        if (langFile.exists()) {
            messages = YamlConfiguration.loadConfiguration(langFile);
        } else {
            // Load from resources as fallback
            InputStream stream = plugin.getResource("lang/messages_" + currentLanguage + ".yml");
            if (stream != null) {
                messages = YamlConfiguration.loadConfiguration(new InputStreamReader(stream, StandardCharsets.UTF_8));
            }
        }

        // Always load English as fallback
        if (!currentLanguage.equals(DEFAULT_LANGUAGE)) {
            File fallbackFile = new File(plugin.getDataFolder(), "lang/messages_" + DEFAULT_LANGUAGE + ".yml");
            if (fallbackFile.exists()) {
                fallbackMessages = YamlConfiguration.loadConfiguration(fallbackFile);
            } else {
                InputStream stream = plugin.getResource("lang/messages_" + DEFAULT_LANGUAGE + ".yml");
                if (stream != null) {
                    fallbackMessages = YamlConfiguration.loadConfiguration(new InputStreamReader(stream, StandardCharsets.UTF_8));
                }
            }
        } else {
            fallbackMessages = messages;
        }

        plugin.getLogger().info("Loaded language: " + currentLanguage);
    }

    /**
     * Save default language files to plugin data folder.
     */
    private void saveDefaultLanguageFiles() {
        File langFolder = new File(plugin.getDataFolder(), "lang");
        if (!langFolder.exists()) {
            langFolder.mkdirs();
        }

        for (String lang : SUPPORTED_LANGUAGES) {
            File langFile = new File(langFolder, "messages_" + lang + ".yml");
            if (!langFile.exists()) {
                plugin.saveResource("lang/messages_" + lang + ".yml", false);
            }
        }
    }

    /**
     * Check if a language is supported.
     */
    private boolean isLanguageSupported(String language) {
        for (String lang : SUPPORTED_LANGUAGES) {
            if (lang.equalsIgnoreCase(language)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get the current language code.
     */
    public String getCurrentLanguage() {
        return currentLanguage;
    }

    /**
     * Get a raw message string from the language file.
     */
    public String getRawMessage(String key) {
        String message = messages.getString(key);
        if (message == null && fallbackMessages != null) {
            message = fallbackMessages.getString(key);
        }
        return message != null ? message : "&cMissing message: " + key;
    }

    /**
     * Get a formatted message with prefix as Component.
     */
    public Component getMessage(String key, Map<String, String> placeholders) {
        String prefix = getRawMessage("prefix");
        String message = getRawMessage(key);

        String fullMessage = prefix + message;

        // Replace placeholders
        if (placeholders != null) {
            for (Map.Entry<String, String> entry : placeholders.entrySet()) {
                fullMessage = fullMessage.replace("{" + entry.getKey() + "}", entry.getValue());
            }
        }

        // Convert legacy color codes (&) to Adventure format
        return LegacyComponentSerializer.legacyAmpersand().deserialize(fullMessage);
    }

    /**
     * Get a formatted message without placeholders.
     */
    public Component getMessage(String key) {
        return getMessage(key, null);
    }

    /**
     * Get a formatted message with a single placeholder.
     */
    public Component getMessage(String key, String placeholderKey, String placeholderValue) {
        Map<String, String> placeholders = new HashMap<>();
        placeholders.put(placeholderKey, placeholderValue);
        return getMessage(key, placeholders);
    }

    /**
     * Reload the language files.
     */
    public void reload(String language) {
        load(language);
    }
}
