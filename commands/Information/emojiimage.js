const Command = require("../../base/Command.js");
const { RichEmbed } = require("discord.js");

class EmojiImage extends Command {
    constructor(client) {
      super(client, {
        name: "emojiimage",
        description: "Sends the specified emoji as an image.",
        category: "Information",
        usage: "emojiimage <emoji>",
        aliases: ["emoji-image", "bigemoji", "hugemoji", "hugeemoji"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        if (!args[0]) return message.channel.send(texts.cmd.info.noEmoji);
        if (args[0].startsWith("<a:")) return message.channel.send("This command does not support animated emojis yet.");
        if (args[0].charCodeAt(0) >= 55296) return message.channel.send(`${texts.cmd.info.regularEmoji.replace(/{{emoji}}/g, args[0])}\nhttps://twitter.github.io/twemoji/`);

        const match = args[0].match(/<:[a-zA-Z0-9_-]+:(\d{18})>/);
        if (!match || !match[1]) return message.channel.send(texts.cmd.info.invalidEmoji);

        // Using the `emojis` property from Client rather than Guild so Nitro users can use this command for a wider range of emojis
        const emoji = this.client.emojis.get(match[1]);
        if (!emoji) return message.channel.send(texts.cmd.info.invalidEmoji);

        const embed = new RichEmbed()
            .setColor(2934736)
            .setTitle(emoji.name)
            .setImage(emoji.url);

        return message.channel.send({ embed });
    }
}

module.exports = EmojiImage;
