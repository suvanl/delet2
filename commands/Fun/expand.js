const Command = require("../../base/Command.js");
const snekfetch = require("snekfetch");

class Expand extends Command {
    constructor(client) {
      super(client, {
        name: "expand",
        description: "Makes the specified text thicc.",
        category: "Fun",
        usage: "expand [text]",
        aliases: [""]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        const text = encodeURIComponent(args.join(" "));
        if (!text) return message.channel.send("You must provide some text to expand.");
        try {
            const { body } = await snekfetch.get(`http://artii.herokuapp.com/make?text=${text}`);
            message.channel.send(body.toString(), { code: "fix" });
        } catch (error) {
            this.client.logger.error(error);
            message.channel.send(texts.general.error.replace(/{{err}}/g, error));
        }
    }
}

module.exports = Expand;
