const Command = require("../../base/Command.js");
const texts = require("../../util/globals.js");
const { RichEmbed } = require("discord.js");

class Kick extends Command {
    constructor(client) {
      super(client, {
        name: "kick",
        description: "Kicks the mentioned user from the server.",
        category: "Moderation",
        usage: "kick [user] <reason/info>",
        guildOnly: true,
        aliases: ["boot"],
        permLevel: "Moderator"
      });
    }
    
    async run(message, args, level) { // eslint-disable-line no-unused-vars
      if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);
      
      const settings = message.guild ? this.client.getSettings(message.guild.id) : this.client.settings.get("default");
      const user = message.mentions.users.first();
      let reason = args.slice(1).join(" ") || undefined;
      const modLog = message.guild.channels.find("name", settings.modLogChannel);
      if (!modLog) return message.channel.send(`${texts.modLogNotFound.replace(/{{prefix}}/g, settings.prefix)}`);
      if (!user) return message.channel.send("You must mention a user to kick.");
      if (!reason) {
        message.channel.send("Please enter a reason for the punishment...\nThis text-entry period will time-out in 30 seconds. Reply with `cancel` to exit.");
        await message.channel.awaitMessages(m => m.author.id === message.author.id, {
          "errors": ["time"],
          "max": 1,
          time: 30000
        }).then(resp => {
          if (!resp) return message.channel.send("Timed out. The user has not been kicked.");
          resp = resp.array()[0];
          if (resp.content.toLowerCase() === "cancel") return message.channel.send("Cancelled. The user has not been kicked.");
          reason = resp.content;
          if (resp) resp.react("✅");
        }).catch(error => { // eslint-disable-line no-unused-vars
          message.channel.send("Timed out. The user has not been kicked.");
        });
      }

      if (reason) {
        //code
        try {
          if (!message.guild.member(user).kickable) return message.reply("I cannot kick that user from this server!\nThis may be because I do not have the required permissions to do so, or they may be the server owner.");
          if (user === message.author) return message.channel.send("You cannot kick yourself.");
          try {
            message.guild.member(user).kick(`${reason} (Issued by ${message.author.tag})`);
            message.react("👌");
          } catch (error) {
            return message.channel.send("An error occurred whilst trying to kick the mentioned user.");
          }

          const lastMessage = message.guild.member(user).lastMessageID;

          const embed = new RichEmbed()
          .setTitle(`👢 Member kicked in #${message.channel.name}`)
          .setColor(16733525)
          .setDescription(`\`\`\`ruby\nIssued to: ${user.tag} (${user.id})\nIssued by: ${message.author.tag} (${message.author.id})\nReason: ${reason}\nLast message: ${lastMessage}\`\`\``)
          .setFooter(texts.poweredBy, this.client.user.displayAvatarURL)
          .setTimestamp();

          this.client.channels.get(modLog.id).send({embed});
        } catch (error) {
          this.client.logger.error(error);
          return message.channel.send(`${texts.error}\`\`\`${error.message}\`\`\``);
        }
      }
    }
}

module.exports = Kick;