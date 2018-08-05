const Command = require("../../base/Command.js");

class Say extends Command {
    constructor(client) {
      super(client, {
        name: "say",
        description: "Repeats your message.",
        category: "Fun",
        usage: "say [message]",
        aliases: ["repeat", "echo"]
      });
    }

    async run(message, args, level, settings) { // eslint-disable-line no-unused-vars
      const msg = args.join(" ");
      if (!msg) return message.channel.send("You must provide a message for me to repeat.");
      if (args[0].toLowerCase() === "tts" && !args[1]) return message.channel.send("You must provide a message for me to repeat with TTS.");

      return message.channel.send(args[0].toLowerCase() === "tts" ? msg.slice(4) : msg, { tts: args[0].toLowerCase() === "tts" ? true : false });
    }
}

module.exports = Say;