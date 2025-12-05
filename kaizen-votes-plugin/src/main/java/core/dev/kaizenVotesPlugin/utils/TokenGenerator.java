package core.dev.kaizenVotesPlugin.utils;

import java.security.SecureRandom;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

/**
 * Générateur de tokens pour le système de pairing.
 * Génère des codes à 6 caractères (format ABC-123) et des tokens de validation.
 */
public class TokenGenerator {

    private static final String ALPHA_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // Sans I et O pour éviter confusion
    private static final String NUMERIC_CHARS = "23456789"; // Sans 0 et 1 pour éviter confusion
    private static final String ALL_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    // Cache des tokens de pairing en attente (code -> PairingData)
    private final Map<String, PairingData> pendingPairings = new ConcurrentHashMap<>();

    // Durée de validité d'un code de pairing (10 minutes)
    private static final long PAIRING_EXPIRATION_MS = 10 * 60 * 1000;

    /**
     * Données d'un pairing en attente
     */
    public static class PairingData {
        public final String code;
        public final String validationToken;
        public final long createdAt;
        public final String serverIp;
        public final int serverPort;

        public PairingData(String code, String validationToken, String serverIp, int serverPort) {
            this.code = code;
            this.validationToken = validationToken;
            this.createdAt = System.currentTimeMillis();
            this.serverIp = serverIp;
            this.serverPort = serverPort;
        }

        public boolean isExpired() {
            return System.currentTimeMillis() - createdAt > PAIRING_EXPIRATION_MS;
        }

        /**
         * Génère le lien de pairing
         */
        public String getPairingUrl(String baseUrl) {
            return baseUrl + "/link/" + code + "?token=" + validationToken;
        }

        /**
         * Formate le code avec un tiret (ABC-123)
         */
        public String getFormattedCode() {
            if (code.length() == 6) {
                return code.substring(0, 3) + "-" + code.substring(3);
            }
            return code;
        }
    }

    /**
     * Génère un nouveau code de pairing (format: ABC123)
     * @return Le code à 6 caractères
     */
    public String generatePairingCode() {
        StringBuilder code = new StringBuilder();

        // 3 lettres
        for (int i = 0; i < 3; i++) {
            code.append(ALPHA_CHARS.charAt(RANDOM.nextInt(ALPHA_CHARS.length())));
        }

        // 3 chiffres
        for (int i = 0; i < 3; i++) {
            code.append(NUMERIC_CHARS.charAt(RANDOM.nextInt(NUMERIC_CHARS.length())));
        }

        return code.toString();
    }

    /**
     * Génère un token de validation sécurisé (32 caractères)
     */
    public String generateValidationToken() {
        StringBuilder token = new StringBuilder();
        for (int i = 0; i < 32; i++) {
            token.append(ALL_CHARS.charAt(RANDOM.nextInt(ALL_CHARS.length())));
        }
        return token.toString();
    }

    /**
     * Crée une nouvelle demande de pairing
     * @param serverIp L'IP du serveur
     * @param serverPort Le port du serveur
     * @return Les données du pairing créé
     */
    public PairingData createPairing(String serverIp, int serverPort) {
        // Nettoyer les anciens pairings expirés
        cleanExpiredPairings();

        // Générer un code unique
        String code;
        do {
            code = generatePairingCode();
        } while (pendingPairings.containsKey(code));

        String validationToken = generateValidationToken();
        PairingData data = new PairingData(code, validationToken, serverIp, serverPort);

        pendingPairings.put(code, data);
        return data;
    }

    /**
     * Récupère les données d'un pairing en attente
     * @param code Le code de pairing
     * @return Les données ou null si inexistant/expiré
     */
    public PairingData getPairing(String code) {
        // Normaliser le code (retirer le tiret si présent)
        String normalizedCode = code.replace("-", "").toUpperCase();
        PairingData data = pendingPairings.get(normalizedCode);

        if (data != null && data.isExpired()) {
            pendingPairings.remove(normalizedCode);
            return null;
        }

        return data;
    }

    /**
     * Valide et consomme un pairing
     * @param code Le code de pairing
     * @param validationToken Le token de validation
     * @return true si valide et consommé
     */
    public boolean validateAndConsumePairing(String code, String validationToken) {
        String normalizedCode = code.replace("-", "").toUpperCase();
        PairingData data = pendingPairings.get(normalizedCode);

        if (data == null || data.isExpired()) {
            pendingPairings.remove(normalizedCode);
            return false;
        }

        if (!data.validationToken.equals(validationToken)) {
            return false;
        }

        // Consommer le pairing
        pendingPairings.remove(normalizedCode);
        return true;
    }

    /**
     * Annule un pairing en attente
     */
    public void cancelPairing(String code) {
        String normalizedCode = code.replace("-", "").toUpperCase();
        pendingPairings.remove(normalizedCode);
    }

    /**
     * Vérifie s'il y a un pairing en attente
     */
    public boolean hasPendingPairing() {
        cleanExpiredPairings();
        return !pendingPairings.isEmpty();
    }

    /**
     * Récupère le pairing actif (le plus récent)
     */
    public PairingData getActivePairing() {
        cleanExpiredPairings();
        return pendingPairings.values().stream()
                .max((a, b) -> Long.compare(a.createdAt, b.createdAt))
                .orElse(null);
    }

    /**
     * Nettoie les pairings expirés
     */
    private void cleanExpiredPairings() {
        pendingPairings.entrySet().removeIf(entry -> entry.getValue().isExpired());
    }
}
