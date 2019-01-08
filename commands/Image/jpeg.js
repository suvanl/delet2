const Command = require("../../base/Command.js");
const fetch = require("node-fetch");

class JPEG extends Command {
    constructor(client) {
      super(client, {
        name: "jpeg",
        description: "Needs more JPEG.",
        category: "Image",
        usage: "jpeg <image url>",
        aliases: ["jpegify"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
      const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : null;
      if (!url || !url.startsWith("http")) return message.channel.send("You must provide a valid image URL to JPEGify.");

      message.channel.startTyping();

      fetch(`https://nekobot.xyz/api/imagegen?type=jpeg&url=${url}`)
        .then(res => res.json())
        .then(data => {
          if (!data.success) return message.channel.send("An error occurred. Please ensure the URL you're providing is an image URL.");
          message.channel.stopTyping(true);
          return message.channel.send({ file: data.message });
        })
        .catch(error => {
          this.client.logger.error(error);
          message.channel.stopTyping(true);
          return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
        });
    }
}

module.exports = JPEG;
