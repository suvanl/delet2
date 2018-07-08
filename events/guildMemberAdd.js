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
  
    // If welcome is off, don't proceed (doesn't welcome the user).
    if (settings.welcomeEnabled.toLowerCase() !== "true") return;

    // Checks if the welcomeChannel exists
    const welcomeChannel = member.guild.channels.find("name", settings.welcomeChannel);
    if (!welcomeChannel) return;

    // Replaces the placeholder in the welcome message with actual data.
    const welcomeMessage = settings.welcomeMessage.replace("{{user}}", member.user.tag);

    // Sends the welcome message to the welcome channel.
    member.guild.channels.find("name", settings.welcomeChannel).send(welcomeMessage).catch(console.error);

    // Checks if the modLogChannel exists
    const modLog = member.guild.channels.find("name", settings.modLogChannel);
    if (!modLog) return;

    const { RichEmbed } = require("discord.js");
    const embed = new RichEmbed()
      .setColor(11861937)
      .setTitle("🎉 User Joined")
      .setDescription(`**${member.user.tag}** (${member.user.id})`)
      .setFooter(`Member #${member.guild.memberCount}`)
      .setTimestamp();
    return member.guild.channels.get(modLog.id).send({embed});
  }
};
