package core.dev.kaizenVotesPlugin.commands;

import core.dev.kaizenVotesPlugin.KaizenVotesPlugin;
import core.dev.kaizenVotesPlugin.config.ConfigManager;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.event.ClickEvent;
import net.kyori.adventure.text.event.HoverEvent;
import net.kyori.adventure.text.format.NamedTextColor;
import net.kyori.adventure.text.format.TextDecoration;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.jetbrains.annotations.NotNull;

import java.util.HashMap;
import java.util.Map;

/**
 * Commande /vote - Affiche le lien de vote
 */
public class VoteCommand implements CommandExecutor {

    private final KaizenVotesPlugin plugin;
    private final ConfigManager config;

    // Cache du lien de vote
    private String cachedVoteLink = null;
    private long cacheExpiry = 0;
    private static final long CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    public VoteCommand(KaizenVotesPlugin plugin) {
        this.plugin = plugin;
        this.config = plugin.getConfigManager();
    }

    @Override
    public boolean onCommand(@NotNull CommandSender sender, @NotNull Command command,
                            @NotNull String label, @NotNull String[] args) {

        // Vérifier si le serveur est lié
        if (!config.isLinked()) {
            sender.sendMessage(config.getMessage("not-linked"));
            return true;
        }

        // Utiliser le cache si valide
        if (cachedVoteLink != null && System.currentTimeMillis() < cacheExpiry) {
            displayVoteLink(sender, cachedVoteLink);
            return true;
        }

        // Récupérer le lien de vote depuis l'API
        plugin.getApiClient().getVoteLink().thenAccept(response -> {
            plugin.getServer().getScheduler().runTask(plugin, () -> {
                if (response.isSuccess() && response.getData() != null) {
                    cachedVoteLink = response.getData();
                    cacheExpiry = System.currentTimeMillis() + CACHE_DURATION;
                    displayVoteLink(sender, cachedVoteLink);
                } else {
                    // Fallback vers un lien par défaut
                    String defaultLink = "https://kaizen.gg/vote/" + config.getServerId();
                    displayVoteLink(sender, defaultLink);
                }
            });
        }).exceptionally(ex -> {
            plugin.getServer().getScheduler().runTask(plugin, () -> {
                sender.sendMessage(config.getMessage("connection-error"));
            });
            return null;
        });

        return true;
    }

    /**
     * Affiche le lien de vote au joueur
     */
    private void displayVoteLink(CommandSender sender, String voteLink) {
        String headerText = config.getRawMessage("vote-header");
        String clickText = config.getRawMessage("vote-click-to-vote");
        String hoverText = config.getRawMessage("vote-click-hover");
        String thankYouText = config.getRawMessage("vote-thank-you");

        sender.sendMessage(Component.empty());
        sender.sendMessage(Component.text("═══════════════════════════════", NamedTextColor.GOLD));
        sender.sendMessage(Component.text("         " + headerText, NamedTextColor.GOLD, TextDecoration.BOLD));
        sender.sendMessage(Component.text("═══════════════════════════════", NamedTextColor.GOLD));
        sender.sendMessage(Component.empty());

        // Message avec placeholder
        Map<String, String> placeholders = new HashMap<>();
        placeholders.put("link", voteLink);
        sender.sendMessage(config.getMessage("vote-link", placeholders));

        sender.sendMessage(Component.empty());

        // Lien cliquable
        Component linkButton = Component.text("  ➤ ", NamedTextColor.GRAY)
                .append(Component.text(clickText, NamedTextColor.GREEN, TextDecoration.BOLD)
                        .clickEvent(ClickEvent.openUrl(voteLink))
                        .hoverEvent(HoverEvent.showText(Component.text(hoverText, NamedTextColor.YELLOW))));
        sender.sendMessage(linkButton);

        sender.sendMessage(Component.empty());
        sender.sendMessage(Component.text(thankYouText, NamedTextColor.YELLOW, TextDecoration.ITALIC));
        sender.sendMessage(Component.text("═══════════════════════════════", NamedTextColor.GOLD));
        sender.sendMessage(Component.empty());
    }
}
