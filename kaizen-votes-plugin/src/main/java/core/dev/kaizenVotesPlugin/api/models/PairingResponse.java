package core.dev.kaizenVotesPlugin.api.models;

import com.google.gson.annotations.SerializedName;

/**
 * Réponse du backend Laravel après un pairing réussi
 * Structure: { success: true, data: { token: "...", server: { id, name, slug } } }
 */
public class PairingResponse {

    @SerializedName("success")
    private boolean success;

    @SerializedName("message")
    private String message;

    @SerializedName("data")
    private PairingData data;

    public PairingResponse() {}

    // Getters
    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public PairingData getData() { return data; }

    // Méthodes de commodité pour accéder aux données
    public String getServerToken() {
        return data != null ? data.getToken() : null;
    }

    public String getServerId() {
        return data != null && data.getServer() != null
                ? String.valueOf(data.getServer().getId())
                : null;
    }

    public String getServerName() {
        return data != null && data.getServer() != null
                ? data.getServer().getName()
                : "Serveur";
    }

    /**
     * Données de pairing
     */
    public static class PairingData {
        @SerializedName("token")
        private String token;

        @SerializedName("server")
        private ServerData server;

        public String getToken() { return token; }
        public ServerData getServer() { return server; }
    }

    /**
     * Données du serveur
     */
    public static class ServerData {
        @SerializedName("id")
        private int id;

        @SerializedName("name")
        private String name;

        @SerializedName("slug")
        private String slug;

        public int getId() { return id; }
        public String getName() { return name; }
        public String getSlug() { return slug; }
    }
}
