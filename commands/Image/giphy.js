const Command = require("../../base/Command.js");
const fetch = require("node-fetch");
const { URLSearchParams } = require("url");
const { GIPHY_API_KEY } = process.env;

class Giphy extends Command {
    constructor(client) {
      super(client, {
        name: "giphy",
        description: "Returns a GIF from Giphy based on your query.",
        category: "Image",
        usage: "giphy <query>",
        aliases: ["gif"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        const query = args[0];
        if (!query) return message.channel.send("You must provide a query to return a GIF for.");
        
        const url = "http://api.giphy.com/v1/gifs/search?";
        const params = new URLSearchParams({
            q: query,
            api_key: GIPHY_API_KEY,
            rating: "pg"
        });
        
        fetch(url + params)
            .then(res => res.json())
            .then(json => message.channel.send(json.data.random().images.original.url))
            .catch(error => {
                this.client.logger.error(error);
                return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
            });
    }
}

module.exports = Giphy;
