const Command = require("../../base/Command.js");

class Announce extends Command {
  constructor(client) {
    super(client, {
      name: "announce",
      description: "Sends a specified message to a specified channel.",
      category: "System",
      usage: "announce [message]",
      aliases: ["send"],
      permLevel: "Server Owner",
      guildOnly: true
    });
  }

  async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
    const content = args.join(" ");
    if (!content) return message.channel.send(texts.cmd.noMessage);
    const id = await this.client.awaitReply(message, texts.cmd.idRequest, 30000);
    
    message.guild.channels.get(id).send(content);
    message.react("✅");
  }
}

module.exports = Announce;
