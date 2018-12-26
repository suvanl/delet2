const Command = require("../../base/Command.js");

class MyLevel extends Command {
  constructor(client) {
    super(client, {
      name: "mylevel",
      description: "Displays your permission level for your location.",
      usage: "mylevel",
      aliases: ["myrank", "level", "permlevel"],
      guildOnly: true
    });
  }

  async run(message, args, level, settings, texts) {
    const friendly = this.client.config.permLevels.find(l => l.level === level).name;
    message.reply(`${texts.cmd.misc.permLevel}: **${level}** (${friendly}).`);
  }
}

module.exports = MyLevel;
