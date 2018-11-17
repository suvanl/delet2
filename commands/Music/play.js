const Command = require("../../base/Command.js");
const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");
const { stripIndents } = require("common-tags");
const { Util } = require("discord.js");
const { GOOGLE_API_KEY } = process.env;
const youtube = new YouTube(GOOGLE_API_KEY);

class Play extends Command {
    constructor(client) {
      super(client, {
        name: "play",
        description: "Plays a song.",
        category: "Music",
        usage: "play <song title OR YouTube link>",
        guildOnly: true
      });
    }

    async run(message, args, level, settings, texts, queue) { // eslint-disable-line no-unused-vars
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return message.channel.send(texts.music.noVoiceChannel);

        const searchString = args.join(" ");
        if (!searchString) return message.channel.send("You must provide a song/video name or YouTube URL.");

        const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : ""; // removes embed escape characters (< >)
    
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) return message.channel.send(texts.music.noConnect);
        if (!permissions.has("SPEAK")) return message.channel.send(texts.music.noSpeak);

        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
          const playlist = await youtube.getPlaylist(url);
          const videos = await playlist.getVideos();
    
          for (const video of Object.values(videos)) {
            const video2 = await youtube.getVideoByID(video.id);
            await handleVideo(video2, message, voiceChannel, true);
          }
          return message.channel.send(texts.music.playlistAdded.replace(/{{playlist}}/g, playlist.title));
        } else {
          try {
            var video = await youtube.getVideo(url);
          } catch (error) {
            // catch
            try {
              var videos = await youtube.searchVideos(searchString, 10);
              let index = 0;
    
              message.channel.send(stripIndents`
              __**${texts.music.songSelection}**__
    
              ${videos.map(video2 => `**${++index} -** ${video2.title}`).join("\n")}
    
              ${texts.music.songSelectionInfo}
              `);
              try {
                var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
                  maxMatches: 1,
                  time: 15000,
                  errors: ["time"]
                });
              } catch (err) {
                this.client.logger.error(err);
                return message.channel.send(texts.music.songSelectionCancel);
              }
              const videoIndex = parseInt(response.first().content);
              var video = await youtube.getVideoByID(videos[videoIndex - 1].id); // eslint-disable-line no-redeclare
            } catch (err) {
              this.client.logger.error(err);
              return message.channel.send(texts.general.noResultsFound);
            }
          }
          return handleVideo(video, message, voiceChannel);
        }

        async function handleVideo(video, message, voiceChannel, playlist = false) {
          const serverQueue = queue.get(message.guild.id);
          //console.debug(video);
          const song = {
            id: video.id,
            title: Util.escapeMarkdown(video.title),
            url: `https://www.youtube.com/watch?v=${video.id}`
          };
          if (!serverQueue) {
            const queueConstruct = {
              textChannel: message.channel,
              voiceChannel: voiceChannel,
              connection: null,
              songs: [],
              volume: 5,
              playing: true
            };
            queue.set(message.guild.id, queueConstruct);
        
            queueConstruct.songs.push(song);
        
            try {
              var connection = await voiceChannel.join();
              queueConstruct.connection = connection;
              play(message.guild, queueConstruct.songs[0]);
            } catch (error) {
              queue.delete(message.guild.id);
              console.error(`Could not join the voice channel: ${error.stack}`);
              return message.channel.send(`I could not join the voice channel:\n\`\`\`${error}\`\`\``);
            }
          } else {
            serverQueue.songs.push(song);
            console.debug(serverQueue.songs);
            if (playlist) return;
            else return message.channel.send(`**${song.title}** has been added to the queue.`);
          }
          return;
        }

        function play(guild, song) {
          const serverQueue = queue.get(guild.id);
          if (!song) {
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
          }
          console.debug(serverQueue.songs);
        
          const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
            .on("end", reason => {
              if (reason === "Stream is not generating quickly enough.") console.debug("Song ended");
              else console.debug(reason);
              serverQueue.songs.shift();
              play(guild, serverQueue.songs[0]);
            })
            .on("error", err => console.error(err));
          dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        
          serverQueue.textChannel.send(`Started playing **${song.title}**.`);
        }
    }
}

module.exports = Play;
