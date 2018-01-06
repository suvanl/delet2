const Command = require("../base/Command.js");

class MyLevel extends Command {
  constructor(client) {
    super(client, {
      name: "mylevel",
      description: "Displays your permission level for your location.",
      usage: "mylevel",
      guildOnly: true
    });
  }

  // async run(message, args, level) {
  //   const friendly = this.client.config.permLevels.find(l => l.level === level).name;
  //   let deletModRole = message.guild.roles.find('name', 'DeletMod');
  //   if (message.member.roles.has(deletModRole.id)) {
  //     return message.reply('your permission level is **${level}** (delet Moderator)');
  //   } else message.reply(`your permission level is: **${level}** (${friendly})`);
  // }

  async run(message, args, level) {
    const friendly = this.client.config.permLevels.find(l => l.level === level).name;
    message.reply(`Your permission level is: ${level} - ${friendly}`);
  }

}

  

module.exports = MyLevel;
