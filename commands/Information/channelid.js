const Command = require("../../base/Command.js");

class ChannelID extends Command {
    constructor(client) {
      super(client, {
        name: "channelid",
        description: "Returns the ID of the current channel.",
        category: "Information",
        usage: "channelid",
        aliases: ["channel-id", "cid"]
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
      let channelID;
      
      if (!args[0]) channelID = message.channel.id;
      else channelID = this.client.channels.get(args[0].id);

      message.channel.send(channelID);
    }
}

module.exports = ChannelID;