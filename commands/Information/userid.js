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

    async run(message, args, level, settings) { // eslint-disable-line no-unused-vars
        const texts = require(`../../locales/${settings.language}`);

        const user = message.mentions.users.first();
        if (!user) return message.channel.send("You must mention a user to return an ID for.");

        message.channel.send(`${user.tag}'s user ID is: \`${user.id}\`.`)
            .catch((e) => {
                this.client.logger.error(e.stack);
                return message.channel.send(texts.error.replace(/{{err}}/g, e.message));
            });
    }
}

module.exports = UserID;