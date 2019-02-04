const Command = require("../../base/Command.js");
const fetch = require("node-fetch");

class Dog extends Command {
    constructor(client) {
      super(client, {
        name: "dog",
        description: "Sends a random image of a dog.",
        category: "Image",
        usage: "dog"
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        message.channel.startTyping();

        fetch("https://dog.ceo/api/breeds/image/random")
            .then(res => res.json())
            .then(data => message.channel.send({ file: data.message }))
            .catch(error => {
                this.client.logger.error(error);
                message.channel.stopTyping(true);
                return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
            });

        message.channel.stopTyping(true);
    }
}

module.exports = Dog;