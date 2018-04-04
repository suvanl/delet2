const Command = require("../../base/Command.js");
const Discord = require("discord.js");

class Unmute extends Command {
  constructor(client) {
    super(client, {
      name: "unmute",
      description: "Undoes the mentioned user's mute.",
      category: "Moderation",
      usage: "unmute [user] reason",
      aliases: [""],
      permLevel: "Moderator",
      botPerms: ["MANAGE_ROLES", "MANAGE_CHANNELS"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const settings = message.guild ? this.client.getSettings(message.guild.id) : this.client.settings.get("default");
    const user = message.mentions.users.first();
    const reason = args.slice(1).join(" ");
    const modLog = message.guild.channels.find("name", settings.modLogChannel);
    if (!modLog) return message.channel.send(`Modlog channel not found. If you're an admin (or above) on this server, please use:\`\`\`${settings.prefix}set edit modLogChannel {{channel name}}\`\`\`\nFor example: \`${settings.prefix}set edit modLogChannel cool-channel-name\`.`);
    if (!user) return message.channel.send("You must mention a user to unmute.");
    if (!reason) return message.channel.send("Please provide a reason.");

    const muteRole = message.guild.roles.find("name", "Muted");

    if (!message.guild.member(this.client.user).hasPermission("MANAGE_ROLES")) return message.channel.send("I do not have the required permission(s) to carry this out.");

    const embed = new Discord.RichEmbed()
    .setTitle("🔊 Member unmuted")
    .setColor(12451456)
    .setDescription(`\`\`\`fix\nUser: ${user.tag} (${user.id})\nUndone by: ${message.author.tag} (${message.author.id})\nReason: ${reason}\`\`\``)
    .setFooter("Moderation system powered by delet™", this.client.user.displayAvatarURL)
    .setTimestamp();

    if (message.guild.member(user).roles.has(muteRole.id)) {
      message.guild.member(user).removeRole(muteRole).then(() => {
          this.client.channels.get(modLog.id).send({embed});
          user.send(`You have been unmuted in **${message.guild.name}**. Please ensure you always follow the rules to prevent being muted again!`);
          message.react("👌");
      });
    } else {
      return message.reply("the mentioned user isn't muted, so I cannot unmute them.");
    }
  }
}

module.exports = Unmute;