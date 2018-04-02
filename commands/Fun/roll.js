const Command = require("../../base/Command.js");

class Roll extends Command {
    constructor(client) {
      super(client, {
        name: "roll",
        description: "Rolls a regular six-sided dice.",
        category: "Fun",
        usage: "roll",
        aliases: ["dice"]
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        const numbers = [
            ":one:",
            ":two:",
            ":three:",
            ":four:",
            ":five:",
            ":six:"
        ];
        try {
            const roll = numbers.random(sdf);
            const msg = await message.channel.send("Rolling... 🎲");
            msg.edit(`You rolled a ${roll}!`);
        } catch (error) {
            message.channel.send(`An error occurred:\n\`\`\`${error.message}\`\`\``);
        }
    }
}

module.exports = Roll;
