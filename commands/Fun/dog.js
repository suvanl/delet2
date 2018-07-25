const Command = require("../../base/Command.js");
const snekfetch = require("snekfetch");

class Dog extends Command {
    constructor(client) {
      super(client, {
        name: "dog",
        description: "Sends a random image of a dog.",
        category: "Fun",
        usage: "dog"
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        try {
            const { body } = await snekfetch.get("https://dog.ceo/api/breeds/image/random");
            return message.channel.send({ file: body.message });
        } catch (error) {
            this.client.logger.error(error);
            return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
        }
    }
}

module.exports = Dog;