const Command = require("../base/Command.js");
const Discord = require("discord.js");

class Flip extends Command {
  constructor(client) {
    super(client, {
      name: "flip",
      description: "Flips/tosses a coin",
      category: "Fun",
      usage: "flip",
      aliases: ["toss"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const settings = message.guild ? this.client.getSettings(message.guild.id) : this.client.settings.get("default");

    // No currency set
    if (settings.currency === ">>No currency set<<") return message.channel.send(`
I cannot run this command, as I don't know which currency to use on this server. Please set a currency by using:
\`\`\`${settings.prefix}set edit currency TYPE\`\`\`
Currently available types: \`GBP\`, \`EUR\``);

    function coinFlip() {
      return (Math.floor(Math.random() * 2) == 0) ? 'Heads' : 'Tails';
    }

    let variable = coinFlip();
    // console.log(variable);

    // Pounds [£] (GBP)
    if (settings.currency === "GBP") {

    if (variable === 'Heads') {
      const embed = new Discord.RichEmbed()
      .setDescription(`This flip's result was **heads**!\n\nTime taken: ${Math.round(this.client.ping)}ms\nCurrency: Pound Sterling (GBP)`)
      .setThumbnail("https://vgy.me/yvnN22.png")
      message.channel.send({embed});
    } else {
      const embed = new Discord.RichEmbed()
      .setDescription(`This flip's result was **tails**!\n\nTime taken: ${Math.round(this.client.ping)}ms\nCurrency: Pound Sterling (GBP)`)
      .setThumbnail("https://vgy.me/PfWWql.png")
      message.channel.send({embed});
    }
  }

  // Euros [€] (EUR)
  if (settings.currency === "EUR") {
    if (variable === 'Heads') {
      const embed = new Discord.RichEmbed()
      .setDescription(`This flip's result was **heads**!\n\nTime taken: ${Math.round(this.client.ping)}ms\nCurrency: Euro (EUR)`)
      .setThumbnail("https://vgy.me/QgVomc.png")
      message.channel.send({embed});
    } else {
      const embed = new Discord.RichEmbed()
      .setDescription(`This flip's result was **tails**!\n\nTime taken: ${Math.round(this.client.ping)}ms\nCurrency: Euro (EUR)`)
      .setThumbnail("https://vgy.me/g4ispA.png")
      message.channel.send({embed});
    }
  }

  }
}

module.exports = Flip;
