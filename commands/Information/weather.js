const Command = require("../../base/Command.js");
const Discord = require("discord.js");
const weather = require("weather-js");

class Weather extends Command {
    constructor(client) {
      super(client, {
        name: "weather",
        description: "Displays weather information for the specified location.",
        category: "Information",
        usage: "weather [location]",
        aliases: [""]
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        const settings = message.guild ? this.client.getSettings(message.guild.id) : this.client.settings.get("default");

        weather.find({search: args.join(" "), degreeType: "C"}, function(err, result) {
            if (err) return message.channel.send(`An error occurred:\n\`\`\`${err}\`\`\`\nTo see how to use this command, type \`${settings.prefix}help weather\`.`);

            if (message.content.startsWith(`${settings.prefix}weather json`)) {
                return message.channel.send(`\`\`\`${JSON.stringify(result[0].current, null, 2)}\`\`\``);
            }

            const current = result[0].current;
            const location = result[0].location;

            const embed = new Discord.RichEmbed()
            .setColor(7654911)
            .setTitle(`Current weather information for ${current.observationpoint}`)
            .setDescription(`The weather is **${current.skytext.toLowerCase()}** at the moment.

• Temperature: **${current.temperature}°C**
• Feels like: **${current.feelslike}°C**
• Humidity: **${current.humidity}%**
• Wind: **${current.winddisplay.toLowerCase()}**
            `)
            .setThumbnail(current.imageUrl)
            .setFooter(`Correct as of ${current.observationtime} local time`)
            .setTimestamp();

            message.channel.send({embed});
        });
    }
}

module.exports = Weather;