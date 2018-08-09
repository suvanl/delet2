const Command = require("../../base/Command.js");
const { RichEmbed } = require("discord.js");

class Report extends Command {
    constructor(client) {
      super(client, {
        name: "report",
        description: "Reports a user to the server's staff.",
        category: "Moderation",
        usage: "report <user> <reason/info>",
        guildOnly: true
      });
    }
    
    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);
        if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send(texts.general.missingPerm.replace(/{{perm}}/g, "Embed Links"));

        const user = message.mentions.users.first();
        const reason = args.slice(1).join(" ");
        const modLog = message.guild.channels.find("name", settings.modLogChannel);
        if (!modLog) return message.channel.send(texts.moderation.modLogNotFound.replace(/{{prefix}}/g, settings.prefix));
        if (!user) return message.channel.send("You must mention a user to report.");
        if (!reason) return message.channel.send("You must provide a reason for the report.");

        message.delete();

        const embed = new RichEmbed()
          .setTitle(`🚩 Report received from ${message.author.tag} (${message.author.id})`)
          .setColor(message.guild.member(user).displayColor)
          .setDescription(`\`\`\`css\nTarget: ${user.tag} (${user.id})\nReason: ${reason}\nChannel: #${message.channel.name}\`\`\``)
          .setFooter(texts.moderation.poweredBy, this.client.user.displayAvatarURL)
          .setTimestamp();


        this.client.channels.get(modLog.id).send({ embed })
          .then(() => {
            message.channel.send("<:tick:398228298842374154> Report successfully sent.");
          })
          .catch(error => {
            this.client.logger.error(error);
            return message.channel.send("<:redX:398228298708025344> An error occurred whilst submitting the report.");
          });
    }
}

module.exports = Report;