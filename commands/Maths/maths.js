const Command = require("../../base/Command.js");
const math = require("mathjs");

class Maths extends Command {
    constructor(client) {
      super(client, {
        name: "maths",
        description: "Evaluates/calculates a given mathematical expression.",
        category: "Maths",
        usage: "maths [expression]",
        aliases: ["math", "calculate"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        let exp = args.join(" ");
        if (!exp) return message.channel.send(texts.cmd.math.noExp.replace(/{{prefix}}/g, settings.prefix));
        if (exp.includes("°")) exp = exp.replace(/°/g, "deg");

        const msg = await message.channel.send(texts.cmd.math.calculating);

        try {
          let evaled = math.eval(exp);
          if (isNaN(evaled)) evaled = texts.cmd.math.isNaN;
          if (exp.length + evaled.length > 2000) return message.channel.send("Output is too long to fit into a message!");
          
          msg.edit(`${exp} = **${evaled}**`);
        } catch (error) {
          if (error.toString().startsWith("SyntaxError:") || error.message.startsWith("Undefined symbol")) return msg.edit(`**\`SyntaxError:\`** \`${error.message}\``);

          this.client.logger.error(error);
          msg.edit(texts.general.error.replace(/{{err}}/g, error));
        }
    }
}

module.exports = Maths;
