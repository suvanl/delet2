const Command = require("../base/Command.js");

class Add extends Command {
    constructor(client) {
      super(client, {
        name: "add",
        description: "Adds numbers together.",
        category: "Maths",
        usage: "add x y z (and so on)",
        aliases: ["sum", "mathsadd"]
      });
    }

    async run(message, args, level) {
        // try {
        //     let numArray = args.map(n => parseInt(n));
        //     let total = numArray.reduce( (p, c) => p+c);
        //     message.channel.send(total);
        // } catch (error) {
        //     console.error(`Addition failed. ${error}`);
        //     message.channel.send(`An error occured while executing this command.\n\`\`\`${error}\`\`\``);
        // }

        let numArray = args.map(n => parseInt(n));
        let total = numArray.reduce( (p, c) => p+c);
        message.channel.send(total);
    }
}

module.exports = Add;