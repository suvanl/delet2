const Command = require("../../base/Command.js");
const { RichEmbed } = require("discord.js");

class Icon extends Command {
    constructor(client) {
      super(client, {
        name: "icon",
        description: "Sends the current server's icon.",
        usage: "icon",
        aliases: ["server-icon", "guild-icon"]
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);

        const embed = new RichEmbed()
            .setTitle(`Server icon of ${message.guild.name}`)
            .setImage(message.guild.iconURL);
            
        message.channel.send({embed});
    }
}

module.exports = Icon;