const Command = require("../../base/Command.js");
const fetch = require("node-fetch");
const { RichEmbed } = require("discord.js");
const { UNSPLASH_ACCESS_KEY } = process.env;

class Snake extends Command {
    constructor(client) {
      super(client, {
        name: "snake",
        description: "Sends a random image of a snake.",
        category: "Image",
        usage: "snake",
        aliases: ["snek"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        const page = Math.floor(Math.random() * 5) + 1;
        const index = Math.floor(Math.random() * 10) + 1;

        const randomColor = "#0000".replace(/0/g, () => {
          return (~~(Math.random() * 16)).toString(16);
        });

        const meta = { "Authorization": `Client-ID ${UNSPLASH_ACCESS_KEY}` };

        message.channel.startTyping();

        fetch(`https://api.unsplash.com/search/photos?page=${page}&query=snake`, { headers: meta })
          .then(res => res.json())
          .then(json => {
            const data = json.results[parseInt(index.toFixed(0))];
            const embed = new RichEmbed()
              .setTitle("🐍 Snake")
              .setURL(data.urls.raw)
              .setDescription(`Photo by [${data.user.name}](${data.user.links.html}) on [Unsplash](https://unsplash.com)`)
              .setImage(data.urls.raw)
              .setColor(randomColor)
              .setTimestamp();
            message.channel.send({ embed });
          })
          .catch(error => {
            message.channel.stopTyping(true);
            if (error.message === "Cannot read property 'urls' of undefined") return message.channel.send(texts.general.noResultsFound);
            this.client.logger.error(error);
            return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
          });

        message.channel.stopTyping(true);
    }
}

module.exports = Snake;
