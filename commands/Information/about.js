const Command = require("../../base/Command.js");
const { version } = require("../../package.json");
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

    async run(message, args, level) { // eslint-disable-line no-unused-vars
      try {
        const embed = new Discord.RichEmbed()
        .setTitle(`Hey ${message.author.username}, I'm delet!`)
        .setColor("#669F64")
        .setDescription("I'm a multipurpose Discord bot developed and maintained by the DS Development Group.")
        .setFooter(`Made with Discord.js (v${Discord.version})`, "https://nodejs.org/static/images/logos/nodejs-new-pantone-white.png")
        .setThumbnail(this.client.user.displayAvatarURL)
        .setTimestamp()
        .addField("Version", `${version}`, true)
        .addField("Website", "https://delet.js.org", true)
        .addField("Users", `${this.client.users.size}`, true)
        .addField("Invite link", "[Click here](https://discordapp.com/oauth2/authorize?client_id=314444116677099541&permissions=305528022&scope=bot)", true)
        .addField("Uptime", `${moment.utc(this.client.uptime).format("DD")-1} day(s), ${moment.utc(this.client.uptime).format("HH:mm:ss")}`, true)
        .addField("GitHub", "[Click here](https://github.com/DS-Development/delet)", true)
        .addField("Node.js version", `${process.version}`, true)
        .addField("Memory usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true);

        message.channel.send({embed});
      } catch (error) {
        this.client.logger.error(error.stack);
        message.channel.send(`An error occurred:\`\`\`${error.message}\`\`\``);
      }
    }
}

module.exports = About;