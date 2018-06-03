const Command = require("../../base/Command.js");

class Emoji extends Command {
    constructor(client) {
      super(client, {
        name: "emoji",
        description: "Creates a new emoji.",
        category: "Utility",
        usage: "emoji [image link] [emoji name]",
        aliases: ["createemoji", "create-emoji"],
        guildOnly: true
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);
        if (!message.member.hasPermission("MANAGE_EMOJIS")) return message.reply("as you do not have the \"Manage Emojis\" permission, you cannot use this command.");
        
        const image = args[0];
        const name = args[1];
        let imgLink;

        if (!image) return message.channel.send("You must provide a valid **Imgur** or **vgy.me** image link, to create an emoji from.");

        if (image.match(/^https?:\/\/(\w+\.)?imgur.com\/(\w*\d\w*)+(\.[a-zA-Z]{3})?$/) || image.match(/^https?:\/\/(\w+\.)?vgy.me\/(\w*\d\w*)+(\.[a-zA-Z]{3})?$/)) {
          imgLink = true;
        } else {
          imgLink = false;
        }

        if (imgLink === false) return message.channel.send("Invalid image link. Please provide an **Imgur** or **vgy.me** image link.");
        if (!name) return message.channel.send("You must provide a name for the new emoji.");

        message.guild.createEmoji(image, name)
          .then(emoji => message.channel.send(`Created new emoji: \`:${emoji.name}:\`.`))
          .catch(error => {
            this.client.logger.error(error);
            message.channel.send(`An error occurred: \`\`\`${error.message}\`\`\``);
          });
    }
}

module.exports = Emoji;