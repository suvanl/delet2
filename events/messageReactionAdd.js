module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(reaction, user) {
        const message = reaction.message;

        // Checks if the added reaction is the ⭐ (star) emoji.
        // If it isn't, the bot will ignore the reaction.
        if (reaction.emoji.name !== "⭐") return;

        // Returns if the message author attempts to star their own message.
        if (message.author.id === user.id) return;

        // Gets the starboardChannel from the guild's settings, as well as the prefix.
        const { starboardChannel } = this.client.settings.get(message.guild.id);
        const { prefix } = this.client.settings.get(message.guild.id);

        // Notification message if starboard channel does not exist
        const notif = `
It appears that you don't have a starboard channel here.
To **set** one, please do \`${prefix}set edit starboardChannel starboard\`.
To **turn off** the starboard feature, use \`${prefix}set edit starboardChannel none\`.
        `;

        // If there is no starboardChannel, or if it's set to "none" (or other case variations),
        // the event will not be run, and the user will be notified.
        if (!message.guild.channels.exists("name", starboardChannel) || starboardChannel.toLowerCase() === "none") {
            return message.channel.send(notif);
        }

        const fetch = await message.guild.channels.find("name", starboardChannel).fetchMessages({ limit: 100 });
        const stars = fetch.find(m => m.embeds[0].footer.text.startsWith("⭐") && m.embeds[0].footer.text.endsWith(message.id));

        if (stars) {
            const star = /^⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.embeds[0].footer.text);
            const foundStar = stars.embeds[0];
            const image = message.attachments.size > 0 ? await this.extension(reaction, message.attachments.array()[0]) : "";

            const embed = new RichEmbed()
                .setColor(foundStar.color)
                .setDescription(foundStar.description)
                .setAuthor(message.author.tag, message.author.displayAvatarURL)
                .setTimestamp()
                .setFooter(`⭐ ${parseInt(star[1])+1} | ${message.id}`)
                .setImage(image);

            const starMessage = await message.guild.channels.find("name", starboardChannel).fetchMessage(stars.id);

            await starMessage.edit({ embed });
        }

        if (!stars) {
            if (!message.guild.channels.exists("name", starboardChannel) || starboardChannel.toLowerCase() === "none") {
                return message.channel.send(notif);
            }

            const image = message.attachments.size > 0 ? await this.extension(reaction, message.attachments.array()[0]) : "";
            if (image === "" && message.cleanContent.length < 1) return;

            const embed = new RichEmbed() // eslint-disable-line no-unused-vars
                .setColor(16378466)
                .setDescription(message.cleanContent)
                .setAuthor(message.author.tag, message.author.displayAvatarURL)
                .setFooter(`⭐ 1 | ${message.id}`)
                .setImage(image);
                
            await message.guild.channels.find("name", starboardChannel).send({ embed });
        }
    }
};