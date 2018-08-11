const Command = require("../../base/Command.js");
const { currencies } = require("../../util/data.js");
const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

const fullName = {
  "EUR": "Euro",
  "GBP": "Pound Sterling",
  "NOK": "Norwegian Kroner",
  "USD": "US Dollar"
};

class Flip extends Command {
  constructor(client) {
    super(client, {
      name: "flip",
      description: "Flips/tosses a coin.",
      category: "Fun",
      usage: "flip",
      aliases: ["toss"],
      guildOnly: true
    });
  }

  async run(message, args, level, settings) { // eslint-disable-line no-unused-vars
      // If no currency is set
      if (settings.currency === ">>No currency set<<") return message.channel.send(stripIndents`
      I cannot run this command, as I don't know which currency to use on this server. Please set a currency by using:
      \`\`\`${settings.prefix}set edit currency TYPE\`\`\`
      Currently available types: ${currencies.map(c => "`" + c + "`").join(", ")}`);

      function coinFlip() {
        return (Math.floor(Math.random() * 2) == 0) ? "heads" : "tails";
      }

      const flip = coinFlip();

      const embed = new RichEmbed()
        .setDescription(`This flip's result was **${flip}**!\n\nTime taken: ${(this.client.ping / 1000).toFixed(3)}s\nCurrency: ${fullName[settings.currency]} (${settings.currency})`)
        .setThumbnail(flip === "heads" ? `https://delet.js.org/imgstore/currency/${settings.currency}/${settings.currency}heads.png` : `https://delet.js.org/imgstore/currency/${settings.currency}/${settings.currency}tails.png`);
      return message.channel.send({ embed });
  }
}

module.exports = Flip;
