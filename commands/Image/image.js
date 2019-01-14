const Command = require("../../base/Command.js");
const { get } = require("snekfetch");

class Image extends Command {
    constructor(client) {
      super(client, {
        name: "image",
        description: "Returns a random image.",
        category: "Image",
        usage: "image [size (e.g. 1920x1080)]",
        aliases: ["randomimage", "random-image"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        let size = args[0];
        if (!args[0]) size = "";

        message.channel.startTyping();

        try {
            const { raw } = await get(`https://source.unsplash.com/random/${size}`);
            message.channel.send("", { files: [{ attachment: raw, name: "image.jpg" }] });
            return message.channel.stopTyping(true);
        } catch (error) {
            this.client.logger.error(error);
            return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
        }
    }
}

module.exports = Image;
