const Command = require("../../base/Command.js");

class Stop extends Command {
    constructor(client) {
      super(client, {
        name: "stop",
        description: "Ends the current song and deletes the entire queue.",
        category: "Music",
        usage: "stop",
        guildOnly: true
      });
    }

    async run(message, args, level, settings, texts, serverQueue) { // eslint-disable-line no-unused-vars
        if (!message.member.voiceChannel) return message.channel.send(texts.music.noVoiceChannel);
        if (!serverQueue) return message.channel.send("There is nothing currently playing that can be stopped.");

        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end("Stop command used");

        return message.channel.send("Music stopped.");
    }
}

module.exports = Stop;