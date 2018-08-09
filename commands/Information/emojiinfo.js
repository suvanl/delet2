const Command = require("../../base/Command.js");
const { RichEmbed } = require("discord.js");
const moment = require("moment");

class EmojiInfo extends Command {
    constructor(client) {
      super(client, {
        name: "emojiinfo",
        description: "Displays information about the specified emoji.",
        category: "Information",
        usage: "emojiinfo <emoji>",
        aliases: ["emoji-info", "einfo"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        if (!args[0]) return message.channel.send(texts.cmd.info.noEmoji);
        if (args[0].charCodeAt(0) >= 55296) return message.channel.send(`${texts.cmd.info.regularEmoji.replace(/{{emoji}}/g, args[0])}\nhttps://twitter.github.io/twemoji/`);

        const match = args[0].match(/<:[a-zA-Z0-9_-]+:(\d{18})>/);
        if (!match || !match[1]) return message.channel.send(texts.cmd.info.invalidEmoji);

        // Using the `emojis` property from Client rather than Guild so Nitro users can use this command for a wider range of emojis
        const emoji = this.client.emojis.get(match[1]);
        if (!emoji) return message.channel.send(texts.cmd.info.invalidEmoji);

        const embed = new RichEmbed()
            .setColor(2934736)
            .setTitle("Emoji Information")
            .setThumbnail(emoji.url)
            .addField("❯ Name", emoji.name, true)
            .addField("❯ ID", emoji.id, true)
            .addField("❯ Created", moment.utc(emoji.createdAt).format("DD/MM/YYYY"), true)
            .addField("❯ From", emoji.guild, true)
            .setFooter(`Info requested by ${message.author.tag}`, message.author.displayAvatarURL)
            .setTimestamp();

        return message.channel.send({ embed });
    }
}

module.exports = EmojiInfo;
