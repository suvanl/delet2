const Command = require("../../base/Command.js");

class Announce extends Command {
  constructor(client) {
    super(client, {
      name: "announce",
      description: "Sends a specified message to a specified channel.",
      usage: "announce <message>",
      aliases: ["send"],
      permLevel: "Server Owner",
      guildOnly: true
    });
  }

  async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
    const content = args.join(" ");
    if (!content) return message.channel.send(texts.cmd.system.noMessage);

    const param = await this.client.awaitReply(message, texts.cmd.system.idAndNameRequest, 30000);
    let channel = message.guild.channels.find(channel => channel.id === param);
    if (!channel) channel = message.guild.channels.find(channel => channel.name === param);
    channel.send(content)
      .then(message.react("✅"))
      .catch(error => {
        if (error.message === "Missing Access") return message.channel.send(`I do not have sufficient permissions to send messages in <#${channel.id}>.`);
        this.client.logger.error(error);
      });
  }
}

module.exports = Announce;
