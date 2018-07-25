const Command = require("../../base/Command.js");
const snekfetch = require("snekfetch");

class Lizard extends Command {
    constructor(client) {
      super(client, {
        name: "lizard",
        description: "Sends a random image of a lizard.",
        category: "Fun",
        usage: "lizard"
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        try {
            const { body } = await snekfetch.get("https://nekos.life/api/v2/img/lizard");
            return message.channel.send({ file: body.url });
        } catch (error) {
            this.client.logger.error(error.stack);
            return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
        }
    }
}

module.exports = Lizard;