package core.dev.kaizenVotesPlugin.api.models;

import com.google.gson.annotations.SerializedName;

/**
 * Entrée du classement des voteurs
 */
public class LeaderboardEntry {

    @SerializedName("position")
    private int position;

    @SerializedName("player_uuid")
    private String playerUuid;

    @SerializedName("player_name")
    private String playerName;

    @SerializedName("votes")
    private int votes;

    @SerializedName("last_vote")
    private long lastVote;

    public LeaderboardEntry() {}

    // Getters
    public int getPosition() { return position; }
    public String getPlayerUuid() { return playerUuid; }
    public String getPlayerName() { return playerName; }
    public int getVotes() { return votes; }
    public long getLastVote() { return lastVote; }

    // Setters
    public void setPosition(int position) { this.position = position; }
    public void setPlayerUuid(String playerUuid) { this.playerUuid = playerUuid; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }
    public void setVotes(int votes) { this.votes = votes; }
    public void setLastVote(long lastVote) { this.lastVote = lastVote; }
}
