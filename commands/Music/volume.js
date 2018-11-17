const Command = require("../../base/Command.js");

class Volume extends Command {
    constructor(client) {
      super(client, {
        name: "volume",
        description: "Changes the volume of the current song. Default volume is 5.",
        category: "Music",
        usage: "volume <number>",
        aliases: ["vol"],
        guildOnly: true
      });
    }

    async run(message, args, level, settings, texts, serverQueue) { // eslint-disable-line no-unused-vars
      if (!message.member.voiceChannel) return message.channel.send(texts.music.noVoiceChannel);
      if (!serverQueue) return message.channel.send("There is nothing currently playing.");
      if (!args[0]) return message.channel.send(`The current volume is **${serverQueue.volume}**.`);

      serverQueue.volume = args[0];
      serverQueue.connection.dispatcher.setVolumeLogarithmic((args[0].toLowerCase() === "default" ? 5 : args[0]) / 5);

      return message.channel.send(`Volume set to **${args[0]}**.\nThe default volume level is 5.`);
    }
}

module.exports = Volume;