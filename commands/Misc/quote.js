const Command = require("../../base/Command.js");
const Discord = require("discord.js");

class Quote extends Command {
  constructor(client) {
    super(client, {
      name: "quote",
      description: "Quotes the specified message (by ID).",
      usage: "quote [message ID]",
      aliases: ["q"],
      guildOnly: true
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const id = args[0];
    if (!id) return message.channel.send("You must provide a message ID.\nYou must have developer mode turned on to obtain a message ID (Settings → Appearance → Developer Mode).", { file: "https://vgy.me/cQbRf7.png "});
    message.channel.fetchMessage(id)
      .then(message => {
        const roleColor = message.guild.member(message.author).highestRole.color || 15527148;
        const embed = new Discord.RichEmbed()
          .setColor(roleColor)
          .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL)
          .setDescription(message.content)
          .setFooter(`#${message.channel.name}`)
          .setTimestamp();
        message.channel.send({embed});
      }).catch(error => {
        this.client.logger.error(error.stack);
        message.channel.send(`An error occured:\n\`\`\`${error.message}\`\`\``);
      });
  }
}

module.exports = Quote;
