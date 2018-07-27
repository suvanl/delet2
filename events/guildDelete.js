// This event executes when a new guild (server) has been left.

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {
    // Logs it
    this.client.logger.log(`Left guild: ${guild.name} (${guild.id}) with ${guild.memberCount - 1} members`);

    // Updates number of guilds (servers) on the bot's status.
    this.client.user.setActivity(`over ${this.client.guilds.size} servers`, { type: "WATCHING" });
    
    // Well, they're gone :^) (removes them from the settings database)
    if (this.client.settings.has(guild.id)) {
      this.client.settings.delete(guild.id);
    }
  }
};
