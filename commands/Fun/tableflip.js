const Command = require("../../base/Command.js");
const flipFrames = [
  "(-°□°)-  ┬─┬",
  "(╯°□°)╯    ]",
  "(╯°□°)╯  ︵  ┻━┻",
  "(╯°□°)╯       [",
  "(╯°□°)╯           ┬─┬"
];

class TableFlip extends Command {
    constructor(client) {
      super(client, {
        name: "tableflip",
        description: "Flips a table, in real-time! (╯°□°)╯",
        category: "Fun",
        usage: "tableflip",
        aliases: [""]
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
      const msg = await message.channel.send("(\\\\°□°)\\\\  ┬─┬");

      for (const frame of flipFrames) {
        await this.client.wait(300);
        await msg.edit(frame);
      }
      return msg;
    }
}

module.exports = TableFlip;