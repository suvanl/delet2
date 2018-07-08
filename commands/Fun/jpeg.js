const Command = require("../../base/Command.js");
const snekfetch = require("snekfetch");

class JPEG extends Command {
    constructor(client) {
      super(client, {
        name: "jpeg",
        description: "Needs more JPEG.",
        category: "Fun",
        usage: "jpeg [image-url]",
        aliases: ["jpegify"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
      const url = args[0];
      if (!url) return message.channel.send("You must provide a valid image URL to JPEGify.");

      const msg = await message.channel.send("Generating...");

      try {
        const { body } = await snekfetch.get(`https://nekobot.xyz/api/imagegen?type=jpeg&url=${url}`);
        message.channel.send("", { file: body.message });
        msg.edit("Done!");
      } catch (error) {
        if (error.startsWith("cannot identify image file")) return message.channel.send("Invalid URL. Please ensure the URL you're providing is an image URL.");
        this.client.logger.error(error);
        return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
      }
    }
}

module.exports = JPEG;
