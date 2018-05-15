const { Client } = require("discord.js");
const { TOKEN, PREFIX } = require("./config");
const ytdl = require("ytdl-core");

const client = new Client({ disableEveryone: true });

client.on("warn", console.warn);

client.on("error", console.error);

client.on("ready", () => console.log("Music system ready"));

client.on("disconnect", () => console.log("Bot disconnecting..."));

client.on("reconnect", () => console.log("Reconnecting..."));

client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;
    const args = message.content.split(" ");

    if (message.content.startsWith(`${PREFIX}play`)) {
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return message.channel.send("You must be in a voice channel to be able to play music.");

        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) return message.channel.send("I cannot connect to your voice channel, due to insufficient permissions.");
        if (!permissions.has("SPEAK")) return message.channel.send("I cannot play any music, as I do not have the \"Speak\" permission.");

        try {
            const connection = await voiceChannel.join(); // eslint-disable-line no-unused-vars
        } catch (error) {
            console.error(`Couldn't join voice channel: ${error}`);
            return message.channel.send(`I couldn't join your voice channel:\n${error.message}`);
        }

        const connection = await voiceChannel.join();
        const dispatcher = connection.playStream(ytdl(args[1]))
            .on("end", () => {
                console.log("Song ended");
                voiceChannel.leave();
            })
            .on ("error", error => {
                console.error(error);
            });
        dispatcher.setVolumeLogarithmic(5 / 5);
    } else if (message.content.startsWith(`${PREFIX}stop`)) {
        if (!message.member.voiceChannel) return message.channel.send("You must be in a voice channel to use this command.");
        message.member.voiceChannel.leave();
        return message.channel.send("Music stopped.");
    }
});

client.login(TOKEN);
