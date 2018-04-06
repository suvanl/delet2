const Command = require("../../base/Command.js");
const ms = require("ms");

class Lockdown extends Command {
    constructor(client) {
      super(client, {
        name: "lockdown",
        description: "Locks a channel down for a set duration. Use \"[prefix]lockdown release\" to end the lockdown prematurely.",
        category: "Moderation",
        usage: "lockdown <duration> <s|m|h>",
        guildOnly: true,
        aliases: ["ld"],
        permLevel: "Moderator"
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        const settings = message.guild ? this.client.getSettings(message.guild.id) : this.client.settings.get("default");

        if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);
        if (!this.client.lockit) this.client.lockit = [];
        const time = args.join(" ");
        const validUnlocks = ["release", "unlock"];
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
                    message.channel.send(`Channel locked down for ${ms(ms(time), { long: true })}.`).then (() => {
                        this.client.lockit[message.channel.id] = setTimeout(() => {
                            message.channel.overwritePermissions(message.guild.id, {
                                SEND_MESSAGES: null
                            }).then(message.channel.send("Lockdown lifted."));
                            delete this.client.lockit[message.channel.id];
                        }, ms(time));
                    });
                });
            }
        } catch (error) {
            message.channel.send(`An error occurred whilst trying to lock this channel down. Example command usage: \`${settings.prefix}lockdown 5 m\``);
        }
    }
}

module.exports = Lockdown;