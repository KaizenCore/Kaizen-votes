package core.dev.kaizenVotesPlugin.commands;

import core.dev.kaizenVotesPlugin.KaizenVotesPlugin;
import core.dev.kaizenVotesPlugin.config.ConfigManager;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.event.ClickEvent;
import net.kyori.adventure.text.format.NamedTextColor;
import net.kyori.adventure.text.format.TextDecoration;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.command.TabCompleter;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Commande principale /kaizen avec sous-commandes
 */
public class KaizenCommand implements CommandExecutor, TabCompleter {

    private final KaizenVotesPlugin plugin;
    private final ConfigManager config;

    private static final List<String> SUBCOMMANDS = Arrays.asList("link", "unlink", "status", "reload");

    public KaizenCommand(KaizenVotesPlugin plugin) {
        this.plugin = plugin;
        this.config = plugin.getConfigManager();
    }

    @Override
    public boolean onCommand(@NotNull CommandSender sender, @NotNull Command command,
                            @NotNull String label, @NotNull String[] args) {
        if (args.length == 0) {
            showHelp(sender);
            return true;
        }

        String subCommand = args[0].toLowerCase();

        switch (subCommand) {
            case "link":
                // Récupérer le code si fourni
                String code = args.length > 1 ? args[1] : null;
                handleLink(sender, code);
                break;
            case "unlink":
                handleUnlink(sender);
                break;
            case "status":
                handleStatus(sender);
                break;
            case "reload":
                handleReload(sender);
                break;
            default:
                showHelp(sender);
        }

        return true;
    }

    /**
     * /kaizen link [code] - Lie le serveur avec un code de pairing
     */
    private void handleLink(CommandSender sender, String code) {
        // Vérifier si déjà lié
        if (config.isLinked()) {
            sender.sendMessage(config.getMessage("already-linked"));
            return;
        }

        // Si pas de code fourni, afficher les instructions
        if (code == null || code.isEmpty()) {
            displayLinkInstructions(sender);
            return;
        }

        // Nettoyer le code (retirer tirets, espaces, mettre en majuscules)
        String cleanCode = code.replace("-", "").replace(" ", "").toUpperCase();

        sender.sendMessage(Component.text("[Kaizen] ", NamedTextColor.GOLD)
                .append(Component.text("Connexion en cours...", NamedTextColor.GRAY)));

        // Envoyer le code au backend
        plugin.getApiClient().pairWithCode(cleanCode,
                plugin.getServer().getIp(),
                plugin.getServer().getPort(),
                plugin.getServer().getMinecraftVersion(),
                plugin.getDescription().getVersion()
        ).thenAccept(response -> {
            plugin.getServer().getScheduler().runTask(plugin, () -> {
                if (response.isSuccess() && response.getData() != null) {
                    // Sauvegarder les tokens
                    config.setServerId(response.getData().getServerId());
                    config.setServerToken(response.getData().getServerToken());

                    sender.sendMessage(config.getMessage("link-success"));

                    // Afficher les infos du serveur
                    sender.sendMessage(Component.text("[Kaizen] ", NamedTextColor.GOLD)
                            .append(Component.text("Serveur: ", NamedTextColor.GRAY))
                            .append(Component.text(response.getData().getServerName(), NamedTextColor.WHITE)));

                    // Connecter le WebSocket
                    plugin.getWebSocketClient().connect();

                    // Démarrer la sync des stats
                    plugin.getStatsCollector().start();
                } else {
                    String error = response.getError() != null ? response.getError() : "Code invalide ou expiré";
                    sender.sendMessage(Component.text("[Kaizen] ", NamedTextColor.GOLD)
                            .append(Component.text(error, NamedTextColor.RED)));
                }
            });
        }).exceptionally(ex -> {
            plugin.getServer().getScheduler().runTask(plugin, () -> {
                sender.sendMessage(config.getMessage("connection-error"));
                plugin.getLogger().warning("Erreur pairing: " + ex.getMessage());
            });
            return null;
        });
    }

    /**
     * Affiche les instructions pour obtenir un code de pairing
     */
    private void displayLinkInstructions(CommandSender sender) {
        sender.sendMessage(Component.empty());
        sender.sendMessage(Component.text("═══════════════════════════════", NamedTextColor.GOLD));
        sender.sendMessage(Component.text("       LIAISON KAIZEN", NamedTextColor.GOLD, TextDecoration.BOLD));
        sender.sendMessage(Component.text("═══════════════════════════════", NamedTextColor.GOLD));
        sender.sendMessage(Component.empty());

        sender.sendMessage(Component.text("Pour lier ton serveur:", NamedTextColor.WHITE));
        sender.sendMessage(Component.empty());

        sender.sendMessage(Component.text("1. ", NamedTextColor.GOLD)
                .append(Component.text("Connecte-toi sur ", NamedTextColor.GRAY))
                .append(Component.text("kaizen.gg", NamedTextColor.AQUA, TextDecoration.UNDERLINED)
                        .clickEvent(ClickEvent.openUrl("http://localhost:8080"))));

        sender.sendMessage(Component.text("2. ", NamedTextColor.GOLD)
                .append(Component.text("Crée ou sélectionne ton serveur", NamedTextColor.GRAY)));

        sender.sendMessage(Component.text("3. ", NamedTextColor.GOLD)
                .append(Component.text("Copie le code de pairing", NamedTextColor.GRAY)));

        sender.sendMessage(Component.text("4. ", NamedTextColor.GOLD)
                .append(Component.text("Tape: ", NamedTextColor.GRAY))
                .append(Component.text("/kaizen link <code>", NamedTextColor.YELLOW)));

        sender.sendMessage(Component.empty());
        sender.sendMessage(Component.text("Exemple: /kaizen link ABC12345", NamedTextColor.DARK_GRAY, TextDecoration.ITALIC));
        sender.sendMessage(Component.text("═══════════════════════════════", NamedTextColor.GOLD));
        sender.sendMessage(Component.empty());
    }

    /**
     * /kaizen unlink - Déconnecte le serveur
     */
    private void handleUnlink(CommandSender sender) {
        if (!config.isLinked()) {
            sender.sendMessage(config.getMessage("not-linked"));
            return;
        }

        // Déconnecter le WebSocket
        plugin.getWebSocketClient().disconnect();

        // Arrêter la sync des stats
        plugin.getStatsCollector().stop();

        // Effacer les tokens
        config.clearAuth();

        sender.sendMessage(config.getMessage("unlinked"));
    }

    /**
     * /kaizen status - Affiche le statut de connexion
     */
    private void handleStatus(CommandSender sender) {
        sender.sendMessage(Component.empty());
        sender.sendMessage(Component.text("═══ STATUT KAIZEN ═══", NamedTextColor.GOLD));

        if (config.isLinked()) {
            sender.sendMessage(Component.text("● ", NamedTextColor.GREEN)
                    .append(Component.text("Serveur lié", NamedTextColor.WHITE)));
            sender.sendMessage(Component.text("  ID: ", NamedTextColor.GRAY)
                    .append(Component.text(config.getServerId(), NamedTextColor.WHITE)));

            boolean wsConnected = plugin.getWebSocketClient().isConnected();
            sender.sendMessage(Component.text("  WebSocket: ", NamedTextColor.GRAY)
                    .append(Component.text(wsConnected ? "Connecté" : "Déconnecté",
                            wsConnected ? NamedTextColor.GREEN : NamedTextColor.RED)));
        } else {
            sender.sendMessage(Component.text("● ", NamedTextColor.RED)
                    .append(Component.text("Serveur non lié", NamedTextColor.WHITE)));
            sender.sendMessage(Component.text("  Utilise /kaizen link <code>", NamedTextColor.GRAY));
        }

        sender.sendMessage(Component.text("═════════════════════", NamedTextColor.GOLD));
        sender.sendMessage(Component.empty());
    }

    /**
     * /kaizen reload - Recharge la configuration
     */
    private void handleReload(CommandSender sender) {
        config.reload();
        sender.sendMessage(Component.text("[Kaizen] ", NamedTextColor.GOLD)
                .append(Component.text("Configuration rechargée!", NamedTextColor.GREEN)));
    }

    /**
     * Affiche l'aide
     */
    private void showHelp(CommandSender sender) {
        sender.sendMessage(Component.empty());
        sender.sendMessage(Component.text("═══ KAIZEN VOTES ═══", NamedTextColor.GOLD));
        sender.sendMessage(Component.text("/kaizen link <code>", NamedTextColor.AQUA)
                .append(Component.text(" - Lier le serveur avec un code", NamedTextColor.GRAY)));
        sender.sendMessage(Component.text("/kaizen unlink", NamedTextColor.AQUA)
                .append(Component.text(" - Délier le serveur", NamedTextColor.GRAY)));
        sender.sendMessage(Component.text("/kaizen status", NamedTextColor.AQUA)
                .append(Component.text(" - Voir le statut de connexion", NamedTextColor.GRAY)));
        sender.sendMessage(Component.text("/kaizen reload", NamedTextColor.AQUA)
                .append(Component.text(" - Recharger la configuration", NamedTextColor.GRAY)));
        sender.sendMessage(Component.text("════════════════════", NamedTextColor.GOLD));
        sender.sendMessage(Component.empty());
    }

    @Override
    public @Nullable List<String> onTabComplete(@NotNull CommandSender sender, @NotNull Command command,
                                                @NotNull String alias, @NotNull String[] args) {
        if (args.length == 1) {
            return SUBCOMMANDS.stream()
                    .filter(s -> s.startsWith(args[0].toLowerCase()))
                    .collect(Collectors.toList());
        }
        return List.of();
    }
}
