const Command = require("../../base/Command.js");
const Discord = require("discord.js");
const moment = require("moment");

class UserInfo extends Command {
    constructor(client) {
      super(client, {
        name: "userinfo",
        description: "Displays information about the mentioned user.",
        category: "Information",
        usage: "userinfo [user]",
        aliases: ["uinfo", "user"]
      });
    }

    async run(message, args, level) {
      
        const user = message.mentions.users.first() || message.author;
        const roleColor = message.guild.member(user).highestRole.color || 15527148;

        let status;
        if (user.presence.status.toProperCase() === "Dnd") {
          status = "Do Not Disturb";
        } else {
          status = user.presence.status.toProperCase();
        }

        let activity;
        if (user.presence.game === "Spotify") {
          activity = "Listening to **Spotify**";
        } else {
          activity = `Playing **${user.presence.game ? user.presence.game.name : "Nothing"}**`;
        }
        return message.channel.send(activity);

        const embed = new Discord.RichEmbed()
        .setColor(roleColor)
        .setThumbnail(user.displayAvatarURL)
        .setTitle(`User Information for ${user.tag}`)
        .setDescription(`**User ID** ${user.id}`)

        .addField("❯ Details", `
• Status: **${status}**
• Activity: ${activity}
‍   
`, true)

        .addField("❯ Roles", `
• Highest: **${message.guild.member(user).highestRole.name}**
• All: ${message.guild.member(user).roles.map(roles => `\`${roles.name}\``).slice(1).join(" ")}
‍   
`, true)

        .addField("❯ Join Dates", `
• ${message.guild.name}: **${moment.utc(message.guild.member(user).joinedAt).format("dddd, MMMM Do YYYY @ HH:mm:ss")}**
• Discord: **${moment.utc(user.createdAt).format("dddd, Do MMMM YYYY @ HH:mm:ss")}**
`, true)

        .setFooter(`Info requested by ${message.author.tag} • All times are UTC`, `${message.author.displayAvatarURL}`)

        message.channel.send({embed});
    }
}

module.exports = UserInfo;