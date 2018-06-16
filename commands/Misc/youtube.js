const Command = require("../../base/Command.js");
const YouTube = require("simple-youtube-api");
const { GOOGLE_API_KEY } = process.env;

const yt = new YouTube(GOOGLE_API_KEY);

class YouTubeSearch extends Command {
  constructor(client) {
    super(client, {
      name: "youtube",
      description: "Searches YouTube for a specified video.",
      usage: "youtube [video name]",
      aliases: ["yt"]
    });
  }

  async run(message, args, level, texts) { // eslint-disable-line no-unused-vars
    const searchString = args.join(" ");
    if (!searchString) return message.channel.send("You must provide a video title for me to find.");

    try {
      const video = await yt.searchVideos(searchString, 1);
      message.channel.send(video.map(vid => vid.shortURL));
    } catch (error) {
      this.client.logger.error(error);
      return message.channel.send(texts.error.replace(/{{err}}/g, error.message));
    }
  }
}

module.exports = YouTubeSearch;
