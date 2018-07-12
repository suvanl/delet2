const Command = require("../../base/Command.js");
const snekfetch = require("snekfetch");

class FakeTweet extends Command {
    constructor(client) {
      super(client, {
        name: "faketweet",
        description: "Creates a fake tweet.",
        category: "Fun",
        usage: "faketweet [username] [message]",
        aliases: ["fake-tweet"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
      const user = args[0];
      if (!user) return message.channel.send("You must provide a Twitter username, to have as the author of the tweet.");

      const text = await this.client.awaitReply(message, "Please enter the tweet's message...\nReply with `cancel` to exit this text-entry period.", 30000);
      if (text.toLowerCase() === "cancel") return message.channel.send("Cancelled.");

      const msg = await message.channel.send("<a:loading:456928252502605834> Generating...");

      try {
        const { body } = await snekfetch.get(`https://nekobot.xyz/api/imagegen?type=tweet&username=${user}&text=${encodeURIComponent(text)}`);
        message.channel.send("", { file: body.message });
        msg.edit("Done!");
      } catch (error) {
        this.client.logger.error(error);
        return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
      }
    }
}

module.exports = FakeTweet;
