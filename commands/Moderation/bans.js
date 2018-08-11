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

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send(texts.general.missingPerm.replace(/{{perm}}/g, "Ban Members"));
        message.guild.fetchBans()
            .then(bans => {
                // TODO: change to "user(s)" if multi-locale support is added
                message.channel.send(`This server has **${bans.size}** banned ${bans.size === 1 ? "user" : "users"}.`);
            })
            .catch(error => {
                this.client.logger.error(error);
                return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
            });
    }
}

module.exports = Bans;
