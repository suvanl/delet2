const Command = require("../../base/Command.js");
const { RichEmbed } = require("discord.js");

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

        if (!user || !message.mentions.users.size) {
            const embed = new RichEmbed()
            .setTitle(`🖼️ ${message.author.tag}'s avatar`)
            .setImage(message.author.displayAvatarURL);
        
        return message.channel.send({embed});
        }

        const embed = new RichEmbed()
            .setTitle(`${user.tag}'s avatar`)
            .setImage(user.displayAvatarURL);
            
        message.channel.send({embed});
    }
}

module.exports = Avatar;