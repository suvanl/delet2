const Command = require("../../base/Command.js");

class Bans extends Command {
    constructor(client) {
      super(client, {
        name: "bans",
        description: "Checks how many users are banned on the current server.",
        category: "Moderation",
        usage: "bans",
        guildOnly: true,
        aliases: ["fetchbans"],
        permLevel: "Moderator"
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        try {
            message.guild.fetchBans()
                .then(bans => message.channel.send(`This server has **${bans.size}** banned user(s).`));
        } catch (error) {
            this.client.logger.error(error.stack);
            message.channel.send(`An error occurred:\n\`\`\`${error.message}\`\`\``);
        }
    }
}

module.exports = Bans;