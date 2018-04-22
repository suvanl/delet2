// The EVENT command will emit an event. This is useful, but should only
// be used for debugging purposes.

const Command = require("../../base/Command.js");

class Event extends Command {
    constructor(client) {
      super(client, {
        name: "event",
        description: "Emits an event.",
        category: "Debug",
        usage: "event",
        aliases: ["emit"],
        permLevel: "Bot Owner"
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        const member = message.mentions.members.first() || message.member;

        await this.client.emit("guildMemberAdd", member);
        await this.client.emit("guildMemberRemove", member);
    }
}

module.exports = Event;