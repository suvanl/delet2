// This event executes whenever a new guild (server) is joined.

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {

    // OLD status; no longer used:
    //this.client.user.setPresence({game: {name: `${this.client.settings.get("default").prefix}help | ${this.client.guilds.size} Servers`, type:0}});

    // Updates number of guilds (servers) on the bot's status.
    this.client.user.setActivity(`over ${this.client.guilds.size} servers`, {type:'WATCHING'});
    this.client.logger.log(`New guild has been joined: ${guild.name} (${guild.id}) with ${guild.memberCount - 1} members`);
  }
};
