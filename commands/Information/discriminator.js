const Command = require("../../base/Command.js");

class Discriminator extends Command {
    constructor(client) {
      super(client, {
        name: "discriminator",
        description: "Discriminator.",
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
            return message.channel.send(`**${users.length}** user(s) found with the discriminator **#${discrim}**:\n\`\`\`yml\n${users.join(", ")}\`\`\``);
        } else {
            return message.channel.send("Invalid discriminator provided.");
        }
    }
}

module.exports = Discriminator;