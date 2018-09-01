const Command = require("../../base/Command.js");

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

    const user = message.mentions.users.first();
    const reason = args.slice(1).join(" ");
    const modLog = message.guild.channels.find(c => c.name === settings.modLogChannel);
    if (!modLog) return message.channel.send(texts.moderation.modLogNotFound.replace(/{{prefix}}/g, settings.prefix));
    if (!user) return message.channel.send("You must mention a user to mute.");
    if (!reason) return message.channel.send("Please provide a reason for the punishment.");
    if (user.id === message.author.id) return message.reply("you cannot mute yourself!");


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
        return message.channel.send("Cancelled. I will not create a \"Muted\" role, and the mentioned user will not be muted.");
      }
    }

    if (!empty) {
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

        // TODO: modlog embed
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