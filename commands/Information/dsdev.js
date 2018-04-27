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

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        message.channel.send("Interested in joining the team that develops and maintains me?\nVisit this link: **https://delet.js.org/go/join**.");
    }
}

module.exports = DSDev;
