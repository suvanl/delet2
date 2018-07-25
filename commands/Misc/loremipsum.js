const Command = require("../../base/Command.js");
const { get } = require("snekfetch");

class LoremIpsum extends Command {
    constructor(client) {
      super(client, {
        name: "loremipsum",
        description: "Need placeholder text for your website? Look no further.",
        usage: "loremipsum",
        aliases: ["placeholder", "lorem", "lorem-ipsum"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        try {
          const { raw } = await get("https://loripsum.net/api").set("Accept", "text/plain");
          const text = raw.toString();
          message.channel.send(text, { code: "html" });
        } catch (error) {
          this.client.logger.error(error);
          return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
        }
    }
}

module.exports = LoremIpsum;
