const Command = require("../../base/Command.js");
const Discord = require("discord.js");

class Avatar extends Command {
    constructor(client) {
      super(client, {
        name: "avatar",
        description: "Sends the mentioned user's avatar.",
        usage: "avatar [@mention]",
        aliases: ["avy"]
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        const user = message.mentions.users.first();

        if (!user) {
            const embed = new Discord.RichEmbed()
            .setTitle(`${message.author.tag}'s avatar`)
            .setImage(`${message.author.avatarURL}`);
            message.channel.send({embed});
            return;
        }

        const embed = new Discord.RichEmbed()
        .setTitle(`${user.tag}'s avatar`)
        .setImage(`${user.avatarURL}`);
        message.channel.send({embed});
    }
}

module.exports = Avatar;