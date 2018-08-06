const Command = require("../../base/Command.js");
const { get } = require("snekfetch");

class Logo extends Command {
    constructor(client) {
      super(client, {
        name: "logo",
        description: "Sends a website's logo.",
        category: "Information",
        usage: "logo [url]"
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        const query = args[0];
        if (!query) return message.channel.send(texts.general.invalidURL);

        try {
            const { raw } = await get(`https://logo.clearbit.com/${query.startsWith("<") ? query.replace(/<(.+)>/g, "$1") : query}?size=500`);
            message.channel.send("", { files: [{ attachment: raw, name: "logo.jpg" }] });
        } catch (error) {
            if (error.message === "400 Bad Request") return message.channel.send("You must provide a URL for me to return a logo for.");
            if (error.message === "404 Not Found") return message.channel.send(texts.general.noResultsFound);
            this.client.logger.error(error);
            return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
        }
    }
}

module.exports = Logo;
