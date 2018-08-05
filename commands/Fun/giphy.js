const Command = require("../../base/Command.js");
const snekfetch = require("snekfetch");
const { GIPHY_API_KEY } = process.env;

class Giphy extends Command {
    constructor(client) {
      super(client, {
        name: "giphy",
        description: "Returns a GIF from Giphy based on your query.",
        category: "Fun",
        usage: "giphy [query]",
        aliases: ["gif"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        const query = args[0];
        if (!query) return message.channel.send("You must provide a query to return a GIF for.");

        try {
            const { body } = await snekfetch
                .get("http://api.giphy.com/v1/gifs/search")
                .query({
                    q: query,
                    api_key: GIPHY_API_KEY,
                    rating: "pg"
                });
            if (!body.data.length) return message.channel.send("No GIFs found.");
            return message.channel.send(body.data.random().images.original.url);
        } catch (error) {
            this.client.logger.error(error);
            return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
        }
    }
}

module.exports = Giphy;
