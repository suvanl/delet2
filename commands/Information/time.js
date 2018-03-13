const Command = require("../../base/Command.js");
const Discord = require("discord.js");

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

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        const settings = message.guild ? this.client.getSettings(message.guild.id) : this.client.settings.get("default");
        const timeZone = args.join("_").toUpperCase();

        try {
            const time = new Date().toLocaleTimeString("en-GB", { timeZone });
            return message.channel.send(`The time in **${timeZone}** is currently **${time}**.`);
        } catch (err) {
            message.channel.send(`
An error occurred:\n\`\`\`${err.message}\`\`\`
For a full list of timezones, refer to the "TZ" column here: **<https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List>**.

• Please ensure you are using the correct format, e.g. \`${settings.prefix}time europe/london\`.
• Note that the continent of North America is split into \`America\` and \`Canada\`.
            `);
        }
    }
}

module.exports = Time;