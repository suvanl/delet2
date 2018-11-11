const Command = require("../../base/Command.js");

class Vaportext extends Command {
    constructor(client) {
      super(client, {
        name: "vaportext",
        description: "A E S T H E T I C",
        category: "Fun",
        usage: "vaportext <text>",
        aliases: ["vapor", "vapour", "vapourtext"]
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        if (!args.length) return message.channel.send("You must provide some text to make ***A E S T H E T I C A L L Y   P L E A S I N G***.");

        let msg = "";
        for (let i = 0; i < args.length; i++) {
            msg += args[i].toUpperCase().split("").join(" ") + "   ";
        }

        return message.channel.send(msg);
    }
}

module.exports = Vaportext;
