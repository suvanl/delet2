const Command = require("../../base/Command.js");
const { RichEmbed } = require("discord.js");
const { get } = require("snekfetch");

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

        try {
            const { body } = await get(`http://api.urbandictionary.com/v0/define?term=${query}`);
            const data = body.list[0];

            const embed = new RichEmbed()
                .setColor(50687)
                .setAuthor("Urban Dictionary", "https://vgy.me/ScvJzi.jpg")
                .setDescription(`Displaying Urban Dictionary definition for "**${data.word}**"\n<${data.permalink}>`)
                .addField("» Definition", `**${data.definition.replace(/[[\]]+/g, "")}**`) // this regex removes square brackets from definitions
                .addField("» Example", data.example.replace(/[[\]]+/g, ""))
                .setFooter(`Definition 1 of ${body.list.length}`)
                .setTimestamp();

            message.channel.send({ embed });
        } catch (error) {
            this.client.logger.error(error);
            return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
        }
    }
}

module.exports = Urban;