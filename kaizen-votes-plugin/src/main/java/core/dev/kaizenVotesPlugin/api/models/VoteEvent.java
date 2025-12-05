package core.dev.kaizenVotesPlugin.api.models;

import com.google.gson.annotations.SerializedName;

/**
 * Représente un événement de vote reçu du backend
 */
public class VoteEvent {

    @SerializedName("id")
    private String id;

    @SerializedName("player_uuid")
    private String playerUuid;

    @SerializedName("player_name")
    private String playerName;

    @SerializedName("service_name")
    private String serviceName;

    @SerializedName("timestamp")
    private long timestamp;

    @SerializedName("claimed")
    private boolean claimed;

    @SerializedName("rewards")
    private PlayerReward[] rewards;

    public VoteEvent() {}

    // Getters
    public String getId() { return id; }
    public String getPlayerUuid() { return playerUuid; }
    public String getPlayerName() { return playerName; }
    public String getServiceName() { return serviceName; }
    public long getTimestamp() { return timestamp; }
    public boolean isClaimed() { return claimed; }
    public PlayerReward[] getRewards() { return rewards; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setPlayerUuid(String playerUuid) { this.playerUuid = playerUuid; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
    public void setClaimed(boolean claimed) { this.claimed = claimed; }
    public void setRewards(PlayerReward[] rewards) { this.rewards = rewards; }

    @Override
    public String toString() {
        return "VoteEvent{" +
                "id='" + id + '\'' +
                ", playerName='" + playerName + '\'' +
                ", serviceName='" + serviceName + '\'' +
                ", timestamp=" + timestamp +
                ", claimed=" + claimed +
                '}';
    }
}
