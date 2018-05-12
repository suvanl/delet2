const Command = require("../../base/Command.js");

class Play extends Command {
    constructor(client) {
      super(client, {
        name: "play",
        description: "Plays a song.",
        category: "Music",
        usage: "play [song title OR YouTube link]",
        aliases: [""],
        guildOnly: true
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        // See README.md to see why there is no code in here.
    }
}

module.exports = Play;