// This event executes when a member leaves a server.

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(member) {
    // Return if guild is unavailable
    if (!member.guild.available) return;

    // Loads the guild's settings
    const settings = this.client.getSettings(member.guild.id);

    // TODO: re-add leave message to settings and handle sending of said message in this event

    // Checks if the modLogChannel exists
    const modLog = member.guild.channels.find("name", settings.modLogChannel);
    if (!modLog) this.client.logger.info(`modLogChannel not found in "${member.guild.name}" (${member.guild.id})`);

    // Creates and sends embed
    const { RichEmbed } = require("discord.js");
    const embed = new RichEmbed()
    .setColor(16767063)
        .setTitle("🚪 User Left")
        .setDescription(`**${member.user.tag}** (${member.user.id})`)
        .setFooter(`There are now ${member.guild.memberCount} members`)
        .setTimestamp();
    return member.guild.channels.get(modLog.id).send({ embed });
  }
};
  