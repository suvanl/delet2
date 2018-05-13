const Command = require("../../base/Command.js");

class Add extends Command {
    constructor(client) {
      super(client, {
        name: "add",
        description: "Adds integer numbers together.",
        category: "Maths",
        usage: "add x y z (and so on)",
        aliases: ["sum", "mathsadd"]
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        const numArray = args.map(n => parseInt(n));
        if (!args[1] || numArray.length < 2) return message.channel.send("You must provide at least 2 integer numbers to add.");

        const total = numArray.reduce((p, c) => p+c);
        
        message.channel.send(total);
    }
}

module.exports = Add;
