const Command = require("../../base/Command.js");

class Queue extends Command {
    constructor(client) {
      super(client, {
        name: "queue",
        description: "Sends the current queue.",
        category: "Music",
        usage: "queue",
        aliases: [""],
        guildOnly: true
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        // See README.md to see why there is no code in here.
    }
}

module.exports = Queue;