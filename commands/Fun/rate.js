const Command = require("../../base/Command.js");

class Rate extends Command {
    constructor(client) {
      super(client, {
        name: "rate",
        description: "Rates something out of 10.",
        category: "Fun",
        usage: "rate [query]"
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
      const rateObject = args.join(" ");
      if (!rateObject) return message.channel.send(texts.cmd.noRate);
      const rate = Math.floor(Math.random() * 10) +1;

      let rateMsg;

      if (rate === 0) rateMsg = "a big fat";
      if (rate === 0 || rate === 1 || rate === 2) rateMsg = "quite a poor";
      if (rate === 3 || rate === 4) rateMsg = "an improvable";
      if (rate === 5 || rate === 6) rateMsg = "a pretty moderate";
      if (rate === 7 || rate === 8 || rate === 9) rateMsg = "a high";
      if (rate === 10) rateMsg = "a solid";

      message.channel.send(`I'd give "${rateObject}" ${rateMsg} ${rate}/10.`);
    }
}

module.exports = Rate;