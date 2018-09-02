const Command = require("../../base/Command.js");
const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

class Mute extends Command {
  constructor(client) {
    super(client, {
      name: "mute",
      description: "Mutes the mentioned user.",
      category: "Moderation",
      usage: "mute <user> <reason>",
      aliases: ["permmute", "perm"],
      permLevel:"Moderator",
      guildOnly: true
    });
  }

  async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
    if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);
    if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send(texts.general.missingPerm.replace(/{{perm}}/g, "Manage Roles"));

    const muteRole = message.guild.roles.find(role => role.name === "Muted");
    const empty = await this.isEmpty(muteRole);
    if (empty) {
      const roleRequest = await this.client.awaitReply(message, "A \"**Muted**\" role does not exist on this server. Would you like me to create one? (__Y__es / __N__o)", 30000);
      if (roleRequest.toLowerCase() === "y" || roleRequest.toLowerCase() === "yes") {
        message.guild.createRole({ name: "Muted" })
          .then(role => message.channel.send(`✅ Created new role: **${role.name}**.`))
          .catch(error => {
            this.client.logger.error(error.stack);
            return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
          });
      } else {
        return message.channel.send("Cancelled. I will not create a \"Muted\" role. You will not be able to mute users without having a \"Muted\" role.");
      }
    }

    const user = message.mentions.users.first();
    let reason = args.slice(1).join(" ");
    const modLog = message.guild.channels.find(c => c.name === settings.modLogChannel);
    if (!modLog) return message.channel.send(texts.moderation.modLogNotFound.replace(/{{prefix}}/g, settings.prefix));
    if (!user) return message.channel.send("You must mention a user to mute.");
    if (user.id === message.author.id) return message.reply("you cannot mute yourself!");
    if (message.guild.member(message.author).highestRole.position <= message.guild.member(user).highestRole.position) return message.channel.send("You cannot mute this user as they have a higher role than you.");

    if (!empty) {
      if (message.guild.member(user).roles.has(muteRole.id)) {
        return message.channel.send("The mentioned user is already muted.");
      }

      if (!reason) {
        message.channel.send(texts.moderation.awaitReason);
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

      message.guild.channels.forEach(async (channel) => {
        await channel.overwritePermissions(muteRole, {
          SEND_MESSAGES: false,
          SPEAK: false
        }).catch(error => {
          this.client.logger.error(error.stack);
          return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
        });
      });
  
      message.guild.member(user).addRole(muteRole.id)
        .then(member => message.channel.send(`**${member.user.tag}** was successfully muted.`))
        .catch(error => {
          this.client.logger.error(error.stack);
          return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
        });

        try {
          const embed = new RichEmbed()
            .setTitle(`🔇 Member muted in #${message.channel.name}`)
            .setColor(16772735)
            .setDescription(stripIndents`
            \`\`\`css
              Target: ${user.tag} (${user.id})
              Issued by: ${message.author.tag} (${message.author.id})
              Reason: ${reason}
            \`\`\`
            `)
            .setFooter(texts.moderation.poweredBy, this.client.user.displayAvatarURL)
            .setTimestamp();

          message.guild.channels.get(modLog.id).send({ embed });
          user.send(stripIndents`
          You were muted by staff in the **${message.guild.name}** server for the reason "${reason}".
          Please ensure you follow all the rules of the server in the future to avoid this occurring again.`);
        } catch (error) {
          this.client.logger.error(error.stack);
          return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
        }
    }
  }

  async isEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }
}

module.exports = Mute;