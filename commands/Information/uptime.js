const Command = require("../../base/Command.js");
const { stripIndents } = require("common-tags");
const moment = require("moment");
require("moment-duration-format");

class Uptime extends Command {
    constructor(client) {
      super(client, {
        name: "uptime",
        description: "Displays delet's uptime.",
        category: "Information",
        usage: "uptime"
      });
    }

    async run(message, args, level, settings) { // eslint-disable-line no-unused-vars
        const uptime = moment.duration(this.client.uptime).format("D [days], H [hrs], m [mins], s [secs]");
        message.channel.send(stripIndents`
        • Uptime     :: ${uptime}
        For a full list of bot stats, use the \`${settings.prefix}stats\` command.`, { code: "asciidoc" });
    }
}

module.exports = Uptime;