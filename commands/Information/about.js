const Command = require("../../base/Command.js");
const delet = require("../../package.json");
const { RichEmbed, version } = require("discord.js");
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

    async run(message, args, level, texts) {
      let displayColor;
      if (message.channel.type === "text") displayColor = message.guild.me.displayColor;
      else if (message.channel.type === "dm" || message.channel.type === "group") {
        displayColor = "#0000".replace(/0/g, function() {
          return (~~(Math.random() * 16)).toString(16);
        });
      }
      
      try {
        const embed = new RichEmbed()
        .setColor(displayColor)
        .setThumbnail(this.client.user.displayAvatarURL)
        .setTitle(`Hey ${message.author.username}, I'm delet!`)
        .setDescription("I'm a multipurpose Discord bot developed and maintained by the DS Development Group.")
        .addField("Version", `${delet.version}`, true)
        .addField("Website", "https://delet.js.org", true)
        .addField("Users", `${this.client.users.size}`, true)
        .addField("Invite link", "[Click here](https://delet.js.org/go/invite)", true)
        .addField("Uptime", `${moment.utc(this.client.uptime).format("DD")-1} day(s), ${moment.utc(this.client.uptime).format("HH:mm:ss")}`, true)
        .addField("GitHub", "[Click here](https://github.com/DS-Development/delet)", true)
        .addField("Node.js version", `${process.version}`, true)
        .addField("Memory usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
        .setFooter(`Made with Discord.js (v${version})`, "https://vgy.me/ZlOMAx.png")
        .setTimestamp();

        message.channel.send({embed});
      } catch (error) {
        this.client.logger.error(error);
        return message.channel.send(texts.error.replace(/{{err}}/g, error.message));
      }
    }
}

module.exports = About;