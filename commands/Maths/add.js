const Command = require("../../base/Command.js");

class Add extends Command {
    constructor(client) {
      super(client, {
        name: "add",
        description: "Adds numbers together.",
        category: "Maths",
        usage: "add x y z (and so on)",
        aliases: ["sum", "mathsadd"]
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        // const num = args[1];
        // if (!num) return message.channel.send("You must provide some (integer) numbers to add.");

        const numArray = args.map(n => parseInt(n));
        const total = numArray.reduce((p, c) => p+c);
        message.channel.send(total);
    }
}

module.exports = Add;
