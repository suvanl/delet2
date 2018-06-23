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
        const exp = args.join(" ");
        if (!exp) return message.channel.send(`You must provide an expression to evaluate/calculate.\nExample usage: \`${settings.prefix}maths 2 + 2 * 5\``);

        const msg = await message.channel.send("<a:loading:456928252502605834> Calculating...");

        try {
          let evaled = math.eval(exp);
          if (isNaN(evaled)) evaled = "NaN (not a number).";
          
          msg.edit(`${exp} = **${evaled}**`);
        } catch (error) {
          if (error.toString().startsWith("SyntaxError:") || error.message.startsWith("Undefined symbol")) return msg.edit(`**\`SyntaxError:\`** \`${error.message}\``);

          this.client.logger.error(error);
          msg.edit(texts.general.error.replace(/{{err}}/g, error));
        }
    }
}

module.exports = Maths;
