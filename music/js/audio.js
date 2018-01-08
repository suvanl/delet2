const { Client, Util } = require('discord.js');
const { TOKEN, PREFIX, GOOGLE_API_KEY } = require('./config');
const YouTube = require('simple-youtube-api'); 
const ytdl = require('ytdl-core');

const client = new Client({disableEveryone: true});

const youtube = new YouTube(GOOGLE_API_KEY);

const queue = new Map();

client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => console.log('Music system ready!'));

client.on('disconnect', () => console.log('Just disconnected; reconnecting now...'));

client.on('reconnecting', () => console.log('Reconnecting...'));

client.on('message', async msg => {
    if (msg.author.bot) return undefined;
    if (!msg.content.startsWith(PREFIX)) return undefined;
    const args = msg.content.split(' ');
    const searchString = args.slice(1).join(' ');
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    const serverQueue = queue.get(msg.guild.id);

    if (msg.content.startsWith(`${PREFIX}play`)) {
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) return msg.channel.send('You need to be in a voice channel to be able to play music.');
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if (!permissions.has('CONNECT')) {
            return msg.channel.send('I cannot connect to your voice channel, as I lack required permission(s) to do so.');
        }
        if (!permissions.has('SPEAK')) {
            return msg.channel.send('I\'m trying to play music, however, I cannot, as I lack the `SPEAK` permission.');
        }

        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();
            for (const video of Object.values(videos)) {
                const video2 = await youtube.getVideoByID(video.id);
                await handleVideo(video2, msg, voiceChannel, true);
            }
            return msg.channel.send(`The playlist **${playlist.title}** has been added to the queue.`);
        } else {
            try {
                var video = await youtube.getVideo(url);
            } catch (error) {
                try {
                    var videos = await youtube.searchVideos(searchString, 10);
                    let index = 0;
                    msg.channel.send(`
__**Song Selection**__\n
${videos.map(video2 => `**${++index}.** ${video2.title}`).join('\n')}

Please provide a number to select one of the search results, ranging from **1** to **10**.
                    `);

                    try {
                        var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
                            maxMatches: 1,
                            time: 30000,
                            errors: ['time']
                        });
                    } catch (err) {
                         console.error(err);
                         return msg.channel.send('Invalid value provided; cancelling video selection. Please make sure your message contains a number between 1 and 10, and nothing else.');
                    }
                    const videoIndex = parseInt(response.first().content);
                    var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                } catch (err) {
                    console.error(err);
                    return msg.channel.send('No search results found.');
                }
            }

            return handleVideo(video, msg, voiceChannel);
        }

        } else if (msg.content.startsWith(`${PREFIX}skip`)) {
            if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
            if (!serverQueue) return msg.channel.send('There is nothing playing that can be skipped.');
            serverQueue.connection.dispatcher.end('Skip command used.');
            return undefined;
        } else if (msg.content.startsWith(`${PREFIX}stop`)) {
            if (!msg.member.voiceChannel) return msg.channel.send('You cannot stop a music stream when you aren\'t in a voice channel!');
            if (!serverQueue) return msg.channel.send('There is nothing playing that can be stopped.');
            msg.member.voiceChannel.leave('Stop command used.');
            return undefined;
        } else if(msg.content.startsWith(`${PREFIX}volume`)) {
            if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
            if (!serverQueue) return msg.channel.send('The volume cannot be changed as there is nothing currently playing.');
            if (!args[1]) return msg.channel.send(`The current volume is: **${serverQueue.volume}**.`);
            serverQueue.volume = args[1];
            serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
            return msg.channel.send(`Volume set to **${args[1]}**.\nDefault volume = 5.`);
        } else if (msg.content.startsWith(`${PREFIX}np`)) {
            if (!serverQueue) return msg.channel.send('There is nothing playing.');
            return msg.channel.send(`Now playing: **${serverQueue.songs[0].title}**`);
        } else if (msg.content.startsWith(`${PREFIX}queue`)) {
            if (!serverQueue) return msg.channel.send('There is nothing currently playing.');
            return msg.channel.send(`
__**Song Queue**__\n
${serverQueue.songs.map(song => `• ${song.title}`).join('\n')}

**Now playing:** ${serverQueue.songs[0].title}
            `);
        } else if (msg.content.startsWith(`${PREFIX}pause`)) {
            if (serverQueue && serverQueue.playing) {
                serverQueue.playing = false;
                serverQueue.connection.dispatcher.pause();
                return msg.channel.send('Paused.');
            }
            return msg.channel.send('There is nothing playing.');
        } else if (msg.content.startsWith(`${PREFIX}resume`)) {
            if (serverQueue && !serverQueue.playing) {
                serverQueue.playing = true;
                serverQueue.connection.dispatcher.resume();
                return msg.channel.send('Resuming...');
            }
            return msg.channel.send('There is already music playing.');
        }

        return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
    const serverQueue = queue.get(msg.guild.id);
    const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`
    };
    if (!serverQueue) {
        const queueConstruct = {
            textChannel: msg.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };
        queue.set(msg.guild.id, queueConstruct);

        queueConstruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(msg.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(`Unable to connect to voice channel. ${error}`);
            queue.delete(msg.guild.id);
            return msg.channel.send(`I could not join the voice channel. ${error}`);
        }
    } else {
        serverQueue.songs.push(song);
        if (playlist) return undefined;
        else return msg.channel.send(`**${song.title}** has been added to the queue.`);
    }
    return undefined;
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    console.log(serverQueue.songs);

    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', reason => {
            if (reason === 'Stream is not generating quickly enough.') console.log('Song ended');
            else console.log(reason);
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(5 / 5);

    serverQueue.textChannel.send(`Started playing: **${song.title}**`);
}

client.login(TOKEN);