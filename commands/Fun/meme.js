const Command = require("../../base/Command.js");
const meme = require("memejs");

class Meme extends Command {
    constructor(client) {
      super(client, {
        name: "meme",
        description: "Sends a meme.",
        category: "Fun",
        usage: "meme",
        aliases: ["memes", "me_irl", "me-irl"]
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
      meme("me_irl", function(data, err) {
        if (err) return this.client.logger.error(err);
        message.channel.send(data.url[0]);
      });
    }
}

module.exports = Meme;