const Command = require("../../base/Command.js");
const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

class Unmute extends Command {
  constructor(client) {
    super(client, {
      name: "unmute",
      description: "Undoes the mentioned user's mute.",
      category: "Moderation",
      usage: "unmute <@user> <reason>",
      permLevel: "Moderator",
      guildOnly: true
    });
  }

  async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
    if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);
    if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send(texts.general.missingPerm.replace(/{{perm}}/g, "Manage Roles"));

    const muteRole = message.guild.roles.find(role => role.name === "Muted");
    const empty = await this.isEmpty(muteRole);
    if (empty) return message.channel.send(`A **\`Muted\`** role does not exist on this server. To create one, please run the \`${settings.prefix}mute\` command.`);

    const user = message.mentions.users.first();
    let reason = args.slice(1).join(" ");
    const modLog = message.guild.channels.find(c => c.name === settings.modLogChannel);
    if (!modLog) return message.channel.send(texts.moderation.modLogNotFound.replace(/{{prefix}}/g, settings.prefix));
    if (!user) return message.channel.send("You must mention a user to unmute.");
    if (user.id === message.author.id) return message.reply("you cannot unmute yourself!");
    if (message.guild.member(message.author).highestRole.position <= message.guild.member(user).highestRole.position) return message.channel.send("You cannot unmute this user as they have a higher role than you.");

    if (!reason) {
      message.channel.send("Please enter a reason for unmuting this user...\nThis text-entry period will time-out in 30 seconds. Reply with `cancel` to exit.");
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
      }).catch(() => {
        message.channel.send(texts.moderation.timedOut);
      });
    }

    if (message.guild.member(user).roles.has(muteRole.id)) {
      message.guild.member(user).removeRole(muteRole).then(() => {
          message.react("👌");
      });
    } else {
      return message.reply("the mentioned user isn't muted, so I cannot unmute them.");
    }

    try {
      const embed = new RichEmbed()
        .setTitle("🔊 Member unmuted")
        .setColor(12451456)
        .setDescription(stripIndents`
        \`\`\`css
          User: ${user.tag} (${user.id})
          Undone by: ${message.author.tag} (${message.author.id})
          Reason: ${reason}
        \`\`\`
        `)
        .setFooter(texts.moderation.poweredBy, this.client.user.displayAvatarURL)
        .setTimestamp();

      message.guild.channels.get(modLog.id).send({ embed });
      user.send(`You have been unmuted in **${message.guild.name}**.\nPlease ensure you always follow the rules to prevent being muted again!`);
    } catch (error) {
      this.client.logger.error(error.stack);
      return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
    }
  }

  async isEmpty(obj) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
    }
    return true;
  }
}

module.exports = Unmute;