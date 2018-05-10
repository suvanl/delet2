const Command = require("../../base/Command.js");
const texts = require("../../util/globals.js");
const { RichEmbed } = require("discord.js");

class Warn extends Command {
    constructor(client) {
      super(client, {
        name: "warn",
        description: "Issues a warning to the specified user.",
        category: "Moderation",
        usage: "warn [user] <reason/info>",
        guildOnly: true,
        aliases: ["w"],
        permLevel: "Moderator"
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
      if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);
      if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send(`${texts.missingPerm.replace(/{{perm}}/g, "Embed Links")}`);

      const settings = message.guild ? this.client.getSettings(message.guild.id) : this.client.settings.get("default");
      const user = message.mentions.users.first();
      let reason = args.slice(1).join(" ") || undefined;
      const modLog = message.guild.channels.find("name", settings.modLogChannel);
      if (!modLog) return message.channel.send(`${texts.modLogNotFound.replace(/{{prefix}}/g, settings.prefix)}`);
      if (!user) return message.channel.send("You must mention a user to warn.");
      if (!reason) {
        message.channel.send("Please enter a reason for the warning...\nThis text-entry period will time-out in 30 seconds. Reply with `cancel` to exit.");
        await message.channel.awaitMessages(m => m.author.id === message.author.id, {
          "errors": ["time"],
          "max": 1,
          time: 30000
        }).then(resp => {
          if (!resp) return message.channel.send("Timed out. The user has not been warned.");
          resp = resp.array()[0];
          if (resp.content.toLowerCase() === "cancel") return message.channel.send("Cancelled. The user has not been warned.");
          reason = resp.content;
          if (resp) resp.react("✅");
        }).catch(error => { // eslint-disable-line no-unused-vars
          message.channel.send("Timed out. The user has not been warned.");
        });
      }

      if (reason) {
        try {
          const embed = new RichEmbed()
          .setTitle(`⚠️ Warning issued in #${message.channel.name}`)
          .setColor(16381497)
          .setDescription(`\`\`\`ruby\nIssued to: ${user.tag} (${user.id})\nIssued by: ${message.author.tag} (${message.author.id})\nReason: ${reason}\`\`\``)
          .setFooter(texts.poweredBy, this.client.user.displayAvatarURL)
          .setTimestamp();
    
          this.client.channels.get(modLog.id).send({embed});
  
          user.send(`Hello,\nYou were warned in **${message.guild.name}** for the reason "**${reason}**".\nPlease make sure you always follow the rules, because, not doing so can lead to punishments. <:feelsbanman:405126279025917962>`);
          message.react("👌");
        } catch (error) {
          this.client.logger.error(error);
          return message.channel.send(`${texts.error}\`\`\`${error.message}\`\`\``);
        }
      }
    }
}

module.exports = Warn;
