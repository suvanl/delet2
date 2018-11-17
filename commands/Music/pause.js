const Command = require("../../base/Command.js");

class Pause extends Command {
    constructor(client) {
      super(client, {
        name: "pause",
        description: "Pauses the current song.",
        category: "Music",
        usage: "pause",
        guildOnly: true
      });
    }

    async run(message, args, level, serverQueue) { // eslint-disable-line no-unused-vars
        if (serverQueue && serverQueue.playing) {
          serverQueue.playing = false;
          serverQueue.connection.dispatcher.pause();
          return message.channel.send("Paused.");
        }
        
        return message.channel.send("There is nothing currently playing.");
    }
}

module.exports = Pause;