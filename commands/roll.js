const Command = require("../base/Command.js");

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
        let roll = Math.floor(Math.random() * 6) + 1;
        
        try {
            if (roll === 8) {
                const msg = await message.channel.send("Rolling... 🎲");
                msg.edit("You rolled an **8**!");
            } else {
                const msg = await message.channel.send("Rolling... 🎲");
                msg.edit(`You rolled a **${roll}**!`);
            }
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = Roll;