// This event executes whenever a new guild (server) is joined.

const { stripIndents } = require("common-tags");

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {
    // Updates number of guilds (servers) on the bot's status
    this.client.user.setActivity(`over ${this.client.guilds.size} servers`, {type:"WATCHING"});

    // Logs it
    this.client.logger.log(`New guild has been joined: ${guild.name} (${guild.id}) with ${guild.memberCount - 1} members`);

    // Notifies server owner
    const guildOwner = guild.owner;
    guildOwner.send(stripIndents`
    Hey! I'm delet, and I was invited to your server "**${guild.name}**" by someone with the Manage Server permission there. My prefix is **\`%\`** (but can be changed).
    To see how to get started, please go to **https://delet.js.org/#docs**.

    Hope to be of service to you and your server!`);
  }
};
