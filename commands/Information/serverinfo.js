const Command = require("../../base/Command.js");
const { RichEmbed } = require("discord.js");
const moment = require("moment");

const verificationLevels = {
    0: "None",
    1: "Low",
    2: "Medium",
    3: "(╯°□°）╯︵ ┻━┻",
    4: "┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻"
};

const contentFilterLevels = {
    0: "None",
    1: "Scan messages from members without a role",
    2: "Scan messages sent by all members"
};

class ServerInfo extends Command {
    constructor(client) {
      super(client, {
        name: "serverinfo",
        description: "Displays information about the current server.",
        category: "Information",
        usage: "serverinfo",
        aliases: ["sinfo", "server", "guildinfo", "guild"],
        guildOnly: true
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        const randomColor = "#0000".replace(/0/g, function() {
            return (~~(Math.random() * 16)).toString(16);
        });

        const createdTimestamp = moment.utc(message.guild.createdAt).format("YYYYMMDD");

        const embed = new RichEmbed()
        .setColor(randomColor)
        .setThumbnail(message.guild.iconURL)
        .setTitle(`Server Information for ${message.guild.name}`)
        .setDescription(`**Server ID:** ${message.guild.id}`)

        .addField("❯ Details",`
• Created: **${moment.utc(message.guild.createdAt).format("dddd, Do MMMM YYYY @ HH:mm:ss")}** (${moment(createdTimestamp, "YYYYMMDD").fromNow()})
• Owner: **${message.guild.owner.user.tag}**
• Region: **${message.guild.region.toProperCase()}**
• Verification: **${verificationLevels[message.guild.verificationLevel]}**
‍   
        `, true)

        .addField("❯ Users", `
• Users: **${message.guild.memberCount - message.guild.members.filter(m => m.user.bot).size}**
• Bots: **${message.guild.members.filter(m => m.user.bot).size}**

        `, true)

        .addField("❯ Roles", `
• Default: **${message.guild.defaultRole.name}**
• Count: **${message.guild.roles.size} roles**
        `, true)

        .addField("❯ Channels", `
• Text: **${message.guild.channels.filter(ch => ch.type === "text").size}**
• Voice: **${message.guild.channels.filter(ch => ch.type === "voice").size}**
• AFK: **${message.guild.afkChannel.name}**
        `, true)

        .addField("❯ Other", `
• AFK: After **${message.guild.afkTimeout / 60} min**
• Large? **${message.guild.large.toString().toProperCase()}**
• Content filter level: **${contentFilterLevels[message.guild.explicitContentFilter]}**
        
        `, true)

        .setFooter(`Info requested by ${message.author.tag} • All times are UTC`, message.author.displayAvatarURL);
        
        message.channel.send({embed});
    }
}

module.exports = ServerInfo;