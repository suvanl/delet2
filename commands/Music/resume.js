const Command = require("../../base/Command.js");

class Resume extends Command {
    constructor(client) {
      super(client, {
        name: "resume",
        description: "Resumes the music if currently paused.",
        category: "Music",
        usage: "resume",
        aliases: [""]
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        // See README.md to see why there is no code in here.
    }
}

module.exports = Resume;