// Copyright (c) 2019 An Idiot's Guide. All rights reserved. MIT license.
// https://github.com/AnIdiotsGuide/guidebot-class

// The EVAL command will execute **ANY** arbitrary JavaScript code given to it.
// Therefore, this command is permission level 10 to prevent others using it. It
// can be dangerous, as Eval can be used to do anything on the host machine.
// However, it's extremely useful for troubleshooting and doing stuff you don't
// want to put in a command.

const Command = require("../../base/Command.js");

class Eval extends Command {
  constructor(client) {
    super(client, {
      name: "eval",
      description: "Evaluates arbitrary JavaScript.",
      category: "Debug",
      usage: "eval <expression>",
      aliases: ["ev"],
      permLevel: "Bot Owner"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    this.client.logger.warn("Eval command used");

    const code = args.join(" ");
    try {
      const evaled = eval(code);
      const clean = await this.client.clean(this.client, evaled);
      const MAX_CHARS = 3 + 2 + clean.length + 3;
      if (MAX_CHARS > 2000) {
        return message.channel.send("Output exceeded 2000 characters, sending as a file.", { files: [{ attachment: Buffer.from(clean), name: "output.txt" }] });
      }
      message.channel.send(`\`\`\`js\n${clean}\n\`\`\``);
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${await this.client.clean(this.client, err)}\n\`\`\``);
    }
  }
}

module.exports = Eval;
