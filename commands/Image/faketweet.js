const Command = require("../../base/Command.js");
const fetch = require("node-fetch");

class FakeTweet extends Command {
    constructor(client) {
      super(client, {
        name: "faketweet",
        description: "Creates a fake tweet.",
        category: "Image",
        usage: "faketweet <username> <message>",
        aliases: ["fake-tweet"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
      let user = args[0];
      let text = args.slice(1).join(" ") || undefined;
      if (!user) return message.channel.send("You must provide a Twitter username, to have as the author of the tweet.");
      if (user.startsWith("@")) user = args[0].slice(1);

      const type = user.toLowerCase() === "realdonaldtrump" ? "trumptweet" : "tweet";
      const u = user.startsWith("@") ? user.slice(1) : user;

      if (!text) {
        text = await this.client.awaitReply(message, "Please enter the tweet's message...\nReply with `cancel` to exit this text-entry period.", 30000);
        if (text.toLowerCase() === "cancel") return message.channel.send("Cancelled.");
      }

      message.channel.startTyping();

      fetch(`https://nekobot.xyz/api/imagegen?type=${type}&username=${u}&text=${encodeURIComponent(text)}`)
        .then(res => res.json())
        .then(data => message.channel.send({ file: data.message }))
        .catch(error => {
          this.client.logger.error(error);
          message.channel.stopTyping(true);
          return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
        });

        message.channel.stopTyping(true);
    }
}

module.exports = FakeTweet;
