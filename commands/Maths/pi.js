const Command = require("../../base/Command.js");

class Pi extends Command {
    constructor(client) {
      super(client, {
        name: "pi",
        description: "Returns the value of Pi (π).",
        category: "Maths",
        usage: "pi",
        aliases: ["π"]
      });
    }

    async run(message, args, level, settings) { // eslint-disable-line no-unused-vars
        message.channel.send(`π = **${Math.PI}**...`);
    }
}

module.exports = Pi;
