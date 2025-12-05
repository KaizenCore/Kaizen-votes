package core.dev.kaizenVotesPlugin.api.models;

import com.google.gson.annotations.SerializedName;

/**
 * Requête de pairing envoyée au backend Laravel
 */
public class PairingRequest {

    @SerializedName("pairing_code")
    private String pairingCode;

    @SerializedName("server_ip")
    private String serverIp;

    @SerializedName("server_port")
    private int serverPort;

    @SerializedName("minecraft_version")
    private String minecraftVersion;

    @SerializedName("plugin_version")
    private String pluginVersion;

    public PairingRequest() {}

    // Getters
    public String getPairingCode() { return pairingCode; }
    public String getServerIp() { return serverIp; }
    public int getServerPort() { return serverPort; }
    public String getMinecraftVersion() { return minecraftVersion; }
    public String getPluginVersion() { return pluginVersion; }

    // Setters
    public void setPairingCode(String pairingCode) { this.pairingCode = pairingCode; }
    public void setServerIp(String serverIp) { this.serverIp = serverIp; }
    public void setServerPort(int serverPort) { this.serverPort = serverPort; }
    public void setMinecraftVersion(String minecraftVersion) { this.minecraftVersion = minecraftVersion; }
    public void setPluginVersion(String pluginVersion) { this.pluginVersion = pluginVersion; }
}
