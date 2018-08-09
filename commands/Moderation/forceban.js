const Command = require("../../base/Command.js");
const { RichEmbed } = require("discord.js");

class ForceBan extends Command {
    constructor(client) {
      super(client, {
        name: "forceban",
        description: "Bans a user, even if they aren't in your server.",
        category: "Moderation",
        usage: "ban <user ID> <reason>",
        guildOnly: true,
        aliases: ["hackban", "xban"],
        permLevel: "Moderator"
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);
        
        const userID = args[0];
        const reason = args.slice(1).join(" ");
        const modLog = message.guild.channels.find("name", settings.modLogChannel);
        if (!modLog) return message.channel.send(texts.moderation.modLogNotFound.replace(/{{prefix}}/g, settings.prefix));
        if (!userID) return message.channel.send("You must provide a user ID to ban.");
        if (!reason) return message.channel.send("Please provide a reason for the punishment.");
        if (userID === message.author.id) return message.channel.send("You cannot ban yourself. <a:aThinking:444074885367595009>");

        message.guild.ban(userID, { reason: reason })
          .then(() => {
            message.reply(`successfully banned the user with the ID **${userID}**.`);
            message.react("👌");
          })
          .catch(error => {
            this.client.logger.error(error);
            return message.channel.send(`An error occurred whilst trying to ban the specified user ID:\n\`\`\`${error.message}\`\`\``);
          });

        const embed = new RichEmbed()
          .setTitle(`🚫 Member force-banned from ${message.guild.name}`)
          .setColor(13838185)
          .setDescription(`\`\`\`css\nTarget: ${userID}\nIssued by: ${message.author.tag} (${message.author.id})\nReason: ${reason}\`\`\``)
          .setFooter(texts.moderation.poweredBy, this.client.user.displayAvatarURL)
          .setTimestamp();

        this.client.channels.get(modLog.id).send({ embed });
    }
}

module.exports = ForceBan;