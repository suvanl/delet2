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
      message.channel.send(`${message.channel}'s ID is \`${message.channel.id}\`.`);
    }
}

module.exports = ChannelID;