const Command = require("../../base/Command.js");
const texts = require("../../util/globals.js");
const snekfetch = require("snekfetch");

class Dog extends Command {
    constructor(client) {
      super(client, {
        name: "dog",
        description: "Sends a random image of a dog.",
        category: "Fun",
        usage: "dog",
        aliases: [""],
        botPerms: ["ATTACH_FILES"]
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        const { body } = await snekfetch.get("https://dog.ceo/api/breeds/image/random");
        try {
            return message.channel.send({files: [body.message] });
        } catch (error) {
            this.client.logger.error(error);
            return message.channel.send(texts.error.replace(/{{err}}/g, error.message));
        }
    }
}

module.exports = Dog;