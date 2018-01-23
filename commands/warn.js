const Moderation = require('../base/Moderation.js');
const Discord = require("discord.js");

class Warn extends Moderation {
    constructor(client) {
      super(client, {
        name: 'warn',
        description: 'Issues a warning to the specified user.',
        usage: 'warn [user] <reason/info>',
        extended: 'Warns the mentioned user by sending them a warning DM and by recording the event in the modlog channel. Warnings are currently untracked.',
        guildOnly: true,
        aliases: ['w']
      });
    }

    async run(message, args, level) {
      const user = message.mentions.users.first();
      const reason = args.slice(1).join(' ');
      const modLog = message.guild.channels.find("name", "delet-this");
      if (!modLog) return message.channel.send("Modlog not found. Please inform the server owner of this.");
      if (!user) return message.channel.send("You must mention a user to warn.");
      if (!reason) return message.channel.send("Please provide a reason for the warning.");

      try {
        user.send(`Hey there!\nYou were warned in **${message.guild.name}** for the reason **${reason}**.\nPlease make sure you always follow the rules, as not doing so can lead to punishments. <:feelsbanman:405126279025917962>`);
        message.react("👌");
      } catch (error) {
        return message.channel.send("An error occurred whilst trying to DM the mentioned user.");
      }

      const embed = new Discord.RichEmbed()
      .setTitle(`⚠️ Warning issued in #${message.channel.name}`)
      .setColor(16381497)
      .setDescription(`\`\`\`ruby\nIssued to: ${user.tag} (${user.id})\nIssued by: ${message.author.tag} (${message.author.id})\nReason: ${reason}\`\`\``)
      .setFooter("Moderation system powered by delet™", "https://i.imgur.com/No7WfpC.png")
      .setTimestamp()

      this.client.channels.get(modLog.id).send({embed});
    }
}

module.exports = Warn;