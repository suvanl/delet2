const Command = require("../../base/Command.js");
const { RichEmbed } = require("discord.js");
const request = require("request");

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

    async run(message, args, level, settings, texts, resultNum) { // eslint-disable-line no-unused-vars
        if (!args[0]) return message.channel.send("You must provide a term to search for.");

        const baseURL = "http://api.urbandictionary.com/v0/define?term=";
        const URL = baseURL + args;

        request({
            url: URL,
            json: true
        }, (error, response, body) => {
            if (!resultNum) {
                resultNum = 0;
            } else if (resultNum > 1) {
                resultNum -= 1;
            }

            const result = body.list[resultNum];
            if (result) {
                try {
                    const embed = new RichEmbed()
                    .setColor(50687)
                    .setAuthor("Urban Dictionary", "https://vgy.me/ScvJzi.jpg")
                    .setDescription(`Displaying Urban Dictionary definition for "**${args.join(" ")}**"\n<${result.permalink}>`)
                    .addField("» Definition", `${resultNum += 1} out of ${body.list.length}\n**${result.definition}**`)
                    .addField("» Example", `${result.example}`)
                    .setFooter(`Definition requested by ${message.author.tag}`, `${message.author.avatarURL}`);

                message.channel.send({ embed });
                } catch (err) {
                    this.client.logger.error(err);
                    return message.channel.send(texts.general.error.replace(/{{err}}/g, err.message));
                }
            } else {
                message.channel.send(texts.general.noResultsFound);
            }
        });
    }
}

module.exports = Urban;