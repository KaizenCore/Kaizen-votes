package core.dev.kaizenVotesPlugin.api.models;

import com.google.gson.annotations.SerializedName;

/**
 * Informations sur le serveur Minecraft envoyées au backend
 */
public class ServerInfo {

    @SerializedName("server_id")
    private String serverId;

    @SerializedName("name")
    private String name;

    @SerializedName("ip")
    private String ip;

    @SerializedName("port")
    private int port;

    @SerializedName("version")
    private String version;

    @SerializedName("players_online")
    private int playersOnline;

    @SerializedName("max_players")
    private int maxPlayers;

    @SerializedName("tps")
    private double tps;

    @SerializedName("uptime")
    private long uptime;

    @SerializedName("plugin_version")
    private String pluginVersion;

    public ServerInfo() {}

    // Builder pattern pour faciliter la création
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final ServerInfo info = new ServerInfo();

        public Builder serverId(String serverId) {
            info.serverId = serverId;
            return this;
        }

        public Builder name(String name) {
            info.name = name;
            return this;
        }

        public Builder ip(String ip) {
            info.ip = ip;
            return this;
        }

        public Builder port(int port) {
            info.port = port;
            return this;
        }

        public Builder version(String version) {
            info.version = version;
            return this;
        }

        public Builder playersOnline(int playersOnline) {
            info.playersOnline = playersOnline;
            return this;
        }

        public Builder maxPlayers(int maxPlayers) {
            info.maxPlayers = maxPlayers;
            return this;
        }

        public Builder tps(double tps) {
            info.tps = tps;
            return this;
        }

        public Builder uptime(long uptime) {
            info.uptime = uptime;
            return this;
        }

        public Builder pluginVersion(String pluginVersion) {
            info.pluginVersion = pluginVersion;
            return this;
        }

        public ServerInfo build() {
            return info;
        }
    }

    // Getters
    public String getServerId() { return serverId; }
    public String getName() { return name; }
    public String getIp() { return ip; }
    public int getPort() { return port; }
    public String getVersion() { return version; }
    public int getPlayersOnline() { return playersOnline; }
    public int getMaxPlayers() { return maxPlayers; }
    public double getTps() { return tps; }
    public long getUptime() { return uptime; }
    public String getPluginVersion() { return pluginVersion; }
}
