// This event executes when a new member joins a server.

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(member) {
    // Return if guild is unavailable
    if (!member.guild.available) return;

    // Loads the guild's settings
    const settings = this.client.getSettings(member.guild.id);

    // Checks if the modLogChannel exists
    const modLog = member.guild.channels.find(c => c.name === settings.modLogChannel);
    if (!modLog) this.client.logger.info(`modLogChannel not found in "${member.guild.name}" (${member.guild.id})`);

    // Creates and sends embed
    const { RichEmbed } = require("discord.js");
    const embed = new RichEmbed()
      .setColor(11861937)
      .setTitle("🎉 User Joined")
      .setDescription(`**${member.user.tag}** (${member.user.id})`)
      .setFooter(`Member #${member.guild.memberCount}`)
      .setTimestamp();
    member.guild.channels.get(modLog.id).send({ embed });

    // If welcome is off, don't proceed (doesn't welcome the user).
    if (settings.welcomeEnabled.toLowerCase() !== "true") return;

    // Checks if the welcomeChannel exists
    const welcomeChannel = member.guild.channels.find(c => c.name === settings.welcomeChannel);
    if (!welcomeChannel) return;

    // Replaces the placeholder in the welcome message with actual data.
    const welcomeMessage = settings.welcomeMessage.replace(/{{user}}/g, member.user.tag);

    // Sends the welcome message to the welcome channel.
    member.guild.channels.get(welcomeChannel.id).send(welcomeMessage).catch(console.error);
  }
};
