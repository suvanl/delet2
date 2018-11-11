const Command = require("../../base/Command.js");
const { stripIndents } = require("common-tags");

class Time extends Command {
    constructor(client) {
      super(client, {
        name: "time",
        description: "Returns the current time in a specified timezone.",
        category: "Information",
        usage: "time <continent>/<city>",
        aliases: ["timezone", "worldtime"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        const link = "https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List";
        const timeZone = args.join("_").toUpperCase();
        if (!timeZone) return message.channel.send(stripIndents`
        You must provide a timezone to look up the time for.
        For a full list of timezones, refer to the "TZ" column here: **<${link}>**.
        `);

        try {
            const time = new Date().toLocaleTimeString("en-GB", { timeZone, hour12: false });
            const friendly = timeZone.substring(timeZone.indexOf("/") + 1).replace(/_/g, " ");
            return message.channel.send(`The time in **${friendly.toProperCase()}** is currently **${time}**.`);
        } catch (err) {
            message.channel.send(stripIndents`
            ${texts.general.error.replace(/{{err}}/g, err.message)}
            For a full list of timezones, refer to the "TZ" column here: **<${link}>**.

            • Please ensure you are using the correct format, e.g. \`${settings.prefix}time europe/london\`.
            • Note that the continent of North America is split into **America** and **Canada**, e.g. \`${settings.prefix}time america/new york\`.
            `);
        }
    }
}

module.exports = Time;