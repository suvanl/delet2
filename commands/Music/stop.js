const Command = require("../../base/Command.js");

class Stop extends Command {
    constructor(client) {
      super(client, {
        name: "stop",
        description: "Ends the current song and deletes the entire queue.",
        category: "Music",
        usage: "stop",
        aliases: [""],
        guildOnly: true
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        // See README.md to see why there is no code in here.
    }
}

module.exports = Stop;