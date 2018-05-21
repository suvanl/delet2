const Command = require("../../base/Command.js");
const texts = require("../../locales/en_GB");

class ClearNick extends Command {
  constructor(client) {
    super(client, {
      name: "clearnick",
      description: "Clear's a user's nickname.",
      category: "Moderation",
      usage: "clearnick",
      aliases: ["clearnickname", "cn"],
      permLevel: "Moderator",
      guildOnly: true
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const user = message.mentions.users.first();
    if (!user) return message.channel.send("You must provide a user to clear a nickname for.");
    const nick = message.guild.member(user).nickname;
    if (!nick) return message.channel.send("The mentioned user does not currently have a nickname.");
    if (!message.guild.me.hasPermission("MANAGE_NICKNAMES")) return message.channel.send("I cannot change any nicknames, as I do not have the \"Manage Nicknames\" permission.");
    if (message.guild.member(user).highestRole.position >= message.guild.me.highestRole.position) return message.channel.send("I do not have permission to change this user's nickname.");

    message.guild.member(user).setNickname("", "Clearing bad nickname")
        .catch(error => {
            if (error.message === "Privilege is too low...") {
              return message.channel.send("I do not have permission to change this user's nickname.");
            } else {
              this.client.logger.error(error);
              return message.channel.send(texts.error.replace(/{{err}}/g, error.message));
            }
        });
  }
}

module.exports = ClearNick;