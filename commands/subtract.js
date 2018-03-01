const Command = require("../base/Command.js");

class Subtract extends Command {
    constructor(client) {
      super(client, {
        name: "subtract",
        description: "Subtracts numbers.",
        category: "Maths",
        usage: "subtract x y z (and so on)",
        aliases: ["takeaway"]
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        const numArray = args.map(n => parseInt(n));
        const total = numArray.reduce( (p, c) => p-c);
        message.channel.send(total);
    }
}

module.exports = Subtract;