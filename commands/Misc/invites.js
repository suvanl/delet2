const Command = require("../../base/Command.js");
const { RichEmbed } = require("discord.js");
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
        let invites = await message.guild.fetchInvites();
        if (invites.size === 0) return message.channel.send(texts.cmd.misc.noInvites);
        invites = invites.array();

        arraySort(invites, "uses", { reverse: true });

        const usedInvites = [["User", "Uses"]];
        invites.forEach(function(invite) {
            usedInvites.push([invite.inviter.tag, invite.uses]);
        });

        const embed = new RichEmbed()
            .setColor(5234401)
            .setTitle("Server Invite Leaderboard")
            .setDescription(`for **${message.guild.name}**\n\`\`\`${t.table(usedInvites)}\`\`\``)
            .setTimestamp();
        
        message.channel.send({ embed });
    }
}

module.exports = Invites;