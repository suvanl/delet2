const Command = require("../../base/Command.js");
const texts = require("../../util/globals.js");
const { RichEmbed } = require("discord.js");

class Unmute extends Command {
  constructor(client) {
    super(client, {
      name: "unmute",
      description: "Undoes the mentioned user's mute.",
      category: "Moderation",
      usage: "unmute [user] reason",
      aliases: [""],
      permLevel: "Moderator",
      guildOnly: true
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const settings = message.guild ? this.client.getSettings(message.guild.id) : this.client.settings.get("default");
    const user = message.mentions.users.first();
    const reason = args.slice(1).join(" ");
    const modLog = message.guild.channels.find("name", settings.modLogChannel);
    if (!modLog) return message.channel.send(`${texts.modLogNotFound.replace(/{{prefix}}/g, settings.prefix)}`);
    if (!user) return message.channel.send("You must mention a user to unmute.");
    if (!reason) return message.channel.send("Please provide a reason.");

    const muteRole = message.guild.roles.find("name", "Muted");

    if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send("I do not have the required permission(s) to carry this out. Please ensure I have the \"Manage Roles\" permission.");

    const embed = new RichEmbed()
    .setTitle("🔊 Member unmuted")
    .setColor(12451456)
    .setDescription(`\`\`\`fix\nUser: ${user.tag} (${user.id})\nUndone by: ${message.author.tag} (${message.author.id})\nReason: ${reason}\`\`\``)
    .setFooter(texts.poweredBy, this.client.user.displayAvatarURL)
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