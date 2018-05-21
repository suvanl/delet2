const Command = require("../../base/Command.js");
const texts = require("../../locales/en_GB");

const songs = [
  `${process.cwd()}/assets/audio/Vaporwave1.mp3`,
  `${process.cwd()}/assets/audio/Vaporwave2.mp3`,
  `${process.cwd()}/assets/audio/Vaporwave3.mp3`,
  `${process.cwd()}/assets/audio/Vaporwave4.mp3`
];

class Vaporwave extends Command {
    constructor(client) {
      super(client, {
        name: "vaporwave",
        description: "Plays vaporwave music.",
        category: "Fun",
        usage: "vaporwave <play|stop>",
        aliases: [""]
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
      const voiceChannel = message.member.voiceChannel;
      if (!voiceChannel) return message.channel.send("You must be in a voice channel to be able to play ＶＡＰＯＲＷＡＶＥ　ＭＵＳＩＣ　可益ビ.");

      const permissions = voiceChannel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT")) return message.channel.send("I cannot play any music, as I do not have the \"ＣＯＮＮＥＣＴ\" permission.");
      if (!permissions.has("SPEAK")) return message.channel.send("I cannot play any music, as I do not have the \"ＳＰＥＡＫ\" permission.");

      if (args[0] && args[0].toLowerCase() === "stop") {
        if (!voiceChannel) return message.channel.send("You must be in a ＶＯＩＣＥ　ＣＨＡＮＮＥＬ to use this command.");
        voiceChannel.leave();
        return message.channel.send("ＳＴＯＰＰＥＤ");
      }

      try {
          const connection = await voiceChannel.join(); // eslint-disable-line no-unused-vars
      } catch (error) {
          this.client.logger.error(`Couldn't join voice channel: ${error}`);
          return message.channel.send(texts.error.replace(/{{err}}/g, error.message));
      }

      const connection = await voiceChannel.join();
      const dispatcher = connection.playFile(songs.random())
        .on("end", () => voiceChannel.leave())
        .on("error", error => this.client.logger.error(error));
      dispatcher.setVolumeLogarithmic(5 / 5);
    }
}

module.exports = Vaporwave;