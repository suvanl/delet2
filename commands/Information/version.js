const Command = require("../../base/Command.js");
const moment = require("moment");
const snekfetch = require("snekfetch");
const { version } = require("../../package.json");

class Version extends Command {
    constructor(client) {
      super(client, {
        name: "version",
        description: "Returns delet's version.",
        category: "Information",
        usage: "version",
        aliases: ["ver"]
      });
    }

    async run(message, args, level, settings) { // eslint-disable-line no-unused-vars
        try {
            var { body } = await snekfetch.get("https://api.github.com/repos/DS-Development/delet");
        } catch (error) {
            this.client.logger.error(error);
            body = "[Error occurred whilst fetching date]";
        }
        
        message.channel.send(`**Version:** ${version}\n**Last updated:** ${moment.utc(body.updated_at).format("dddd MMMM YYYY @ HH:mm:ss") + " UTC" || body}`);
    }
}

module.exports = Version;