const Command = require("../../base/Command.js");
const { stripIndents } = require("common-tags");

class Time extends Command {
    constructor(client) {
      super(client, {
        name: "time",
        description: "Returns the current time in a specified timezone.",
        category: "Information",
        usage: "time [<continent>/<city>]",
        aliases: ["timezone", "worldtime"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        const timeZone = args.join("_").toUpperCase();
        try {
            const time = new Date().toLocaleTimeString("en-GB", { timeZone });
            return message.channel.send(`The time in **${timeZone}** is currently **${time}**.`);
        } catch (err) {
            message.channel.send(stripIndents`
            ${texts.general.error.replace(/{{err}}/g, err.message)}
            For a full list of timezones, refer to the "TZ" column here: **<https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List>**.

            • Please ensure you are using the correct format, e.g. \`${settings.prefix}time europe/london\`.
            • Note that the continent of North America is split into \`America\` and \`Canada\`.
            `);
        }
    }
}

module.exports = Time;