const Command = require('../base/Command.js');
const Discord = require("discord.js");

class Unmute extends Command {
  constructor(client) {
    super(client, {
      name: 'unmute',
      description: 'Undoes the mentioned user\'s mute.',
      category: 'Moderation',
      usage: 'unmute [user] reason',
      aliases: [''],
      permLevel: "DeletMod",
      botPerms: ['MANAGE_ROLES', 'MANAGE_CHANNELS']
    });
  }

  async run(message, args, level) {
    const user = message.mentions.users.first();
    const reason = args.slice(1).join(' ');
    const modLog = message.guild.channels.find("name", "delet-this");
    if (!modLog) return message.channel.send("Modlog not found. Please inform the server owner of this.");
    if (!user) return message.channel.send("You must mention a user to unmute.");
    if (!reason) return message.channel.send("Please provide a reason.");

    let muteRole = message.guild.roles.find('name', 'Muted');

    if (!message.guild.member(this.client.user).hasPermission("MANAGE_ROLES")) return message.channel.send("I do not have the required permission(s) to carry this out.");

    const embed = new Discord.RichEmbed()
    .setTitle(`🔊 Member unmuted`)
    .setColor(12451456)
    .setDescription(`\`\`\`fix\nUser: ${user.tag} (${user.id})\nUndone by: ${message.author.tag} (${message.author.id})\nReason: ${reason}\`\`\``)
    .setFooter("Moderation system powered by delet™", "https://i.imgur.com/No7WfpC.png")
    .setTimestamp()

    if (message.guild.member(user).roles.has(muteRole.id)) {
      message.guild.member(user).removeRole(muteRole).then(() => {
          this.client.channels.get(modLog.id).send({embed});
          message.react("👌");
      });
    } else {
      return message.reply("the mentioned user isn't muted, so I cannot unmute them.");
    }
  }
}

module.exports = Unmute;