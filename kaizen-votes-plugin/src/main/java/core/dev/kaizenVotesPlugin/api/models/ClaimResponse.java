package core.dev.kaizenVotesPlugin.api.models;

import com.google.gson.annotations.SerializedName;

/**
 * Représente la réponse de l'API lors du claim d'un vote
 */
public class ClaimResponse {

    @SerializedName("success")
    private boolean success;

    @SerializedName("message")
    private String message;

    @SerializedName("data")
    private ClaimData data;

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public ClaimData getData() { return data; }

    public static class ClaimData {
        @SerializedName("vote_id")
        private int voteId;

        @SerializedName("minecraft_username")
        private String minecraftUsername;

        @SerializedName("commands")
        private String[] commands;

        public int getVoteId() { return voteId; }
        public String getMinecraftUsername() { return minecraftUsername; }
        public String[] getCommands() { return commands; }
    }
}
