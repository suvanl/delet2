// Previously, in the older version of delet (https://github.com/suvanl/delet),
// the tutorial command used a series of `awaitMessages` methods. However, we
// have decided to replace that with the online documentation, which will be much
// clearer and more informative. It also reduces the amount of messy code.

const Command = require("../../base/Command.js");

class Tutorial extends Command {
  constructor(client) {
    super(client, {
      name: "tutorial",
      description: "Directs the user towards the docs.",
      usage: "tutorial",
      aliases: ["guide"]
    });
  }

  async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
    message.channel.send(texts.cmd.misc.tutorial);
  }
}

module.exports = Tutorial;
