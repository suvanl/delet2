const Command = require("../../base/Command.js");
const fetch = require("node-fetch");

class Cat extends Command {
    constructor(client) {
      super(client, {
        name: "cat",
        description: "Sends a random image of a cat.",
        category: "Image",
        usage: "cat"
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        message.channel.startTyping();

        fetch("https://aws.random.cat/meow")
            .then(res => res.json())
            .then(data => message.channel.send({ file: data.file }))
            .catch(error => {
                this.client.logger.error(error);
                message.channel.stopTyping(true);
                return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
            });

        message.channel.stopTyping(true);
    }
}

module.exports = Cat;