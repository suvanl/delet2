const Command = require("../../base/Command.js");
const { RichEmbed } = require("discord.js");

class Avatar extends Command {
    constructor(client) {
      super(client, {
        name: "avatar",
        description: "Sends the mentioned user's avatar.",
        category: "Information",
        usage: "avatar [@mention]",
        aliases: ["ava", "avy"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        const user = message.mentions.users.first() || message.author;

        const embed = new RichEmbed()
            .setTitle(`🖼️ ${texts.cmd.info.avatar.replace(/{{user}}/g, user.tag)}`)
            .setImage(user.displayAvatarURL);
        return message.channel.send({ embed });
    }
}

module.exports = Avatar;