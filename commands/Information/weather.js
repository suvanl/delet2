const Command = require("../../base/Command.js");
const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const weather = require("weather-js");

class Weather extends Command {
    constructor(client) {
      super(client, {
        name: "weather",
        description: "Displays weather information for the specified location.",
        category: "Information",
        usage: "weather [location]"
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        weather.find({ search: args.join(" "), degreeType: "C" }, function(err, result) {
            if (err === "missing search input") return message.channel.send(`You must provide a place to look up weather information for.\nTo see how to use this command, use \`${settings.prefix}help weather\`.`); 
            if (err) return message.channel.send(`${texts.general.error.replace(/{{err}}/g, err.message)}\nTo see how to use this command, use \`${settings.prefix}help weather\`.`);

            if (message.content.startsWith(`${settings.prefix}weather json`)) {
                if (!args[1]) return message.channel.send("You must provide a place to look up weather information for.");
                return message.channel.send(`${JSON.stringify(result[0].current, null, 2)}`, { code: "json" });
            }

            const current = result[0].current;
            const location = result[0].location; // eslint-disable-line no-unused-vars
            const ct = current.temperature;

            let col;
            
            if (ct <= 0) col = 13431807;
            else if (ct < 0 && ct >= 5) col = 12579071;
            else if (ct >= 6 && ct <= 10) col = 11861906;
            else if (ct >= 11 && ct <= 15) col = 9238900;
            else if (ct >= 16 && ct <= 20) col = 15531898;
            else if (ct >= 21 && ct <= 25) col = 16763258;
            else if (ct >= 26 && ct <= 30) col = 16739910;
            else if (ct >= 31 && ct <= 35) col = 16730914;
            else if (ct >= 36 && ct <= 40) col = 16727074;
            else if (ct >= 40) col = 12386304;
            else col = 7654911; // fallback

            const embed = new RichEmbed()
            .setColor(col)
            .setTitle(`Weather information for ${current.observationpoint}`)
            .setDescription(stripIndents`
            The weather is **${current.skytext.toLowerCase()}** at the moment.

            • Temperature: **${ct}°C**
            • Feels like: **${current.feelslike}°C**
            • Humidity: **${current.humidity}%**
            • Wind: **${current.winddisplay.toLowerCase()}** (${current.winddisplay.toLowerCase().replace(/[^0-9]/g,"") * 0.621371} mph)
            `)
            .setThumbnail(current.imageUrl)
            .setFooter(`Correct as of ${current.observationtime.slice(0, -3)} local time`)
            .setTimestamp();

            message.channel.send({embed});
        });
    }
}

module.exports = Weather;