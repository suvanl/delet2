const Command = require("../../base/Command.js");
const delet = require("../../package.json");

class Feedback extends Command {
    constructor(client) {
      super(client, {
        name: "feedback",
        description: "Sends the link to the \"Suggestions & Feedback\" Typeform.",
        category: "Information",
        usage: "suggest",
        aliases: ["suggestion", "suggestions", "suggest", "issue", "issues", "bugs", "bug"]
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        const suggest = "<https://delet.js.org/suggest>";
        const issues = `<${delet.bugs.url}>`;

        message.channel.send(`
Want to suggest something, or give feedback? Encountering any bugs/issues?

**Suggestions & feedback**: ${suggest}.
**Bugs/issues**: ${issues}.
`);
    }
}

module.exports = Feedback;
