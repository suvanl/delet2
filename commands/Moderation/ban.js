const Command = require("../../base/Command.js");
const Discord = require("discord.js");

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

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);

        const settings = message.guild ? this.client.getSettings(message.guild.id) : this.client.settings.get("default");
        const user = message.mentions.users.first();
        const reason = args.slice(1).join(" ");
        const modLog = message.guild.channels.find("name", settings.modLogChannel);
        const lastMessage = message.guild.member(user).lastMessageID;
        if (!modLog) return message.channel.send(`Modlog channel not found. If you're an admin (or owner) on this server, please use:\`\`\`${settings.prefix}set edit modLogChannel {{channel name}}\`\`\`\nFor example: \`${settings.prefix}set edit modLogChannel cool-channel-name\`.`);        if (!user) return message.channel.send("You must mention a user to ban.");
        if (!reason) return message.channel.send("Please provide a reason for the punishment.");
        if (user === message.author) return message.channel.send("You cannot ban yourself.");

        if (!message.guild.member(user).bannable) return message.reply("I cannot ban that user from this server!\nThis may be because I do not have the required permissions to do so, or they may be the server owner.");
        try {
          message.guild.member(user).ban(`${reason} (Ban issued by ${message.author.tag})`);
          message.react("👌");
        } catch (error) {
          return message.channel.send("An error occurred whilst trying to ban the mentioned user");
        }

        const embed = new Discord.RichEmbed()
        .setTitle(`🚫 Member banned from ${message.guild.name}`)
        .setColor(10944512)
        .setDescription(`\`\`\`css\nTarget: ${user.tag} (${user.id})\nIssued by: ${message.author.tag} (${message.author.id})\nReason: ${reason}\nDuration: Permanent\nLast message: ${lastMessage}\`\`\``)
        .setFooter("Moderation system powered by delet", this.client.user.displayAvatarURL)
        .setTimestamp();

        this.client.channels.get(modLog.id).send({embed});
    }
}

module.exports = Ban;