const Command = require("../../base/Command.js");
const texts = require("../../util/globals.js");

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
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send(`${texts.missingPerm.replace(/{{perm}}/g, "Ban Members")}`);
        try {
            message.guild.fetchBans()
                .then(bans => {
                    let plurality;
                    if (bans.size === 1) plurality = "user";
                    else plurality = "users";

                    message.channel.send(`This server has **${bans.size}** banned ${plurality}.`);
                });
        } catch (error) {
            this.client.logger.error(error);
            return message.channel.send(`${texts.error}\`\`\`${error.message}\`\`\``);
        }
    }
}

module.exports = Bans;