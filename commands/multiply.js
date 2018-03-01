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
        let numArray = args.map(n => parseInt(n));
        let total = numArray.reduce( (p, c) => p*c);
        message.channel.send(total);

        if (message.content.startsWith(`${this.client.settings.get("default").prefix}multiply 12 12`)) {
            message.react('312695712565559296');
        }
    }
}

module.exports = Multiply;