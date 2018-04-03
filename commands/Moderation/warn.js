const Command = require("../../base/Command.js");
const Discord = require("discord.js");

class Warn extends Command {
    constructor(client) {
      super(client, {
        name: "warn",
        description: "Issues a warning to the specified user.",
        category: "Moderation",
        usage: "warn [user] <reason/info>",
        extended: "Warns the mentioned user by sending them a warning DM and by recording the event in the modlog channel. Warnings are currently untracked.",
        guildOnly: true,
        aliases: ["w"],
        permLevel: "DeletMod"
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
      if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);

      const settings = message.guild ? this.client.getSettings(message.guild.id) : this.client.settings.get("default");
      const user = message.mentions.users.first();
      const reason = args.slice(1).join(" ");
      const modLog = message.guild.channels.find("name", settings.modLogChannel);
      if (!modLog) return message.channel.send(`Modlog channel not found. If you're an admin (or above) on this server, please use:\`\`\`${settings.prefix}set edit modLogChannel {{channel name}}\`\`\`\nFor example: \`${settings.prefix}set edit modLogChannel cool-channel-name\`.`);
      if (!user) return message.channel.send("You must mention a user to warn.");
      if (!reason) return message.channel.send("Please provide a reason for the warning.");

      try {
        const embed = new Discord.RichEmbed()
        .setTitle(`⚠️ Warning issued in #${message.channel.name}`)
        .setColor(16381497)
        .setDescription(`\`\`\`ruby\nIssued to: ${user.tag} (${user.id})\nIssued by: ${message.author.tag} (${message.author.id})\nReason: ${reason}\`\`\``)
        .setFooter("Moderation system powered by delet™", "https://i.imgur.com/No7WfpC.png")
        .setTimestamp();
  
        this.client.channels.get(modLog.id).send({embed});

        user.send(`Hey there!\nYou were warned in **${message.guild.name}** for the reason **${reason}**.\nPlease make sure you always follow the rules, as not doing so can lead to punishments. <:feelsbanman:405126279025917962>`);
        message.react("👌");
      } catch (error) {
        this.client.logger.error(error);
        message.channel.send("An error occurred.");
      }
    }
}

module.exports = Warn;