const Command = require("../../base/Command.js");
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

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
      if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);
      if (!message.guild.me.permissions.has(["EMBED_LINKS", "ADD_REACTIONS"])) return message.channel.send(texts.general.missingPerms.replace(/{{perms}}/g, "\"Embed Links\" & \"Add Reactions\""));

      const user = message.mentions.users.first();
      let reason = args.slice(1).join(" ") || undefined;
      const modLog = message.guild.channels.find("name", settings.modLogChannel);
      if (!modLog) return message.channel.send(texts.moderation.modLogNotFound.replace(/{{prefix}}/g, settings.prefix));
      if (!user) return message.channel.send(texts.moderation.noWarnUser);
      if (message.guild.member(message.author).highestRole.position <= message.guild.member(user).highestRole.position) return message.channel.send("You cannot warn this user as they have a higher role than you.");
      if (!reason) {
        message.channel.send(texts.moderation.awaitWarnReason);
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
            .setFooter(texts.moderation.poweredBy, this.client.user.displayAvatarURL)
            .setTimestamp();
    
          this.client.channels.get(modLog.id).send({embed});
  
          user.send(`Hello,\nYou were warned in **${message.guild.name}** for the reason "**${reason}**".\nPlease make sure you always follow the rules, because not doing so can lead to punishments. <:feelsbanman:405126279025917962>`);
          message.react("👌");
        } catch (error) {
          this.client.logger.error(error);
          return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
        }
      }
    }
}

module.exports = Warn;
