const Command = require("../../base/Command.js");

class Prime extends Command {
    constructor(client) {
      super(client, {
        name: "prime",
        description: "Checks if a number is a prime number.",
        category: "Maths",
        usage: "prime <number>",
        aliases: ["primenumber", "isprime"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        const n = parseInt(args[0]);
        if (!n) return message.channel.send(texts.cmd.math.noNum);
        
        const isPrime = n => {
            if (isNaN(n) || !isFinite(n) || n%1 || n < 2) return false;
            if (n%2 == 0) return (n == 2);
            if (n%3 == 0) return (n == 3);
            
            const m = Math.sqrt(n);

            for (let i = 5; i <= m; i += 6) {
                if (n%i == 0) return false;
                if (n%(i + 2) == 0) return false;
            }
            return true;
        };

        if (isPrime(n) === true) {
            message.channel.send(`<:tick:398228298842374154> **${n}** ${texts.cmd.math.isPrime}.`);
        }

        if (isPrime(n) === false) {
            message.channel.send(`<:redX:398228298708025344> **${n}** ${texts.cmd.math.isNotPrime}.`);
        }
    }
}

module.exports = Prime;
