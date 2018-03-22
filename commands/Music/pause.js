const Command = require("../../base/Command.js");

class Pause extends Command {
    constructor(client) {
      super(client, {
        name: "pause",
        description: "Pauses the current song.",
        category: "Music",
        usage: "pause",
        aliases: [""]
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        // See README.md to see why there is no code in here.
    }
}

module.exports = Pause;