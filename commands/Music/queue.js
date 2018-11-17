const Command = require("../../base/Command.js");
const { stripIndents } = require("common-tags");

class Queue extends Command {
    constructor(client) {
      super(client, {
        name: "queue",
        description: "Sends the current queue.",
        category: "Music",
        usage: "queue",
        guildOnly: true
      });
    }

    async run(message, args, level, serverQueue) { // eslint-disable-line no-unused-vars
        if (!serverQueue) return message.channel.send("There is nothing currently playing.");
        
        return message.channel.send(stripIndents`
        __**Song Queue**__
    
        ${serverQueue.songs.map(song => `• ${song.title}`).join("\n")}
    
        **Now playing:** ${serverQueue.songs[0].title}
        `);
    }
}

module.exports = Queue;