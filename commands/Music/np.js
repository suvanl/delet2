const Command = require("../../base/Command.js");

class NP extends Command {
    constructor(client) {
      super(client, {
        name: "np",
        description: "Returns the title of the song that's currently playing.",
        category: "Music",
        usage: "np",
        aliases: [""],
        guildOnly: true
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        // See README.md to see why there is no code in here.
    }
}

module.exports = NP;