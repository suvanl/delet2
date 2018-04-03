const Command = require("../../base/Command.js");
const Discord = require("discord.js");

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
      const reason = args.slice(1).join(" ");
      const modLog = message.guild.channels.find("name", settings.modLogChannel);
      if (!modLog) return message.channel.send(`Modlog channel not found. If you're an admin (or above) on this server, please use:\`\`\`${settings.prefix}set edit modLogChannel {{channel name}}\`\`\`\nFor example: \`${settings.prefix}set edit modLogChannel cool-channel-name\`.`);
      if (!user) return message.channel.send("You must mention a user to kick.");
      if (!reason) return message.channel.send("Please provide a reason for the punishment.");

      if (!message.guild.member(user).kickable) return message.reply("I cannot kick that user from this server!\nThis may be because I do not have the required permissions to do so, or they may be the server owner.");
      if (user === message.author) return message.channel.send("You cannot kick yourself.");
      try {
        message.guild.member(user).kick();
        message.react("👌");
      } catch (error) {
        return message.channel.send("An error occurred whilst trying to kick the mentioned user.");
      }

      const embed = new Discord.RichEmbed()
      .setTitle(`👢 Member kicked in #${message.channel.name}`)
      .setColor(16733525)
      .setDescription(`\`\`\`ruby\nIssued to: ${user.tag} (${user.id})\nIssued by: ${message.author.tag} (${message.author.id})\nReason: ${reason}\`\`\``)
      .setFooter("Moderation system powered by delet™", "https://i.imgur.com/No7WfpC.png")
      .setTimestamp();

      this.client.channels.get(modLog.id).send({embed});
    }
}

module.exports = Kick;