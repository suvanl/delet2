const Command = require("../../base/Command.js");

class Resume extends Command {
    constructor(client) {
      super(client, {
        name: "resume",
        description: "Resumes the music if currently paused.",
        category: "Music",
        usage: "resume",
        guildOnly: true
      });
    }

    async run(message, args, level, serverQueue) { // eslint-disable-line no-unused-vars
        if (serverQueue && !serverQueue.playing) {
          serverQueue.playing = true;
          serverQueue.connection.dispatcher.resume();
          return message.channel.send("Resuming...");
        }

        return message.channel.send("There is nothing currently playing.");
    }
}

module.exports = Resume;
