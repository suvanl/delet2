const Command = require("../../base/Command.js");
const snekfetch = require("snekfetch");

class FakeTweet extends Command {
    constructor(client) {
      super(client, {
        name: "faketweet",
        description: "Creates a fake tweet.",
        category: "Fun",
        usage: "faketweet <username> <message>",
        aliases: ["fake-tweet"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
      const user = args[0];
      let text = args.slice(1).join(" ") || undefined;
      if (!user) return message.channel.send("You must provide a Twitter username, to have as the author of the tweet.");

      if (!text) {
        text = await this.client.awaitReply(message, "Please enter the tweet's message...\nReply with `cancel` to exit this text-entry period.", 30000);
        if (text.toLowerCase() === "cancel") return message.channel.send("Cancelled.");
      }

      message.channel.startTyping();

      try {
        const { body } = await snekfetch.get(`https://nekobot.xyz/api/imagegen?type=${user.toLowerCase() === "realdonaldtrump" ? "trumptweet" : "tweet"}&username=${user.startsWith("@") ? user.slice(1) : user}&text=${encodeURIComponent(text)}`);
        message.channel.send("", { file: body.message });
        message.channel.stopTyping(true);
      } catch (error) {
        this.client.logger.error(error);
        return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
      }
    }
}

module.exports = FakeTweet;
