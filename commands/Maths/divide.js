const Command = require("../../base/Command.js");

class Divide extends Command {
    constructor(client) {
      super(client, {
        name: "divide",
        description: "Divides integer numbers.",
        category: "Maths",
        usage: "divide x y z (and so on)",
        aliases: ["div"]
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        const numArray = args.map(n => parseInt(n));
        if (!args[1] || numArray.length < 2) return message.channel.send("You must provide at least 2 integer numbers to divide.");

        const total = numArray.reduce((p, c) => p/c);

        message.channel.send(total);
    }
}

module.exports = Divide;
