const Command = require("../../base/Command.js");
const Discord = require("discord.js");
const request = require("request");

class Urban extends Command {
    constructor(client) {
      super(client, {
        name: "urban",
        description: "Searches the Urban Dictionary for the specified query.",
        category: "Fun",
        usage: "urban [query]",
        aliases: ["urbandictionary", "udictionary"]
      });
    }

    async run(message, args, level, resultNum) { // eslint-disable-line no-unused-vars
        const baseURL = "http://api.urbandictionary.com/v0/define?term=";
        const URL = baseURL + args;

        request({
            url: URL,
            json: true,
        }, (error, response, body) => {
            if (!resultNum) {
                resultNum = 0;
            } else if (resultNum > 1) {
                resultNum -= 1;
            }

            const result = body.list[resultNum];
            if (result) {
                try {
                    const embed = new Discord.RichEmbed()
                    .setColor(50687)
                    .setAuthor("Urban Dictionary", "https://i.imgur.com/ONrIClq.jpg")
                    .setDescription(`Displaying Urban Dictionary definition for "**${args}**"\n<${result.permalink}>`)
                    .addField("» Definition", `${resultNum += 1} out of ${body.list.length}\n**${result.definition}**`)
                    .addField("» Example", `${result.example}`)
                    .setFooter(`Definition requested by ${message.author.tag}`, `${message.author.avatarURL}`);

                message.channel.send({embed});
                } catch (err) {
                    this.client.logger.error(err);
                    message.channel.send(`An error occurred:\n${err.message}`);
                }
            } else {
                message.channel.send("No entry found.");
            }
        });
    }
}

module.exports = Urban;