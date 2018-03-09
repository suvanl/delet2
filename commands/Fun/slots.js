const Command = require("../../base/Command.js");
const slots = ["🍇", "🍊", "🍐", "🍒", "🍋"];

class Slots extends Command {
  constructor(client) {
    super(client, {
      name: "slots",
      description: "Spin the slot machine!",
      category: "Fun",
      usage: "slots",
      aliases: ["slotmachine"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const slotOne = slots[Math.floor(Math.random() * slots.length)];
    const slotTwo = slots[Math.floor(Math.random() * slots.length)];
    const slotThree = slots[Math.floor(Math.random() * slots.length)];
    if (slotOne === slotTwo && slotOne === slotThree) {
        return message.channel.send(`
${slotOne}|${slotTwo}|${slotThree}
**You won!** That was definitely down to your immense skill.
        `);
    }
    return message.channel.send(`
${slotOne}|${slotTwo}|${slotThree}
**You lost!** It was just down to bad luck, of course.
    `);

  }
}

module.exports = Slots;
