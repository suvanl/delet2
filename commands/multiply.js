const Command = require("../base/Command.js");

class Multiply extends Command {
    constructor(client) {
      super(client, {
        name: "multiply",
        description: "Multiplies numbers together.",
        category: "Maths",
        usage: "multiply x y z (and so on)",
        aliases: ["product"]
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        const numArray = args.map(n => parseInt(n));
        const total = numArray.reduce( (p, c) => p*c);
        message.channel.send(total);
    }
}

module.exports = Multiply;