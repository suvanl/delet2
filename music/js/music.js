const { Client, Util } = require("discord.js");
const { TOKEN, PREFIX, GOOGLE_API_KEY } = require("./config");
const { stripIndents } = require("common-tags");
const moment = require("moment");
const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");
const texts = require("../../locales/en-GB");

const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]: `;

const client = new Client({ disableEveryone: true });

const youtube = new YouTube(GOOGLE_API_KEY);

const queue = new Map();

client.on("warn", console.warn);

client.on("error", console.error);

client.on("ready", () => console.log(timestamp + "Music system ready"));

client.on("disconnect", () => console.log(timestamp + "Bot disconnecting..."));

client.on("reconnecting", () => console.log(timestamp + "Reconnecting..."));

client.on("message", async message => {
	if (message.author.bot) return;
	if (!message.content.startsWith(PREFIX)) return;

	const args = message.content.split(" ");
	const searchString = args.slice(1).join(" ");
	const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : ""; // removes embed escape characters (< >)
	const serverQueue = queue.get(message.guild.id);

	let command = message.content.toLowerCase().split(" ")[0];
	command = command.slice(PREFIX.length);

	// PLAY COMMAND
	if (command === "play") {
		const voiceChannel = message.member.voiceChannel;
		if (!voiceChannel) return message.channel.send(texts.music.noVoiceChannel);

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
						console.error(timestamp + err);
						return message.channel.send(texts.music.songSelectionCancel);
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id); // eslint-disable-line no-redeclare
				} catch (err) {
					console.error(timestamp + err);
					return message.channel.send(texts.general.noResultsFound);
				}
			}
			return handleVideo(video, message, voiceChannel);
		}

		// SKIP COMMAND
	} else if (command === "skip") {
		if (!message.member.voiceChannel) return message.channel.send(texts.music.noVoiceChannel);
		if (!serverQueue) return message.channel.send("There is nothing currently playing that can be skipped.");
		serverQueue.connection.dispatcher.end("Skip command used");
		return;

		// STOP COMMAND
	} else if (command === "stop") {
		if (!message.member.voiceChannel) return message.channel.send(texts.music.noVoiceChannel);
		if (!serverQueue) return message.channel.send("There is nothing currently playing that can be stopped.");
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end("Stop command used");
		return message.channel.send("Music stopped.");

		// VOLUME COMMAND
	} else if (command === "volume" || command === "vol") {
		if (!message.member.voiceChannel) return message.channel.send(texts.music.noVoiceChannel);
		if (!serverQueue) return message.channel.send("There is nothing currently playing.");
		if (!args[1]) return message.channel.send(`The current volume is **${serverQueue.volume}**.`);
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic((args[1].toLowerCase() === "default" ? 5 : args[1]) / 5);
		return message.channel.send(`Volume set to **${args[1]}**.\nThe default volume level is 5.`);

		// NOW PLAYING COMMAND
	} else if (command === "np" || command === "song") {
		if (!serverQueue) return message.channel.send("There is nothing currently playing.");
		return message.channel.send(`Now playing: **${serverQueue.songs[0].title}**`);

		// QUEUE COMMAND
	} else if (command === "queue") {
		if (!serverQueue) return message.channel.send("There is nothing currently playing.");
		return message.channel.send(stripIndents`
		__**Song Queue**__

		${serverQueue.songs.map(song => `• ${song.title}`).join("\n")}

		**Now playing:** ${serverQueue.songs[0].title}
		`);

		// PAUSE COMMAND
	} else if (command === "pause") {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send("Paused.");
		}
		return message.channel.send("There is nothing currently playing.");

		// RESUME COMMAND
	} else if (command === "resume") {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return message.channel.send("Resuming...");
		}
		return message.channel.send("There is nothing currently playing.");
	}

	return;
});

async function handleVideo(video, message, voiceChannel, playlist = false) {
	const serverQueue = queue.get(message.guild.id);
	//console.log(video);
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
			console.error(`${timestamp}I could not join the voice channel:\n\`\`\`${error}\`\`\``);
			queue.delete(message.guild.id);
			return message.channel.send(`I could not join the voice channel:\n\`\`\`${error}\`\`\``);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
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
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on("end", reason => {
			if (reason === "Stream is not generating quickly enough.") console.log(timestamp + "Song ended");
			else console.log(timestamp + reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on("error", error => console.error(timestamp + error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`Started playing **${song.title}**.`);
}

client.login(TOKEN);
