const Command = require("../../base/Command.js");
const Discord = require("discord.js");

class ForceBan extends Command {
    constructor(client) {
      super(client, {
        name: "forceban",
        description: "Bans a user, even if they aren't in your server.",
        category: "Moderation",
        usage: "ban [user ID] <reason/info>",
        guildOnly: true,
        aliases: ["hackban", "xban"],
        permLevel: "Moderator"
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);
        
        const settings = message.guild ? this.client.getSettings(message.guild.id) : this.client.settings.get("default");
        const userID = args[0];
        const reason = args.slice(1).join(" ");
        const modLog = message.guild.channels.find("name", settings.modLogChannel);
        if (!modLog) return message.channel.send("Modlog not found. Please inform the server owner of this.");
        if (!userID) return message.channel.send("You must provide a user ID to ban.");
        if (!reason) return message.channel.send("Please provide a reason for the punishment.");
        if (userID === message.author.id) return message.channel.send("You cannot ban yourself.");

        if (!message.guild.member(userID).bannable) return message.reply("I cannot ban that user from this server!");
        try {
          message.guild.ban(userID)
            .then(user => message.reply(`successfully banned ${user.username} (${user.id}).`));
          message.react("👌");
        } catch (error) {
          return message.channel.send(`An error occurred whilst trying to ban the specified user ID:\n\`\`\`${error.message}\`\`\``);
        }

        const embed = new Discord.RichEmbed()
        .setTitle(`🚫 Member force-banned from ${message.guild.name}`)
        .setColor(13838185)
        .setDescription(`\`\`\`css\nTarget: ${userID}\nIssued by: ${message.author.tag} (${message.author.id})\nReason: ${reason}\`\`\``)
        .setFooter("Moderation system powered by delet™", "https://i.imgur.com/No7WfpC.png")
        .setTimestamp();

        this.client.channels.get(modLog.id).send({embed});
    }
}

module.exports = ForceBan;