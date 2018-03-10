const Command = require("../../base/Command.js");
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
      message.channel.send({files: [body.message] });
    }
}

module.exports = Dog;