const Command = require("../../base/Command.js");
const texts = require("../../locales/en_GB");
const snekfetch = require("snekfetch");

class Cat extends Command {
    constructor(client) {
      super(client, {
        name: "cat",
        description: "Sends a random image or GIF of a cat.",
        category: "Fun",
        usage: "cat",
        aliases: [""],
        botPerms: ["ATTACH_FILES"]
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        const { body } = await snekfetch.get("http://aws.random.cat/meow").catch(error => this.client.logger.error(error));
        try {
            message.channel.send({files: [body.file] });
        } catch (error) {
            this.client.logger.error(error);
            return message.channel.send(texts.error.replace(/{{err}}/g, error.message));
        }
    }
}

module.exports = Cat;