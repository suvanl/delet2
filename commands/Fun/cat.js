const Command = require("../../base/Command.js");
const texts = require("../../util/globals.js");
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
        const { body } = await snekfetch.get("https://random.cat/meow");
        try {
            message.channel.send("Unfortunately, the cat API can sometimes be quite slow. Please wait for your image to be fetched, this is not an error.")
                .then(msg => {
                    msg.delete(10000);
                });
            message.channel.send({files: [body.file] });
        } catch (error) {
            this.client.logger.error(error);
            return message.channel.send(`${texts.error}${error.message}`);
        }
    }
}

module.exports = Cat;