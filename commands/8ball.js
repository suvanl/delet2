const Command = require("../base/Command.js");

class EightBall extends Command {
  constructor(client) {
    super(client, {
      name: "8ball",
      description: "Consults my magic 8-ball!",
      category: "Fun",
      usage: "8ball [query]",
      aliases: ["8-ball"]
    });
  }

  async run(message, args, level) {
      const fortunes = [
        "Yes.",
        "No.",
        "Maybe.",
        "Most certainly!",
        "Definitely not.",
        "Undoubtedly.",
        "Affirmative.",
        "Negative.",
        "No way, José!",
        "Only on Wednesdays.",
        "If you are Ethan, yes. Otherwise, no.",
        "no fucc u",
        "**Yes**, but only because Discord is connected to your real-time communication server on eu-west324 with an average ping of 30ms. The last ping was 30ms.\nIf the ping is not consistent or more than 250ms, consider asking the server owner to switch to another region.",
        "Certainly not.",
        "Seems like my magic 8 ball is broken...",
        "I sure hope so!",
        "There is a good chance.",
        "Quite likely.",
        "I think so.",
        "I hope not.",
        "I hope so.",
        "Possibly.",
        "Forget about it.",
        "https://giphy.com/gifs/eXQPwwE8DFTZS",
        "sry gtg"
      ];

      if (args[1]) message.channel.send(fortunes[Math.floor(Math.random() * fortunes.length)]);
        else message.channel.send("I can't read that! :(");
  }
}

module.exports = EightBall;
