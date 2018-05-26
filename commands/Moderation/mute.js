const Command = require("../../base/Command.js");
const { RichEmbed } = require("discord.js");

class Mute extends Command {
  constructor(client) {
    super(client, {
      name: "mute",
      description: "Mutes the mentioned user.",
      category: "Moderation",
      usage: "mute [user] <reason>",
      aliases: ["permmute", "perm"],
      permLevel:"Moderator",
      botPerms: ["MANAGE_ROLES", "MANAGE_CHANNELS"],
      guildOnly: true
    });
  }

  // TODO: store `muteRole` as settings key, so custom name can be used; also fixes an issue caused by the muteRole not being found.

  async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
    if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);

    const user = message.mentions.users.first();
    const reason = args.slice(1).join(" ");
    const modLog = message.guild.channels.find("name", settings.modLogChannel);
    if (!modLog) return message.channel.send(`${texts.modLogNotFound.replace(/{{prefix}}/g, settings.prefix)}`);
    if (!user) return message.channel.send("You must mention a user to mute.");
    if (!reason) return message.channel.send("Please provide a reason for the punishment.");
    if (user.id === message.author.id) return message.reply("you cannot mute yourself!");

    const muteRole = message.guild.roles.find("name", "Muted");

    if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send("I do not have the required permission(s) to carry this out. Please ensure I have the \"Manage Roles\" permission.");

    if (!muteRole) {
        message.guild.createRole({
            name: "Muted",
            color: "RED",
            permissions: []
        }).catch(error => this.client.logger.error(error));
    }

    try {
      message.guild.channels.forEach(async (channel, id) => { // eslint-disable-line no-unused-vars
        await channel.overwritePermissions(muteRole, {
          SEND_MESSAGES: false,
          SPEAK: false
        });
      });
    } catch (error) {
      this.client.logger.error(error);
      return message.channel.send(texts.error.replace(/{{err}}/g, error.message));
    }

    const lastMessage = message.guild.member(user).lastMessageID;

    const embed = new RichEmbed()
    .setTitle(`🔇 Member muted in #${message.channel.name}`)
    .setColor(16758125)
    .setDescription(`\`\`\`fix\nIssued to: ${user.tag} (${user.id})\nIssued by: ${message.author.tag} (${message.author.id})\nReason: ${reason}\nDuration: Permanent\nChannel ID: ${message.channel.id}\nLast message: ${lastMessage}\`\`\``)
    .setFooter(texts.poweredBy, this.client.user.displayAvatarURL)
    .setTimestamp();

    if (message.guild.roles.find("name", "Muted") && message.guild.member(user).roles.has(muteRole.id)) {
      return message.channel.send("The mentioned user is already muted.");
    } else {
      message.guild.member(user).addRole(muteRole).then(() => {
        this.client.channels.get(modLog.id).send({embed});
        user.send(`You were muted in **${message.guild.name}**.\n\nReason: **${reason}**\nIn channel: **#${message.channel.name}**\nDuration: **Permanent**\n\nPlease make sure to read and follow the rules in the future, for any server that has rules.`);
        message.react("👌");
      });
    }
  }
}

module.exports = Mute;