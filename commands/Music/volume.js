const Command = require("../../base/Command.js");

class Volume extends Command {
    constructor(client) {
      super(client, {
        name: "volume",
        description: "Changes the volume of the current song. Default volume is 5.",
        category: "Music",
        usage: "volume [number]",
        aliases: [""],
        guildOnly: true
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        // See README.md to see why there is no code in here.
    }
}

module.exports = Volume;