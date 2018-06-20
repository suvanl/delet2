const Command = require("../../base/Command.js");
const { currencies } = require("../../util/data.js");
const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

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

      // Pounds [£] (GBP)
      if (settings.currency === "GBP") {

      if (flip === "Heads") {
        const embed = new RichEmbed()
          .setDescription(`This flip's result was ${flip}!\n\nTime taken: ${Math.round(this.client.ping)}ms\nCurrency: Pound Sterling (GBP)`)
          .setThumbnail("https://vgy.me/yvnN22.png");
        message.channel.send({embed});
      } else {
        const embed = new RichEmbed()
          .setDescription(`This flip's result was ${flip}!\n\nTime taken: ${Math.round(this.client.ping)}ms\nCurrency: Pound Sterling (GBP)`)
          .setThumbnail("https://vgy.me/PfWWql.png");
        message.channel.send({embed});
      }
    }

    // Euros [€] (EUR)
    if (settings.currency === "EUR") {
      if (flip === "Heads") {
        const embed = new RichEmbed()
          .setDescription(`This flip's result was ${flip}!\n\nTime taken: ${Math.round(this.client.ping)}ms\nCurrency: Euro (EUR)`)
          .setThumbnail("https://vgy.me/QgVomc.png");
        message.channel.send({embed});
      } else {
        const embed = new RichEmbed()
          .setDescription(`This flip's result was ${flip}!\n\nTime taken: ${Math.round(this.client.ping)}ms\nCurrency: Euro (EUR)`)
          .setThumbnail("https://vgy.me/g4ispA.png");
        message.channel.send({embed});
      }
    }

    // US Dollars [$] (USD)
    if (settings.currency === "USD") {
      if (flip === "Heads") {
        const embed = new RichEmbed()
          .setDescription(`This flip's result was ${flip}!\n\nTime taken: ${Math.round(this.client.ping)}ms\nCurrency: US Dollars (USD)`)
          .setThumbnail("https://vgy.me/e08J8X.png");
        message.channel.send({embed});
      } else {
        const embed = new RichEmbed()
          .setDescription(`This flip's result was ${flip}!\n\nTime taken: ${Math.round(this.client.ping)}ms\nCurrency: US Dollars (USD)`)
          .setThumbnail("https://vgy.me/mYy2Fv.png");
        message.channel.send({embed});
      }
    }

    // Norwegian Krone [kr] (NOK)
    if (settings.currency === "NOK") {
      if (flip === "Heads") {
        const embed = new RichEmbed()
          .setDescription(`This flip's result was ${flip}!\n\nTime taken: ${Math.round(this.client.ping)}ms\nCurrency: Norwegian Kroner (NOK)`)
          .setThumbnail("https://vgy.me/NbbKna.png");
        message.channel.send({embed});
      } else {
        const embed = new RichEmbed()
          .setDescription(`This flip's result was ${flip}!\n\nTime taken: ${Math.round(this.client.ping)}ms\nCurrency: Norwegian Kroner (NOK)`)
          .setThumbnail("https://vgy.me/VbieZr.png");
        message.channel.send({embed});
      }
    }
  }
}

module.exports = Flip;
