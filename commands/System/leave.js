const Command = require("../../base/Command.js");
const Discord = require("discord.js");

class Leave extends Command {
    constructor(client) {
      super(client, {
        name: "leave",
        description: "Leaves the server the message is run in.",
        category: "System",
        usage: "leave",
        aliases: [""],
        guildOnly: true,
        permLevel: "Bot Admin"
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        message.reply("are you sure you want me to leave this guild? I can only be added back by users with the `MANAGE_GUILD` (Manage Server) permission. **(Y/N)**");

        return message.channel.awaitMessages(m => m.author.id === message.author.id, {
            "errors": ["time"],
            "max": 1,
            time: 20000
        }).then(resp => {
            if (!resp) return message.channel.send("Timed out.");
            resp = resp.array()[0];
            let validAnswers = [
                "Y",
                "N",
                "y",
                "n"
            ];
            if (validAnswers.includes(resp.content)) {
                if (resp.content === "N" || resp.content === "n") {
                    return message.channel.send("Cool, looks like I won't be leaving. <:feelsgoodman:319952439602184232>");
                } else if (resp.content === "Y" || resp.content === "y") {
                    message.channel.send("Use this if you ever want to add me back!\n**<http://bit.ly/deletAdd>**");
                    try {
                        message.guild.leave()
                            .then(g => console.log(`Left guild via command: ${g}`));
                    } catch (e) {
                        console.error(e);
                        message.channel.send(`I tried to leave, but couldn't.\nAn error occurred: ${e.message}`);
                    }
                }
            }
        });
    }
}

module.exports = Leave;