const Command = require("../../base/Command.js");

class Shutdown extends Command {
  constructor(client) {
    super(client, {
      name: "shutdown",
      description: "Shuts down delet.",
      category: "System",
      usage: "shutdown",
      aliases: ["kill", "endprocess"],
      permLevel: "Bot Owner"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      await message.channel.send("Shutting down...");
      this.client.commands.forEach(async cmd => {
        await this.client.unloadCommand(cmd);
      });
      process.exit(0);
    } catch (e) {
      this.client.logger.error(e);
    }
  }
}

module.exports = Shutdown;