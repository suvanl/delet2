const Command = require("../../base/Command.js");
const { RichEmbed } = require("discord.js");
const fetch = require("node-fetch");

class Urban extends Command {
    constructor(client) {
      super(client, {
        name: "urban",
        description: "Searches the Urban Dictionary for the specified query.",
        category: "Fun",
        usage: "urban <query>",
        aliases: ["urbandictionary", "udictionary", "urban-dictionary"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        const query = args.join(" ");
        if (!query) return message.channel.send("You must provide a term to search for.");

        fetch(`http://api.urbandictionary.com/v0/define?term=${query}`)
            .then(res => res.json())
            .then(json => {
                const data = json.list[0];
                const definition = data.definition.replace(/[[\]]+/g, "");
                const example = data.example.replace(/[[\]]+/g, "");
                const embed = new RichEmbed()
                    .setColor(50687)
                    .setAuthor("Urban Dictionary", "https://vgy.me/ScvJzi.jpg")
                    .setDescription(`Displaying Urban Dictionary definition for "**${data.word}**"\n<${data.permalink}>`)
                    .addField("» Definition", `**${definition.substring(0, 1000)}...**`)
                    .addField("» Example", `${example.substring(0, 1000)}...`)
                    .setFooter(`Definition 1 of ${json.list.length}`)
                    .setTimestamp();
                return message.channel.send({ embed });
            })
            .catch(error => {
                this.client.logger.error(error);
                return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
            });
    }
}

module.exports = Urban;