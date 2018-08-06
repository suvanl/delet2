const Command = require("../../base/Command.js");

class UserID extends Command {
    constructor(client) {
      super(client, {
        name: "userid",
        description: "Returns the mentioned user's user ID.",
        category: "Information",
        usage: "userid [@user]",
        aliases: ["id"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        const user = message.mentions.users.first() || message.author;

        message.channel.send(`**${user.tag}**'s user ID is: \`${user.id}\`.`)
            .catch((e) => {
                this.client.logger.error(e.stack);
                return message.channel.send(texts.general.error.replace(/{{err}}/g, e.message));
            });
    }
}

module.exports = UserID;