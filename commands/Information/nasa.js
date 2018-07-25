const Command = require("../../base/Command.js");
const snekfetch = require("snekfetch");
const { RichEmbed } = require("discord.js");

class NASA extends Command {
  constructor(client) {
    super(client, {
      name: "nasa",
      description: "Searches NASA's image database.",
      usage: "nasa [image]",
      aliases: ["space"]
    });
  }

  async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
    const query = args[0];
    try {
      const { body } = await snekfetch
        .get("https://images-api.nasa.gov/search")
        .query({
          q: query,
          media_type: "image"
        });
      
      const images = body.collection.items;
      if (!images.length || images.length === 0) return message.channel.send("No results found.");

      const data = images.random();
      const description = data.data[0].description;

      const embed = new RichEmbed()
        .setAuthor("NASA", "https://vgy.me/44d5fk.png")
        .setDescription(description.length > 200 ? description.substring(0, 200) + "..." : description.substring(0, 200))
        .setImage(data.links[0].href) // TODO: fix images not actually displaying within the embed
        .setTimestamp();
      return message.channel.send({ embed });
    } catch (error) {
      this.client.logger.error(error);
      message.channel.send(texts.general.error.replace(/{{err}}/g, error));
    }
  }
}

module.exports = NASA;
