const Command = require("../base/Command.js");
const Discord = require("discord.js");

class PermMute extends Command {
  constructor(client) {
    super(client, {
      name: "permmute",
      description: "Permanently mutes the mentioned user.",
      category: "Moderation",
      usage: "permmute [user] <reason>",
      aliases: ["perm"],
      permLevel:"DeletMod",
      botPerms: ["MANAGE_ROLES", "MANAGE_CHANNELS"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const user = message.mentions.users.first();
    const reason = args.slice(1).join(" ");
    const modLog = message.guild.channels.find("name", "delet-this");
    if (user === message.author) return message.reply("you cannot mute yourself!");
    if (!modLog) return message.channel.send("Modlog not found. Please inform the server owner of this.");
    if (!user) return message.channel.send("You must mention a user to mute.");
    if (!reason) return message.channel.send("Please provide a reason for the punishment.");

    const muteRole = message.guild.roles.find("name", "Muted");

    if (!message.guild.member(this.client.user).hasPermission("MANAGE_ROLES")) return message.channel.send("I do not have the required permission(s) to carry this out.");

    if (!muteRole) {
        message.guild.createRole({
            name: "Muted",
            color: "RED",
            permissions: []
        }).catch(error => console.log(error.stack));
    }

    try {
      message.guild.channels.forEach(async (channel, id) => { // eslint-disable-line no-unused-vars
        await channel.overwritePermissions(muteRole, {
          SEND_MESSAGES: false,
          SPEAK: false
        });
      });
    } catch (error) {
      console.log(error.stack);
      message.channel.send(`An error occurred:\n\`\`\`${error}\`\`\``);
    }

    const embed = new Discord.RichEmbed()
    .setTitle(`🔇 Member muted in #${message.channel.name}`)
    .setColor(16758125)
    .setDescription(`\`\`\`fix\nIssued to: ${user.tag} (${user.id})\nIssued by: ${message.author.tag} (${message.author.id})\nReason: ${reason}\nDuration: Permanent\nChannel ID: ${message.channel.id}\`\`\``)
    .setFooter("Moderation system powered by delet™", "https://i.imgur.com/No7WfpC.png")
    .setTimestamp()

    if (message.guild.member(user).roles.has(muteRole.id)) {
      return message.channel.send("The mentioned user is already muted.");
    } else {
      message.guild.member(user).addRole(muteRole).then(() => {
        this.client.channels.get(modLog.id).send({embed});
        user.send(`You were muted in **${message.guild.name}**.\n\nReason: **${reason}**\nIn channel: **#${message.channel.name}**\nDuration: **Permanent**\n\nPlease make sure to read and follow the rules in the future, for any server that has rules.`);
        message.react("👌");
      });
    }
  }
}

module.exports = PermMute;