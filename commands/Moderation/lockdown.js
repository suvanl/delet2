const Command = require("../../base/Command.js");
const { RichEmbed } = require("discord.js");
const ms = require("ms");

class Lockdown extends Command {
    constructor(client) {
      super(client, {
        name: "lockdown",
        description: "Locks a channel down for a set duration. Use \"lockdown release\" to end the lockdown prematurely.",
        category: "Moderation",
        usage: "lockdown <duration> <sec|min|hr>",
        guildOnly: true,
        aliases: ["ld"],
        permLevel: "Moderator"
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);

        const modLog = message.guild.channels.find(c => c.name === settings.modLogChannel);
        if (!modLog) return message.channel.send(texts.moderation.modLogNotFound.replace(/{{prefix}}/g, settings.prefix));

        if (!this.client.lockit) this.client.lockit = [];
        const time = args.join(" ");
        const validUnlocks = ["release", "rel", "unlock", "end", "stop"];
        if (!time) return message.channel.send("A duration for the lockdown must be set. This can be in hours, minutes or seconds. Example command usage:\n```%lockdown 5 m```");

        try {
            if (validUnlocks.includes(time)) {
                message.channel.overwritePermissions(message.guild.id, {
                    SEND_MESSAGES: null
                }).then(() => {
                    message.channel.send("Lockdown lifted.");
                    clearTimeout(this.client.lockit[message.channel.id]);
                    delete this.client.lockit[message.channel.id];
                });
            } else {
                message.channel.overwritePermissions(message.guild.id, {
                    SEND_MESSAGES: false
                }).then(() => {
                    const embed = new RichEmbed()
                        .setTitle("🔒 Channel locked down")
                        .setColor(16753762)
                        .setDescription(`\`\`\`ruby\nChannel: #${message.channel.name} (${message.channel.id})\nDuration: ${ms(ms(time), { long: true })}\nIssued by: ${message.author.tag}\`\`\``)
                        .setFooter(texts.moderation.poweredBy, this.client.user.displayAvatarURL)
                        .setTimestamp();
                    this.client.channels.get(modLog.id).send({ embed })
                        .then(() => {
                            this.client.lockit[message.channel.id] = setTimeout(() => {
                                message.channel.overwritePermissions(message.guild.id, {
                                    SEND_MESSAGES: null
                                })
                                .then(message.channel.send("Lockdown lifted."));
                                delete this.client.lockit[message.channel.id];
                            }, ms(time));
                    });
                });
            }
        } catch (error) {
            message.channel.send(`An error occurred whilst trying to lock this channel down. Use \`${settings.prefix}help lockdown\` to see how to use this command.`);
        }
    }
}

module.exports = Lockdown;