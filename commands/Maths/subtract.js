const Command = require("../../base/Command.js");

class Subtract extends Command {
    constructor(client) {
      super(client, {
        name: "subtract",
        description: "Subtracts integer numbers.",
        category: "Maths",
        usage: "subtract x y z (and so on)",
        aliases: ["takeaway", "take-away", "minus"]
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        const numArray = args.map(n => parseInt(n));
        if (!args[1] || numArray.length < 2) return message.channel.send("You must provide at least 2 integer numbers to subtract from each other.");

        const total = numArray.reduce((p, c) => p-c);

        message.channel.send(total);
    }
}

module.exports = Subtract;
