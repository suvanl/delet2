const Command = require("../../base/Command.js");

class NP extends Command {
    constructor(client) {
      super(client, {
        name: "np",
        description: "Returns the title of the song that's currently playing.",
        category: "Music",
        usage: "np",
        aliases: ["song"],
        guildOnly: true
      });
    }

    async run(message, args, level, serverQueue) { // eslint-disable-line no-unused-vars
        if (!serverQueue) return message.channel.send("There is nothing currently playing.");
        return message.channel.send(`Now playing: **${serverQueue.songs[0].title}**`);
    }
}

module.exports = NP;