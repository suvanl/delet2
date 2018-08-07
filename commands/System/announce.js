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
    if (!content) return message.channel.send(texts.cmd.system.noMessage);

    const id = await this.client.awaitReply(message, texts.cmd.system.idRequest, 30000);
    if (!message.guild.channels.find("id", id)) return message.channel.send("A channel with that ID does not exist on this server.");
    
    message.guild.channels.get(id).send(content)
      .then(message.react("✅"))
      .catch(error => {
        if (error.message === "Missing Access") return message.channel.send(`I do not have sufficient permissions to send messages in <#${id}>.`);
        this.client.logger.error(error);
      });
  }
}

module.exports = Announce;
