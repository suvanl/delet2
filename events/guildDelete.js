// This event executes when a new guild (server) is left.

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {
    // OLD status; no longer used:
    //this.client.user.setPresence({game: {name: `${this.client.settings.get("default").prefix}help | ${this.client.guilds.size} Servers`, type:0}});
    
    // Updates number of guilds (servers) on the bot's status.
    this.client.user.setActivity(`over ${this.client.guilds.size} servers`, {type:'WATCHING'});
    
    // Well, they're gone :^) (removes them from settings)
    this.client.settings.delete(guild.id);
  }
};
