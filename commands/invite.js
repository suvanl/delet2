const Command = require("../base/Command.js");

class Invite extends Command {
    constructor(client) {
      super(client, {
        name: "invite",
        description: "Generates an invite link, to add delet to a server.",
        usage: "invite",
        aliases: ["join"]
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        this.client.generateInvite([
            "MANAGE_ROLES", 
            "KICK_MEMBERS", 
            "MANAGE_CHANNELS", 
            "BAN_MEMBERS", 
            "VIEW_AUDIT_LOG", 
            "VIEW_CHANNEL", 
            "SEND_TTS_MESSAGES", 
            "EMBED_LINKS", 
            "READ_MESSAGE_HISTORY", 
            "USE_EXTERNAL_EMOJIS", 
            "SEND_MESSAGES", 
            "MANAGE_MESSAGES", 
            "ATTACH_FILES", 
            "ADD_REACTIONS", 
            "CONNECT", 
            "SPEAK", 
            "USE_VAD"
        ]).then(link => {
            message.channel.send("Generating...")
            .then(msg => {
                msg.edit(`Generated invite link for delet:\n**<${link}>**`);
            });
        });
    }
}

module.exports = Invite;