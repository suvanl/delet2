const Command = require("../../base/Command.js");

class Divide extends Command {
    constructor(client) {
      super(client, {
        name: "divide",
        description: "Divides numbers together.",
        category: "Maths",
        usage: "divide x y z (and so on)",
        aliases: ["div"]
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        const numArray = args.map(n => parseInt(n));
        const total = numArray.reduce( (p, c) => p/c);
        message.channel.send(total);
    }
}

module.exports = Divide;
