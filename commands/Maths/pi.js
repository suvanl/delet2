const Command = require("../../base/Command.js");

class Pi extends Command {
    constructor(client) {
      super(client, {
        name: "pi",
        description: "Returns the value of Pi (π).",
        usage: "pi",
        aliases: ["π"]
      });
    }

    async run(message, args, level, settings) { // eslint-disable-line no-unused-vars
        if (message.content.startsWith(`${settings.prefix}π`)) {
            return message.channel.send(`π = **${Math.PI}**...`);
        }
        const msg = await message.channel.send(`π = **${Math.PI}**...`);
        await this.client.wait(500);
        msg.edit(`π = **${Math.PI}**...\n\nFind out more about Pi here: **<https://en.wikipedia.org/wiki/Pi>**.\nOne million digits of Pi: **<https://www.piday.org/million/>**.`);
    }
}

module.exports = Pi;
