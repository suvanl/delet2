const Command = require("../../base/Command.js");
const fs = require("fs");

class FileSize extends Command {
  constructor(client) {
    super(client, {
      name: "filesize",
      description: "Returns the value of the size of the specified file.",
      category: "Debug",
      usage: "filesize <file>",
      aliases: ["fs"],
      permLevel: "Bot Admin"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const file = args[0];
    if (!file) return message.channel.send("You must provide a file (and location if non-root file), and the correct syntax must be used.");

    try {
      const stats = fs.statSync(file);
      const fileBytes = stats["size"];
      const fileKB = fileBytes / 1024;

      message.channel.send(`\`${file}\` currently has a size of **${fileBytes}** bytes (${fileKB.toFixed(2)}KB).`);
    } catch (error) {
      if (error.code === "ENOENT") return message.channel.send(`The file \`${file}\` could not be found.`);
      else this.client.logger.error(error);
    }
  }
}

module.exports = FileSize;
