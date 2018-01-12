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

    async run(message, args, level) {
        let numArray = args.map(n => parseInt(n));
        let total = numArray.reduce( (p, c) => p-c);
        message.channel.send(total);
    }
}

module.exports =  Subtract;