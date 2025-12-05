package core.dev.kaizenVotesPlugin.api.models;

import com.google.gson.annotations.SerializedName;

/**
 * Représente une récompense de vote pour un joueur
 */
public class PlayerReward {

    @SerializedName("id")
    private String id;

    @SerializedName("vote_id")
    private String voteId;

    @SerializedName("type")
    private RewardType type;

    @SerializedName("command")
    private String command;

    @SerializedName("item")
    private String item;

    @SerializedName("amount")
    private int amount;

    @SerializedName("message")
    private String message;

    @SerializedName("claimed")
    private boolean claimed;

    public PlayerReward() {}

    /**
     * Types de récompenses supportées
     */
    public enum RewardType {
        @SerializedName("command")
        COMMAND,

        @SerializedName("item")
        ITEM,

        @SerializedName("money")
        MONEY,

        @SerializedName("experience")
        EXPERIENCE,

        @SerializedName("permission")
        PERMISSION
    }

    // Getters
    public String getId() { return id; }
    public String getVoteId() { return voteId; }
    public RewardType getType() { return type; }
    public String getCommand() { return command; }
    public String getItem() { return item; }
    public int getAmount() { return amount; }
    public String getMessage() { return message; }
    public boolean isClaimed() { return claimed; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setVoteId(String voteId) { this.voteId = voteId; }
    public void setType(RewardType type) { this.type = type; }
    public void setCommand(String command) { this.command = command; }
    public void setItem(String item) { this.item = item; }
    public void setAmount(int amount) { this.amount = amount; }
    public void setMessage(String message) { this.message = message; }
    public void setClaimed(boolean claimed) { this.claimed = claimed; }

    @Override
    public String toString() {
        return "PlayerReward{" +
                "id='" + id + '\'' +
                ", type=" + type +
                ", amount=" + amount +
                ", claimed=" + claimed +
                '}';
    }
}
