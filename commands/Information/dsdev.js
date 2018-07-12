const Command = require("../../base/Command.js");

class DSDev extends Command {
    constructor(client) {
      super(client, {
        name: "dsdev",
        description: "Interested in joining my development team?",
        category: "Information",
        usage: "dsdev",
        aliases: ["hireme", "joinus"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        message.channel.send(`${texts.cmd.dsDev} **https://delet.js.org/go/join**.`);
    }
}

module.exports = DSDev;
