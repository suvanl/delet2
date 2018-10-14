const Command = require("../../base/Command.js");
const snekfetch = require("snekfetch");

class JPEG extends Command {
    constructor(client) {
      super(client, {
        name: "jpeg",
        description: "Needs more JPEG.",
        category: "Fun",
        usage: "jpeg <image url>",
        aliases: ["jpegify"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
      const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : null;
      if (!url || !url.startsWith("http")) return message.channel.send("You must provide a valid image URL to JPEGify.");

      message.channel.startTyping();

      try {
        const { body } = await snekfetch.get(`https://nekobot.xyz/api/imagegen?type=jpeg&url=${url}`);
        if (body.success === false) return message.channel.send("An error occurred. Please ensure the URL you're providing is an image URL.");
        message.channel.stopTyping(true);
        return message.channel.send("", { file: body.message });
      } catch (error) {
        this.client.logger.error(error);
        return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
      }
    }
}

module.exports = JPEG;
