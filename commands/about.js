const Command = require("../base/Command.js");
const Discord = require("discord.js");
const moment = require("moment");

class About extends Command {
    constructor(client) {
      super(client, {
        name: "about",
        description: "Displays information about me!",
        category: "Information",
        usage: "about",
        aliases: ["info"]
      });
    }

    async run(message, args, level) {
        // RichEmbed Builder
        const embed = new Discord.RichEmbed()
        .setTitle("Hey, I'm delet")
        /*
        * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
        */
        .setColor("#669F64")
        .setDescription("I'm a multipurpose Discord bot developed and maintained by the DS Development Group.")
        .setFooter("Made with Discord.js", "https://nodejs.org/static/images/logos/nodejs-new-pantone-white.png")
        .setThumbnail("https://cdn.discordapp.com/avatars/314444116677099541/e167b59e4fb7dd0b3fc68db1fe0fc88d.webp?size=1024")
        /*
        * Takes a Date object, defaults to current date.
        */
        .setTimestamp()
        .addField("GitHub Repository", "https://github.com/DS-Development/delet-2.0", true)
        /*
        * Inline fields may not display as inline if the thumbnail and/or image is too big.
        */
        .addField("Servers", `${this.client.guilds.size}`, true)
        /*
        * Blank field, useful to create some space.
        */
        //.addBlankField(true)
        .addField("Users", `${this.client.users.size}`, true)
        .addField("Invite link", "[Click here](http://bit.ly/add-delet)", true)
        .addField("Uptime", `${moment.utc(this.client.uptime).format("DD")-1} day(s), ${moment.utc(this.client.uptime).format("HH:mm:ss")}`, true)
        .addField("Node.js version", `${process.version}`, true)
        .addField("Memory usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
        message.channel.send({embed});
    }
}

module.exports = About;