const Command = require("../../base/Command.js");

class Discriminator extends Command {
    constructor(client) {
      super(client, {
        name: "discriminator",
        description: "Searches for users with the specified discriminator.",
        category: "Information",
        usage: "discriminator [discriminator]",
        aliases: ["discrim", "discriminator-search", "discrim-search"]
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        let discrim = args[0];
        if (!discrim) {
            discrim = message.author.discriminator;
        }

        if (discrim.startsWith("#")) {
            discrim = discrim.slice(1);
        }

        if (/^[0-9]+$/.test(discrim) && discrim.length === 4) {
            const users = this.client.users.filter(user => user.discriminator === discrim).map(user => user.username);
            if (users.length === 0) return message.channel.send(`After searching all my servers, no one with the discriminator **#${discrim}** could be found. <:feelsbadman:379645743583199232>`);
            return message.channel.send(`**${users.length}** user(s) found with the discriminator **#${discrim}**:\n\`\`\`yml\n${users.join(", ")}\`\`\``);
        } else {
            return message.channel.send("Invalid discriminator provided.");
        }
    }
}

module.exports = Discriminator;