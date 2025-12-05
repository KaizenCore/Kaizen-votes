package core.dev.kaizenVotesPlugin.rewards;

import core.dev.kaizenVotesPlugin.KaizenVotesPlugin;
import core.dev.kaizenVotesPlugin.api.models.ClaimResponse;
import core.dev.kaizenVotesPlugin.api.models.PlayerReward;
import core.dev.kaizenVotesPlugin.api.models.VoteEvent;
import core.dev.kaizenVotesPlugin.config.ConfigManager;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.NamedTextColor;
import org.bukkit.Bukkit;
import org.bukkit.Material;
import org.bukkit.entity.Player;
import org.bukkit.inventory.ItemStack;

import java.util.HashMap;
import java.util.Map;

/**
 * Gestionnaire de distribution des récompenses de vote
 */
public class RewardManager {

    private final KaizenVotesPlugin plugin;
    private final ConfigManager config;

    public RewardManager(KaizenVotesPlugin plugin) {
        this.plugin = plugin;
        this.config = plugin.getConfigManager();
    }

    /**
     * Réclame les récompenses d'un vote pour un joueur
     * Appelle l'API claim et exécute les commandes retournées
     * @param player Le joueur
     * @param vote L'événement de vote
     * @return true si le claim a été initié (async)
     */
    public boolean claimRewards(Player player, VoteEvent vote) {
        if (vote.isClaimed()) {
            return false;
        }

        // Appeler l'API claim qui retourne les commandes à exécuter
        plugin.getApiClient().claimVote(vote.getId()).thenAccept(response -> {
            if (!response.isSuccess()) {
                plugin.getLogger().warning("Erreur claim vote " + vote.getId() + ": " + response.getError());
                return;
            }

            ClaimResponse claimResponse = response.getData();
            if (claimResponse == null || !claimResponse.isSuccess()) {
                plugin.getLogger().warning("Claim vote " + vote.getId() + " non réussi");
                return;
            }

            ClaimResponse.ClaimData data = claimResponse.getData();
            if (data == null) {
                plugin.getLogger().warning("Claim vote " + vote.getId() + " sans data");
                return;
            }

            String[] commands = data.getCommands();
            if (commands == null || commands.length == 0) {
                plugin.getLogger().info("Vote " + vote.getId() + " réclamé (pas de commandes)");
                return;
            }

            // Exécuter les commandes sur le thread principal
            plugin.getServer().getScheduler().runTask(plugin, () -> {
                if (!player.isOnline()) {
                    plugin.getLogger().warning("Joueur " + player.getName() + " déconnecté avant exécution des commandes");
                    return;
                }

                for (String command : commands) {
                    executeCommand(player, command);
                }

                plugin.getLogger().info("Vote " + vote.getId() + " réclamé: " + commands.length + " commande(s) exécutée(s)");
            });

        }).exceptionally(ex -> {
            plugin.getLogger().warning("Erreur claim vote " + vote.getId() + ": " + ex.getMessage());
            return null;
        });

        return true;
    }

    /**
     * Exécute une commande avec les placeholders remplacés
     */
    private void executeCommand(Player player, String command) {
        if (command == null || command.isEmpty()) {
            return;
        }

        // Remplacer les placeholders
        command = command.replace("{player}", player.getName())
                        .replace("{uuid}", player.getUniqueId().toString());

        try {
            plugin.getLogger().info("Exécution commande: " + command);
            Bukkit.dispatchCommand(Bukkit.getConsoleSender(), command);
        } catch (Exception e) {
            plugin.getLogger().severe("Erreur exécution commande: " + command + " - " + e.getMessage());
        }
    }

    /**
     * Distribue une récompense individuelle
     */
    private boolean distributeReward(Player player, PlayerReward reward) {
        if (reward.getType() == null) {
            plugin.getLogger().warning("Type de récompense null pour " + reward.getId());
            return false;
        }

        switch (reward.getType()) {
            case COMMAND:
                return executeCommandReward(player, reward);
            case ITEM:
                return giveItemReward(player, reward);
            case MONEY:
                return giveMoneyReward(player, reward);
            case EXPERIENCE:
                return giveExperienceReward(player, reward);
            default:
                plugin.getLogger().warning("Type de récompense non supporté: " + reward.getType());
                return false;
        }
    }

    /**
     * Exécute une commande en récompense
     */
    private boolean executeCommandReward(Player player, PlayerReward reward) {
        String command = reward.getCommand();
        if (command == null || command.isEmpty()) {
            return false;
        }

        // Remplacer les placeholders
        command = command.replace("{player}", player.getName())
                        .replace("{uuid}", player.getUniqueId().toString());

        // Exécuter la commande depuis la console
        try {
            Bukkit.dispatchCommand(Bukkit.getConsoleSender(), command);
            return true;
        } catch (Exception e) {
            plugin.getLogger().severe("Erreur exécution commande: " + command + " - " + e.getMessage());
            return false;
        }
    }

    /**
     * Donne un item en récompense
     */
    private boolean giveItemReward(Player player, PlayerReward reward) {
        String itemName = reward.getItem();
        int amount = Math.max(1, reward.getAmount());

        if (itemName == null || itemName.isEmpty()) {
            return false;
        }

        try {
            Material material = Material.matchMaterial(itemName.toUpperCase());
            if (material == null) {
                plugin.getLogger().warning("Material invalide: " + itemName);
                return false;
            }

            ItemStack item = new ItemStack(material, amount);

            // Vérifier si l'inventaire a de la place
            HashMap<Integer, ItemStack> overflow = player.getInventory().addItem(item);

            if (!overflow.isEmpty()) {
                // Drop les items qui n'ont pas pu être ajoutés
                for (ItemStack dropped : overflow.values()) {
                    player.getWorld().dropItemNaturally(player.getLocation(), dropped);
                }
                player.sendMessage(Component.text("[Kaizen] ", NamedTextColor.GOLD)
                        .append(Component.text("Inventaire plein! Items droppés au sol.", NamedTextColor.YELLOW)));
            }

            return true;
        } catch (Exception e) {
            plugin.getLogger().severe("Erreur don item: " + e.getMessage());
            return false;
        }
    }

    /**
     * Donne de l'argent en récompense (nécessite Vault)
     */
    private boolean giveMoneyReward(Player player, PlayerReward reward) {
        int amount = reward.getAmount();

        // Essayer d'utiliser Vault si disponible
        if (plugin.getServer().getPluginManager().getPlugin("Vault") != null) {
            // Utiliser une commande eco générique
            String command = "eco give " + player.getName() + " " + amount;
            try {
                Bukkit.dispatchCommand(Bukkit.getConsoleSender(), command);
                return true;
            } catch (Exception e) {
                plugin.getLogger().warning("Vault non configuré correctement pour les récompenses monétaires");
            }
        }

        // Fallback: afficher un message
        player.sendMessage(Component.text("[Kaizen] ", NamedTextColor.GOLD)
                .append(Component.text("Récompense: " + amount + " coins (nécessite un plugin d'économie)", NamedTextColor.YELLOW)));

        return true;
    }

    /**
     * Donne de l'expérience en récompense
     */
    private boolean giveExperienceReward(Player player, PlayerReward reward) {
        int amount = Math.max(0, reward.getAmount());
        player.giveExp(amount);

        player.sendMessage(Component.text("[Kaizen] ", NamedTextColor.GOLD)
                .append(Component.text("+" + amount + " XP!", NamedTextColor.GREEN)));

        return true;
    }

    /**
     * Traite un vote entrant (appelé lors de la réception d'un événement WebSocket ou polling)
     */
    public void processIncomingVote(VoteEvent vote) {
        // Broadcast le vote si activé
        if (config.isBroadcastVotesEnabled()) {
            Map<String, String> placeholders = new HashMap<>();
            placeholders.put("player", vote.getPlayerName());
            Component message = config.getMessage("vote-received", placeholders);
            plugin.getServer().broadcast(message);
        }

        // Vérifier si le joueur est en ligne
        Player player = Bukkit.getPlayer(vote.getPlayerName());
        if (player != null && player.isOnline()) {
            // Distribuer les récompenses immédiatement
            claimRewards(player, vote);
        }
        // Sinon, les récompenses seront réclamées via /rewards ou au prochain login
    }
}
