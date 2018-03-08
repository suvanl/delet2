const Command = require("../base/Command.js");
const snekfetch = require("snekfetch");
const cheerio = require("cheerio");
const querystring = require("querystring");

class Google extends Command {
    constructor(client) {
      super(client, {
        name: "google",
        description: "Searches Google for your query.",
        usage: "google [query]",
        aliases: ["search"]
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        const searchMessage = await message.channel.send("Searching Google...");
        const searchURL = `https://www.google.com/search?q=${encodeURIComponent(message.content)}`;

        return snekfetch.get(searchURL).then((result) => {

            const $ = cheerio.load(result.text);
            let googleData = $(".r").first().find("a").first().attr("href");

            googleData = querystring.parse(googleData.replace("/url?", ""));
            searchMessage.edit(`Result found!\n${googleData.q}`);

        }).catch((err) => {
            searchMessage.edit(`No results found; an error occurred.\n\`\`\`${err}\`\`\``);
        });
    }
}

module.exports = Google;