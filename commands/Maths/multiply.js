const Command = require("../../base/Command.js");

class Multiply extends Command {
    constructor(client) {
      super(client, {
        name: "multiply",
        description: "Multiplies integer numbers together.",
        category: "Maths",
        usage: "multiply x y z (and so on)",
        aliases: ["product"]
      });
    }

    async run(message, args, level, settings) { // eslint-disable-line no-unused-vars
        const locale = settings.language;

        const numArray = args.map(n => parseInt(n));
        if (!args[1] || numArray.length < 2) return message.channel.send("You must provide at least 2 integer numbers to multiply together.");

        const total = numArray.reduce((p, c) => p*c);

        message.channel.send(total.toLocaleString(locale));
    }
}

module.exports = Multiply;
