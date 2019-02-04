const Command = require("../../base/Command.js");
const fetch = require("node-fetch");
const h = new (require("html-entities").AllHtmlEntities)();

class NASA extends Command {
  constructor(client) {
    super(client, {
      name: "nasa",
      description: "Searches NASA's image database.",
      usage: "nasa <image>",
      aliases: ["space"]
    });
  }

  async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
    let query = args.join(" ");
    if (!query) return message.channel.send("You must provide a query to search NASA's image database for.");
    else query = encodeURIComponent(args.join(" "));

    fetch(`https://images-api.nasa.gov/search?q=${query}&media_type=image`)
      .then(res => res.json())
      .then(body => {
        const images = body.collection.items;
        if (!images.length || images.length === 0) return message.channel.send("No results found.");

        const data = images.random();
        const description = h.decode(data.data[0].description);

        message.channel.send(description.length > 1997 ? description.substring(0, 1997) + "..." : description.substring(0, 2000) + " <:NASA:476079744857931796>", {
          file: data.links[0].href
        });
      })
      .catch(error => {
        this.client.logger.error(error);
        message.channel.send(texts.general.error.replace(/{{err}}/g, error));
      });
  }
}

module.exports = NASA;
