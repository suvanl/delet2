const Command = require("../../base/Command.js");
const { stripIndents } = require("common-tags");
const slots = ["🍇", "🍊", "🍐", "🍒", "🍋"];

class Slots extends Command {
  constructor(client) {
    super(client, {
      name: "slots",
      description: "Spin the slot machine!",
      category: "Fun",
      usage: "slots",
      aliases: ["slotmachine"],
      guildOnly: true
    });
  }

  async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
    const slotOne = slots[Math.floor(Math.random() * slots.length)];
    const slotTwo = slots[Math.floor(Math.random() * slots.length)];
    const slotThree = slots[Math.floor(Math.random() * slots.length)];
    if (slotOne === slotTwo && slotOne === slotThree) {
        return message.channel.send(stripIndents`
        ${slotOne}|${slotTwo}|${slotThree}
        ${texts.cmd.fun.slotWin}
        `);
    }
    return message.channel.send(stripIndents`
    ${slotOne}|${slotTwo}|${slotThree}
    ${texts.cmd.fun.slotLoss}
    `);
  }
}

module.exports = Slots;
