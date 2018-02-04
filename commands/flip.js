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

  async run(message, args, level) {
    function coinFlip() {
      return (Math.floor(Math.random() * 2) == 0) ? 'Heads' : 'Tails';
    }

    let variable = coinFlip();
    console.log(variable);

    if(variable === 'Heads') {
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
}

module.exports = Flip;
