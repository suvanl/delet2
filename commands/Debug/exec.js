// The EXEC command will execute **ANY** new specified process. This can be
// extremely dangerous if used incorrectly, hence why it is reserved strictly
// for the bot owner only. This command spawns a new child process, and
// executes the given command. It should only be used for debugging purposes.

const Command = require("../../base/Command.js");
const exec = require("child_process").exec;

class Exec extends Command {
  constructor(client) {
    super(client, {
      name: "exec",
      description: "Evaluates arbitrary JavaScript.",
      category: "Debug",
      usage: "exec <expression>",
      permLevel: "Bot Owner"
    });
  }

  async run(message, args, level, texts) { // eslint-disable-line no-unused-vars
    this.client.logger.warn("Exec command used");

    try {
        exec(`${args.join(" ")}`, (error, stdout) => {
            const response = (error || stdout);
            message.channel.send(`Ran command **\`${message.content.slice(6)}\`**:\n\`\`\`${response}\`\`\``, {split: true});
        });
    } catch (error) {
        this.client.logger.error(error.stack);
        return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
    }
  }
}

module.exports = Exec;
