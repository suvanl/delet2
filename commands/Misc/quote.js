const Command = require("../../base/Command.js");
const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

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

  async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
    const id = args[0];
    if (!id) return message.channel.send(stripIndents`
    You must provide a message ID.
    To do so, you need to have developer mode turned on to obtain a message ID (Settings → Appearance → Developer Mode).
    Then, upon right-clicking a message, you'll be presented with an option called "Copy ID".`,
    { file: "https://vgy.me/cQbRf7.png "});
    
    message.channel.fetchMessage(id)
      .then(message => {
        const embed = new RichEmbed()
          .setColor(message.guild.member(message.author).displayColor)
          .setAuthor(message.author.tag, message.author.displayAvatarURL)
          .setDescription(message.content)
          .setFooter(`#${message.channel.name}`)
          .setTimestamp();
        message.channel.send({embed});
      }).catch(error => {
        this.client.logger.error(error);
        message.channel.send(texts.general.error.replace(/{{err}}/g, error));
      });
  }
}

module.exports = Quote;
