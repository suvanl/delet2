const Command = require("../../base/Command.js");

class Skip extends Command {
    constructor(client) {
      super(client, {
        name: "skip",
        description: "Skips the song that's currently playing.",
        category: "Music",
        usage: "skip",
        guildOnly: true
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        if (!message.member.voiceChannel) return message.channel.send(texts.music.noVoiceChannel);
        if (!serverQueue) return message.channel.send("There is nothing currently playing that can be skipped.");
        
        serverQueue.connection.dispatcher.end("Skip command used");
    }
}

module.exports = Skip;