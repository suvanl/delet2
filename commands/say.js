const Command = require("../base/Command.js");

class Say extends Command {
    constructor(client) {
      super(client, {
        name: "say",
        description: "Repeats your message.",
        category: "Fun",
        usage: "say [message]",
        aliases: ["repeat"]
      });
    }

    async run(message, level) {
        const args = message.content.split(" ").slice(1);
        message.channel.send(args.join(" "));
    }
}

module.exports = Say;