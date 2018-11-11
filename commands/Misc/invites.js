const Command = require("../../base/Command.js");
const arraySort = require("array-sort");
const t = require("table");

class Invites extends Command {
    constructor(client) {
      super(client, {
        name: "invites",
        description: "Displays the server's invite leaderboard.",
        usage: "invites",
        guildOnly: true
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        if (!message.guild.me.hasPermission("MANAGE_GUILD")) return message.channel.send(texts.general.missingPerm.replace(/{{perm}}/g, "Manage Server"));
        
        let invites = await message.guild.fetchInvites();
        if (invites.size === 0) return message.channel.send(texts.cmd.misc.noInvites);
        invites = invites.array();

        arraySort(invites, "uses", { reverse: true });

        const usedInvites = [["User", "Uses"]];
        invites.forEach(invite => usedInvites.push([invite.inviter.tag, invite.uses]));

        return message.channel.send(`**Server Invite Leaderboard** for ${message.guild.name}\n\`\`\`${t.table(usedInvites)}\`\`\``);
    }
}

module.exports = Invites;