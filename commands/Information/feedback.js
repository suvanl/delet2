const Command = require("../../base/Command.js");

class Feedback extends Command {
    constructor(client) {
      super(client, {
        name: "feedback",
        description: "Sends the link to the \"Suggestions & Feedback\" Typeform.",
        category: "Information",
        usage: "suggest",
        aliases: ["suggestion", "suggestions", "suggest", "issue", "issues", "bugs"]
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        const sf = "<https://delet.js.org/suggest>";
        const issues = "<https://github.com/DS-Development/delet/issues>";

        message.channel.send(`
Want to suggest something, or give feedback? Encountering any bugs/issues?

**Suggestions & feedback**: ${sf}.
**Bugs/issues**: ${issues}.
`);
    }
}

module.exports = Feedback;
