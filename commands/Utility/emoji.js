const Command = require("../../base/Command.js");

class Emoji extends Command {
    constructor(client) {
      super(client, {
        name: "emoji",
        description: "Creates a new emoji.",
        category: "Utility",
        usage: "emoji <image link> <emoji name>",
        aliases: ["createemoji", "create-emoji"],
        guildOnly: true
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);
        if (!message.member.hasPermission("MANAGE_EMOJIS")) return message.reply("as you do not have the \"Manage Emojis\" permission, you cannot use this command.");
        
        const image = args[0] ? args[0].replace(/<(.+)>/g, "$1") : null;
        const name = args[1];
        let isImgLink;

        if (!image) return message.channel.send("You must provide a valid **Imgur** or **vgy.me** image link, to create an emoji from.");

        if (image.startsWith("https://i.imgur") || image.startsWith("https://vgy.me")) {
          isImgLink = true;
        } else {
          isImgLink = false;
        }

        if (isImgLink === false) return message.channel.send("Invalid image link. Please ensure the image link you've provided is from either Imgur or vgy.me, and starts with `https://`.");
        if (!name) return message.channel.send("You must provide a name for the new emoji.");

        message.guild.createEmoji(image, name)
          .then(emoji => message.channel.send(`Created new emoji: <:${emoji.name}:${emoji.id}>.`))
          .catch(error => {
            if (error.message === "404 Not Found") return message.reply("an image could not be found at that link.");
            this.client.logger.error(error);
            message.channel.send(`An error occurred: \`\`\`${error.message}\`\`\``);
          });
    }
}

module.exports = Emoji;