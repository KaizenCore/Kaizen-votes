package core.dev.kaizenVotesPlugin.commands;

import core.dev.kaizenVotesPlugin.KaizenVotesPlugin;
import core.dev.kaizenVotesPlugin.api.models.VoteEvent;
import core.dev.kaizenVotesPlugin.config.ConfigManager;
import core.dev.kaizenVotesPlugin.rewards.RewardManager;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.NamedTextColor;
import net.kyori.adventure.text.format.TextDecoration;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.jetbrains.annotations.NotNull;

/**
 * Commande /rewards - Réclame les récompenses de vote en attente
 */
public class RewardsCommand implements CommandExecutor {

    private final KaizenVotesPlugin plugin;
    private final ConfigManager config;

    public RewardsCommand(KaizenVotesPlugin plugin) {
        this.plugin = plugin;
        this.config = plugin.getConfigManager();
    }

    @Override
    public boolean onCommand(@NotNull CommandSender sender, @NotNull Command command,
                            @NotNull String label, @NotNull String[] args) {

        // Vérifier que c'est un joueur
        if (!(sender instanceof Player player)) {
            sender.sendMessage(Component.text("Cette commande doit être exécutée par un joueur!", NamedTextColor.RED));
            return true;
        }

        // Vérifier si le serveur est lié
        if (!config.isLinked()) {
            sender.sendMessage(config.getMessage("not-linked"));
            return true;
        }

        // Vérifier si les récompenses sont activées
        if (!config.isRewardsEnabled()) {
            sender.sendMessage(Component.text("[Kaizen] ", NamedTextColor.GOLD)
                    .append(Component.text("Les récompenses sont désactivées sur ce serveur.", NamedTextColor.GRAY)));
            return true;
        }

        // Récupérer tous les votes en attente et filtrer par username
        plugin.getApiClient().getPendingVotes().thenAccept(response -> {
            plugin.getServer().getScheduler().runTask(plugin, () -> {
                if (!response.isSuccess()) {
                    player.sendMessage(config.getMessage("connection-error"));
                    return;
                }

                VoteEvent[] allPendingVotes = response.getData();

                if (allPendingVotes == null || allPendingVotes.length == 0) {
                    player.sendMessage(config.getMessage("no-pending-rewards"));
                    return;
                }

                // Filtrer les votes pour ce joueur par username
                String playerName = player.getName();
                VoteEvent[] pendingVotes = java.util.Arrays.stream(allPendingVotes)
                        .filter(v -> playerName.equalsIgnoreCase(v.getPlayerName()))
                        .toArray(VoteEvent[]::new);

                if (pendingVotes.length == 0) {
                    player.sendMessage(config.getMessage("no-pending-rewards"));
                    return;
                }

                // Afficher le header
                player.sendMessage(Component.empty());
                player.sendMessage(Component.text("═══ RÉCOMPENSES DE VOTE ═══", NamedTextColor.GOLD));
                player.sendMessage(Component.text(pendingVotes.length + " vote(s) à réclamer!", NamedTextColor.GREEN));
                player.sendMessage(Component.empty());

                // Distribuer les récompenses
                RewardManager rewardManager = plugin.getRewardManager();
                int claimedCount = 0;

                for (VoteEvent vote : pendingVotes) {
                    boolean claimed = rewardManager.claimRewards(player, vote);
                    if (claimed) {
                        claimedCount++;
                    }
                }

                // Message de confirmation
                if (claimedCount > 0) {
                    player.sendMessage(config.getMessage("reward-claimed"));
                }

                player.sendMessage(Component.text("═══════════════════════════", NamedTextColor.GOLD));
                player.sendMessage(Component.empty());
            });
        }).exceptionally(ex -> {
            plugin.getServer().getScheduler().runTask(plugin, () -> {
                player.sendMessage(config.getMessage("connection-error"));
            });
            return null;
        });

        return true;
    }
}
