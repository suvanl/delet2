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

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        const user = message.mentions.users.first();
        if (!user) return message.channel.send("You must specify a user to return an ID for.");

        message.channel.send(`${user.tag}'s user ID is: \`${user.id}\`.`)
            .catch((e) => {
                this.client.logger.error(e.stack);
                message.channel.send(`An error occurred:\n\`\`\`${e.message}\`\`\``);
            });
    }
}

module.exports = UserID;