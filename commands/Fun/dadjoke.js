const Command = require("../../base/Command.js");
const { get } = require("snekfetch");

class DadJoke extends Command {
    constructor(client) {
      super(client, {
        name: "dadjoke",
        description: "Sends a random dad joke.",
        category: "Fun",
        usage: "dadjoke",
        aliases: ["dad", "dadj", "badjoke", "joke"]
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        const msg = await message.channel.send("Contacting dad... 🤔");
        const { text } = await get("https://icanhazdadjoke.com/").set("Accept", "text/plain");

        msg.edit(text);
    }
}

module.exports = DadJoke;
