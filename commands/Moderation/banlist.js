const Command = require("../../base/Command.js");
const { stripIndents } = require("common-tags");

class BanList extends Command {
    constructor(client) {
      super(client, {
        name: "banlist",
        description: "DMs you a list of banned users.",
        category: "Moderation",
        usage: "banlist",
        guildOnly: true,
        aliases: ["bl"],
        permLevel: "Moderator"
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send(texts.general.missingPerm.replace(/{{perm}}/g, "Ban Members"));

        message.guild.fetchBans()
          .then(bans => {
            const obj = bans.map(b => ({
              user: `${b.username}#${b.discriminator}`
            }));
            const bList = Array.from(obj);
            if (bList.length < 1) return message.author.send(`There are no banned users on **${message.guild.name}**.`);
            let index = 0;

            message.author.send(stripIndents`
            __**Ban List for ${message.guild.name}**__

            ${bList.map(bl => `**${++index} -** ${bl.user}`).join("\n")}
            `);

            message.react("👌");
          });
    }
}

module.exports = BanList;