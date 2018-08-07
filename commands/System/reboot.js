const Command = require("../../base/Command.js");

class Reboot extends Command {
  constructor(client) {
    super(client, {
      name: "reboot",
      description: "If running under PM2, the bot will restart.",
      category: "System",
      usage: "reboot",
      aliases: ["restart"],
      permLevel: "Bot Admin"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      await message.channel.send("Rebooting, please wait...");
      this.client.commands.forEach(async cmd => {
        await this.client.unloadCommand(cmd);
      });
      // Exiting with a code of 1 triggers an automatic restart for the PM2 process
      process.exit(1);
    } catch (e) {
      this.client.logger.error(e);
    }
  }
}

module.exports = Reboot;