const Command = require("../../base/Command.js");

class Leave extends Command {
    constructor(client) {
      super(client, {
        name: "leave",
        description: "Leaves the current server.",
        category: "System",
        usage: "leave",
        guildOnly: true,
        permLevel: "Bot Admin" // users with lower permLevels can simply kick delet from within Discord's tooltip menu
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);

        message.reply("are you sure you want me to leave this guild? I can only be added back by users with the `MANAGE_GUILD` (Manage Server) permission. **(Y/N)**");

        return message.channel.awaitMessages(m => m.author.id === message.author.id, {
            "errors": ["time"],
            "max": 1,
            time: 20000
        }).then(resp => {
            if (!resp) return message.channel.send("Timed out.");
            resp = resp.array()[0];
            const validAnswers = [
                "Y",
                "N",
                "y",
                "n"
            ];
            if (validAnswers.includes(resp.content)) {
                if (resp.content === "N" || resp.content === "n") {
                    return message.channel.send("Cool, looks like I won't be leaving. <:feelsgoodman:319952439602184232>");
                } else if (resp.content === "Y" || resp.content === "y") {
                    message.channel.send("Use this if you ever want to add me back!\n**<https://delet.js.org/go/invite>**");
                        message.guild.leave()
                            .then(g => this.client.logger.info(`Left guild via command: ${g}`))
                            .catch(e => {
                                this.client.logger.error(e);
                                returnmessage.channel.send(`I tried to leave, but couldn't. ${texts.general.error.replace(/{{err}}/g, e.message)}`);
                            });
                }
            }
        });
    }
}

module.exports = Leave;