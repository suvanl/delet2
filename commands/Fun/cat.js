const Command = require("../../base/Command.js");
const snekfetch = require("snekfetch");

class Cat extends Command {
    constructor(client) {
      super(client, {
        name: "cat",
        description: "Sends a random image of a cat.",
        category: "Fun",
        usage: "cat"
      });
    }

    async run(message, args, level, texts) { // eslint-disable-line no-unused-vars
        const { body } = await snekfetch.get("http://aws.random.cat/meow");
        try {
            return message.channel.send({files: [body.file] });
        } catch (error) {
            this.client.logger.error(error);
            return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
        }
    }
}

module.exports = Cat;