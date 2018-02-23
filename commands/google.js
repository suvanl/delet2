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

    async run(message, args, level) {
        let searchMessage = await message.channel.send("Searching Google...");
        let searchURL = `https://www.google.com/search?q=${encodeURIComponent(message.content)}`;

        return snekfetch.get(searchURL).then((result) => {

            let $ = cheerio.load(result.text);
            let googleData = $(".r").first().find("a").first().attr("href");

            googleData = querystring.parse(googleData.replace("/url?", ""));
            searchMessage.edit(`Result found!\n${googleData.q}`);

        }).catch((err) => {
            searchMessage.edit("No results found.");
        });
    }
}

module.exports = Google;