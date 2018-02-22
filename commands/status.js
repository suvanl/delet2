const Command = require("../base/Command.js");

class Status extends Command {
    constructor(client) {
      super(client, {
        name: "status",
        description: "Sets delet's presence/status.",
        category: "System",
        usage: "status",
        aliases: [""],
        permLevel: "Bot Admin"
      });
    }

    async run(message, args, level) {
        var status = args.join(" ");

        if (status === "online" || status === "idle" || status === "dnd" || status === "invisible") {
            this.client.user.setStatus(status);
            message.channel.send(`Status successfully changed to **${status}**.\nPlease note that changing status may take up to a minute or two.`);
        } else {
            return message.channel.send(`"${status}" is not a valid status type.`);
        }
    }
}

module.exports = Status;