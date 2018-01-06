const Moderation = require('../base/Moderation.js');

class Report extends Moderation {
    constructor(client) {
      super(client, {
        name: 'report',
        description: 'Reports a user to the server\'s staff.',
        usage: 'report [user] <reason/info>',
        extended: 'Informs the current server\'s staff of a rule-breaker, by sending a message to the modlog channel.',
        guildOnly: false,
        aliases: [''],
        botPerms: ['MANAGE_MESSAGES']
      });
    }
    async run(message, args, level) { // eslint-disable-line no-unused-vars

        const user = message.mentions.users.first();
        const reason = args.slice(1).join(' ');
        const modLog = message.guild.channels.find("name", "delet-this");
        if (!modLog) return message.channel.send("Modlog not found. Please inform the server owner of this.");
        if (!user) return message.channel.send("You must mention a user to report.");

        message.delete();

        this.client.channels.get(modLog.id).send({embed: {
            color: 3502732,
            author: {
              name: `🚩 Report received from ${message.author.tag} (User ID: ${message.author.id})`,
              icon_url: message.author.avatarURL
            },
            url: "",
            description: `\`\`\`css\n@${user.username}#${user.discriminator} ${reason}\nReported from: #${message.channel.name}\`\`\``,
            timestamp: new Date(),
            footer: {
              icon_url: "https://i.imgur.com/No7WfpC.png",
              text: "Report system powered by delet™"
            }
        }
    }).catch(console.error);
        message.channel.send(`<:tick:398228298842374154> Report successfully sent.`);
    }
}

module.exports = Report;