const Command = require("../../base/Command.js");
const { get } = require("snekfetch");

class BigLetter extends Command {
    constructor(client) {
      super(client, {
        name: "bigletter",
        description: "Converts the specified text to regional indicators.",
        category: "Fun",
        usage: "bigletter <text>",
        aliases: ["regional", "regional-indicator"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
      const text = args.join(" ");
      if (!text) return message.channel.send("You must provide some text to convert to regional indicator emojis.");

      try {
          const { body } = await get(`https://nekobot.xyz/api/text?type=bigletter&text=${encodeURIComponent(text)}`);
          return message.channel.send(body.message);
      } catch (error) {
          this.client.logger.error(error);
          return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
      }
    }
}

module.exports = BigLetter;
