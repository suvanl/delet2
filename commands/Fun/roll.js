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

    async run(message, args, level, settings) { // eslint-disable-line no-unused-vars
        const texts = require(`../../locales/${settings.language}`);

        const numbers = [
            ":one:",
            ":two:",
            ":three:",
            ":four:",
            ":five:",
            ":six:"
        ];
        try {
            const roll = numbers.random();
            const msg = await message.channel.send("Rolling... 🎲");
            msg.edit(`You rolled a ${roll}!`);
        } catch (error) {
            return message.channel.send(texts.error.replace(/{{err}}/g, error.message));
        }
    }
}

module.exports = Roll;
