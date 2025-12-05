package core.dev.kaizenVotesPlugin.listeners;

import core.dev.kaizenVotesPlugin.KaizenVotesPlugin;
import core.dev.kaizenVotesPlugin.api.models.VoteEvent;
import core.dev.kaizenVotesPlugin.config.ConfigManager;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.NamedTextColor;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;

/**
 * Listener pour les événements de connexion des joueurs
 * Gère les rappels de vote et la distribution des récompenses en attente
 */
public class PlayerJoinListener implements Listener {

    private final KaizenVotesPlugin plugin;
    private final ConfigManager config;

    public PlayerJoinListener(KaizenVotesPlugin plugin) {
        this.plugin = plugin;
        this.config = plugin.getConfigManager();
    }

    @EventHandler(priority = EventPriority.MONITOR)
    public void onPlayerJoin(PlayerJoinEvent event) {
        Player player = event.getPlayer();

        // Vérifier si le serveur est lié
        if (!config.isLinked()) {
            return;
        }

        // Planifier les actions avec un délai
        int delay = config.getReminderJoinDelay();

        plugin.getServer().getScheduler().runTaskLater(plugin, () -> {
            if (!player.isOnline()) {
                return;
            }

            // Vérifier les récompenses en attente
            checkPendingRewards(player);

            // Afficher le rappel de vote si activé
            if (config.isRemindersEnabled() && config.isReminderOnJoinEnabled()) {
                showVoteReminder(player);
            }

        }, delay * 20L); // Convertir secondes en ticks
    }

    /**
     * Vérifie et notifie le joueur des récompenses en attente
     */
    private void checkPendingRewards(Player player) {
        // Utiliser getPendingVotes() et filtrer par username côté client
        plugin.getApiClient().getPendingVotes().thenAccept(response -> {
            if (!response.isSuccess()) {
                return;
            }

            VoteEvent[] allPendingVotes = response.getData();
            if (allPendingVotes == null || allPendingVotes.length == 0) {
                return;
            }

            // Filtrer les votes pour ce joueur par username
            String playerName = player.getName();
            VoteEvent[] pendingVotes = java.util.Arrays.stream(allPendingVotes)
                    .filter(v -> playerName.equalsIgnoreCase(v.getPlayerName()))
                    .toArray(VoteEvent[]::new);

            if (pendingVotes.length == 0) {
                return;
            }

            // Notifier le joueur
            plugin.getServer().getScheduler().runTask(plugin, () -> {
                if (!player.isOnline()) {
                    return;
                }

                player.sendMessage(Component.empty());
                player.sendMessage(Component.text("[Kaizen] ", NamedTextColor.GOLD)
                        .append(Component.text("Tu as ", NamedTextColor.WHITE))
                        .append(Component.text(pendingVotes.length, NamedTextColor.GREEN))
                        .append(Component.text(" récompense(s) de vote en attente!", NamedTextColor.WHITE)));
                player.sendMessage(Component.text("[Kaizen] ", NamedTextColor.GOLD)
                        .append(Component.text("Tape ", NamedTextColor.GRAY))
                        .append(Component.text("/rewards", NamedTextColor.AQUA))
                        .append(Component.text(" pour les réclamer!", NamedTextColor.GRAY)));
                player.sendMessage(Component.empty());
            });

        }).exceptionally(ex -> {
            // Silently fail - pas besoin de notifier pour une erreur réseau
            return null;
        });
    }

    /**
     * Affiche le rappel de vote au joueur
     */
    private void showVoteReminder(Player player) {
        player.sendMessage(config.getMessage("vote-reminder"));
    }
}
