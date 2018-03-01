const Command = require("../base/Command.js");
const ms = require("ms");
const Discord = require("discord.js");
const client = new Discord.Client();

class Lockdown extends Command {
    constructor(client) {
      super(client, {
        name: "lockdown",
        description: "Locks a channel down for a set duration. Use \"%lockdown release\" to end the lockdown prematurely.",
        category: "Moderation",
        usage: "lockdown <duration> <s|m|h>",
        guildOnly: true,
        aliases: ["ld"],
        permLevel: "DeletMod"
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        if (!client.lockit) client.lockit = [];
        let time = args.join(" ");
        let validUnlocks = ["release", "unlock"];
        if (!time) return message.channel.send("A duration for the lockdown must be set. This can be in hours, minutes or seconds. Example command usage:\n```%lockdown 5 m```");

        try {
            if (validUnlocks.includes(time)) {
                message.channel.overwritePermissions(message.guild.id, {
                    SEND_MESSAGES: null
                }).then(() => {
                    message.channel.send("Lockdown lifted.");
                    clearTimeout(client.lockit[message.channel.id]);
                    delete client.lockit[message.channel.id];
                });
            } else {
                message.channel.overwritePermissions(message.guild.id, {
                    SEND_MESSAGES: false
                }).then(() => {
                    message.channel.send(`Channel locked down for ${ms(ms(time), { long: true })}.`).then (() => {
                        client.lockit[message.channel.id] = setTimeout(() => {
                            message.channel.overwritePermissions(message.guild.id, {
                                SEND_MESSAGES: null
                            }).then(message.channel.send("Lockdown lifted."));
                            delete client.lockit[message.channel.id];
                        }, ms(time));
                    });
                });
            }
        } catch (error) {
            message.channel.send("An error occurred whilst trying to lock this channel down. Example command usage:\n```%lockdown 5 m```")
        }
    }
}

module.exports = Lockdown;