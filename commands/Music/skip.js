const Command = require("../../base/Command.js");

class Skip extends Command {
    constructor(client) {
      super(client, {
        name: "skip",
        description: "Skips the song that's currently playing.",
        category: "Music",
        usage: "skip",
        aliases: [""],
        guildOnly: true
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        // See README.md to see why there is no code in here.
    }
}

module.exports = Skip;