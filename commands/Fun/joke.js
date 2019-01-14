const Command = require("../../base/Command.js");
const snekfetch = require("snekfetch");
const { RichEmbed } = require("discord.js");

class Joke extends Command {
    constructor(client) {
      super(client, {
        name: "joke",
        description: "Tells a general or programming-related joke.",
        category: "Fun",
        usage: "joke",
        aliases: ["humour", "humor"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        const randomColor = "#0000".replace(/0/g, () => {
          return (~~(Math.random() * 16)).toString(16);
        });
        
        try {
          const { body } = await snekfetch.get("https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_joke");
          const embed = new RichEmbed()
            .setColor(randomColor)
            .setAuthor("Joke", "https://vgy.me/hLZJX4.png")
            .setDescription(`${body.setup}\n*${body.punchline}*`)
            .setFooter(`Category: ${body.type.toProperCase()}`);
          return message.channel.send({ embed });
        } catch (error) {
          this.client.logger.error(error);
          return message.channel.send(texts.general.error.replace(/{{err}}/g, error));
        }
    }
}

module.exports = Joke;
