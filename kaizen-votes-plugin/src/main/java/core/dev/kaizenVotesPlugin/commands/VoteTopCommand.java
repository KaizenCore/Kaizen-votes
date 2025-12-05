package core.dev.kaizenVotesPlugin.commands;

import core.dev.kaizenVotesPlugin.KaizenVotesPlugin;
import core.dev.kaizenVotesPlugin.api.models.LeaderboardEntry;
import core.dev.kaizenVotesPlugin.config.ConfigManager;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.NamedTextColor;
import net.kyori.adventure.text.format.TextDecoration;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.jetbrains.annotations.NotNull;

import java.util.HashMap;
import java.util.Map;

/**
 * Commande /votetop - Affiche le classement des voteurs
 */
public class VoteTopCommand implements CommandExecutor {

    private final KaizenVotesPlugin plugin;
    private final ConfigManager config;

    private static final int ENTRIES_PER_PAGE = 10;

    public VoteTopCommand(KaizenVotesPlugin plugin) {
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

        // Récupérer le numéro de page
        int page = 1;
        if (args.length > 0) {
            try {
                page = Integer.parseInt(args[0]);
                if (page < 1) page = 1;
            } catch (NumberFormatException e) {
                page = 1;
            }
        }

        final int currentPage = page;

        // Récupérer le leaderboard depuis l'API
        plugin.getApiClient().getLeaderboard(page, ENTRIES_PER_PAGE).thenAccept(response -> {
            plugin.getServer().getScheduler().runTask(plugin, () -> {
                if (!response.isSuccess()) {
                    sender.sendMessage(config.getMessage("connection-error"));
                    return;
                }

                LeaderboardEntry[] entries = response.getData();

                if (entries == null || entries.length == 0) {
                    sender.sendMessage(Component.text("[Kaizen] ", NamedTextColor.GOLD)
                            .append(Component.text("Aucun vote enregistré pour le moment!", NamedTextColor.GRAY)));
                    return;
                }

                displayLeaderboard(sender, entries, currentPage);
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
     * Affiche le classement
     */
    private void displayLeaderboard(CommandSender sender, LeaderboardEntry[] entries, int page) {
        sender.sendMessage(Component.empty());
        sender.sendMessage(config.getMessage("leaderboard-header"));
        sender.sendMessage(Component.text("Page " + page, NamedTextColor.GRAY));
        sender.sendMessage(Component.empty());

        for (LeaderboardEntry entry : entries) {
            Component line = formatLeaderboardEntry(entry);
            sender.sendMessage(line);
        }

        sender.sendMessage(Component.empty());
        sender.sendMessage(Component.text("Utilise /votetop " + (page + 1) + " pour la page suivante", NamedTextColor.GRAY, TextDecoration.ITALIC));
        sender.sendMessage(Component.empty());
    }

    /**
     * Formate une entrée du classement
     */
    private Component formatLeaderboardEntry(LeaderboardEntry entry) {
        // Couleur selon la position
        NamedTextColor positionColor;
        String medal = "";

        switch (entry.getPosition()) {
            case 1:
                positionColor = NamedTextColor.GOLD;
                medal = "🥇 ";
                break;
            case 2:
                positionColor = NamedTextColor.GRAY;
                medal = "🥈 ";
                break;
            case 3:
                positionColor = NamedTextColor.RED;
                medal = "🥉 ";
                break;
            default:
                positionColor = NamedTextColor.YELLOW;
        }

        // Utiliser le message configuré
        Map<String, String> placeholders = new HashMap<>();
        placeholders.put("position", String.valueOf(entry.getPosition()));
        placeholders.put("player", entry.getPlayerName());
        placeholders.put("votes", String.valueOf(entry.getVotes()));

        // Format: #1 PlayerName - 42 votes
        return Component.text(medal, positionColor)
                .append(Component.text("#" + entry.getPosition() + " ", positionColor))
                .append(Component.text(entry.getPlayerName(), NamedTextColor.WHITE))
                .append(Component.text(" - ", NamedTextColor.GRAY))
                .append(Component.text(entry.getVotes() + " votes", NamedTextColor.GREEN));
    }
}
