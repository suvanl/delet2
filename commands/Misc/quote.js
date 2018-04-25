const Command = require("../../base/Command.js");
const Discord = require("discord.js");

class Quote extends Command {
  constructor(client) {
    super(client, {
      name: "quote",
      description: "Quote.",
      usage: "quote",
      aliases: ["q"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const id = args[0];
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
