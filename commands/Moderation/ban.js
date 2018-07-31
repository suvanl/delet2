const Command = require("../../base/Command.js");
const { RichEmbed } = require("discord.js");

class Ban extends Command {
    constructor(client) {
      super(client, {
        name: "ban",
        description: "Bans the mentioned user from the server.",
        category: "Moderation",
        usage: "ban [user] <reason/info>",
        guildOnly: true,
        aliases: ["banish", "permban"],
        permLevel: "Moderator"
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);

        const user = message.mentions.users.first();
        let reason = args.slice(1).join(" ") || undefined;
        const modLog = message.guild.channels.find("name", settings.modLogChannel);
        if (!modLog) return message.channel.send(texts.moderation.modLogNotFound.replace(/{{prefix}}/g, settings.prefix));
        if (!user) return message.channel.send(texts.moderation.noUser);
        if (user === message.author) return message.channel.send(`${texts.moderation.selfPunish} <a:aThinking:444074885367595009>`);
        if (message.guild.member(message.author).highestRole.position <= message.guild.member(user).highestRole.position) return message.channel.send("You cannot ban this user as they have a higher role than you.");
        if (!reason) {
          message.channel.send(texts.moderation.awaitReason);
          await message.channel.awaitMessages(m => m.author.id === message.author.id, {
            "errors": ["time"],
            "max": 1,
            time: 30000
          }).then(resp => {
            if (!resp) return message.channel.send(texts.moderation.timedOut);
            resp = resp.array()[0];
            if (resp.content.toLowerCase() === "cancel") return message.channel.send(texts.moderation.cancel);
            reason = resp.content;
            if (resp) resp.react("✅");
          }).catch(error => { // eslint-disable-line no-unused-vars
            message.channel.send(texts.moderation.timedOut);
          });
        }

        if (reason) {
          try {
            if (!message.guild.member(user).bannable) return message.reply("I cannot ban that user from this server!\nThis may be because I do not have the required permissions to do so, or they may be the server owner.");
            try {
              message.guild.member(user).ban(`${reason} (${texts.moderation.issuedBy.replace(/{{user}}/g, message.author.tag)})`);
              message.react("👌");
            } catch (error) {
              return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
            }

            const lastMessage = message.guild.member(user).lastMessageID;

            const embed = new RichEmbed()
              .setTitle(`🚫 Member banned from ${message.guild.name}`)
              .setColor(10944512)
              .setDescription(`\`\`\`css\nTarget: ${user.tag} (${user.id})\nIssued by: ${message.author.tag} (${message.author.id})\nReason: ${reason}\nDuration: Permanent\nLast message: ${lastMessage}\`\`\``)
              .setFooter(texts.moderation.poweredBy, this.client.user.displayAvatarURL)
              .setTimestamp();
    
            this.client.channels.get(modLog.id).send({ embed });

          } catch (error) {
            this.client.logger.error(error);
            return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
          }
        }
    }
}

module.exports = Ban;