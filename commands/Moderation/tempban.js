const Command = require("../../base/Command.js");
const Discord = require("discord.js");

class TempBan extends Command {
    constructor(client) {
      super(client, {
        name: "tempban",
        description: "Temporarily bans the mentioned user from the server.",
        category: "Moderation",
        usage: "tempban [user] <reason/info>",
        guildOnly: true,
        aliases: [""],
        permLevel: "DeletMod"
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        const settings = message.guild ? this.client.getSettings(message.guild.id) : this.client.settings.get("default"); // eslint-disable-line no-unused-vars
        const user = message.mentions.users.first();
        const days = args[1];
        const reason = args.slice(2).join(" ");
        const modLog = message.guild.channels.find("name", settings.modLogChannel);
        if (!modLog) return message.channel.send("Modlog not found. Please inform the server owner of this.");
        if (!user) return message.channel.send("You must mention a user to ban.");
        if (!days) return message.channel.send("You must specify the number of days you'd like to ban the mentioned user for.");
        if (!reason) return message.channel.send("Please provide a reason for the punishment.");
        if (user === message.author) return message.channel.send("You cannot ban yourself.");

        if (!message.guild.member(user).bannable) return message.reply("I cannot ban that user from this server!\nThis may be because I do not have the required permissions to do so, or they may be the server owner.");
        try {
          message.guild.ban(user, { days: days, reason: `${reason}` })
            .then(message.react("👌"));
        } catch (error) {
          return message.channel.send(`An error occurred whilst trying to ban the mentioned user:\n\`\`\`${error.message}\`\`\``);
        }

        const embed = new Discord.RichEmbed()
        .setTitle(`🚫 Member banned from ${message.guild.name}`)
        .setColor(10944512)
        .setDescription(`\`\`\`css\nTarget: ${user.tag} (${user.id})\nIssued by: ${message.author.tag} (${message.author.id})\nReason: ${reason}\nDuration: ${days} days\`\`\``)
        .setFooter("Moderation system powered by delet™", "https://i.imgur.com/No7WfpC.png")
        .setTimestamp();

        this.client.channels.get(modLog.id).send({embed});
    }
}

module.exports = TempBan;