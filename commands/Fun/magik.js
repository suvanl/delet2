const Command = require("../../base/Command.js");
const snekfetch = require("snekfetch");

class Magik extends Command {
    constructor(client) {
      super(client, {
        name: "magik",
        description: "Adds a \"magik\" effect to the specified image.",
        category: "Fun",
        usage: "magik <image-url>"
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
      const url = args[0];
      if (!url) return message.channel.send("You must provide a valid image URL to add some ***magik*** to.");

      const msg = await message.channel.send("<a:loading:456928252502605834> Generating...");

      try {
        const { body } = await snekfetch.get(`https://nekobot.xyz/api/imagegen?type=magik&image=${url}`);
        message.channel.send("", { file: body.message });
        if (body.message.startsWith("no decode delegate for this image format")) return msg.edit("Invalid URL. Please ensure the URL you're providing is an image URL.");
        msg.edit("Done!");
      } catch (error) {
        this.client.logger.error(error);
        return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
      }
    }
}

module.exports = Magik;
