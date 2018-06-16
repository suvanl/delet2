const Command = require("../../base/Command.js");
const snekfetch = require("snekfetch");
const { RichEmbed } = require("discord.js");
const { base64 } = require("../../util/Utils.js");
const { TWITTER_API_KEY, TWITTER_SECRET } = process.env;

class Tweet extends Command {
  constructor(client) {
    super(client, {
      name: "tweet",
      description: "Returns the specified user's latest tweet.",
      category: "Information",
      usage: "tweet [user]",
      aliases: ["latesttweet", "latest-tweet"]
    });

    this.token = null;
  }

  async run(message, args, level, texts) { // eslint-disable-line no-unused-vars
    const user = args[0];
    if (!user) return message.channel.send("You must specify a Twitter user whose latest tweet you'd like to see.");

    try {
        if (!this.token) await this.fetchToken();
        const { body } = await snekfetch
            .get("https://api.twitter.com/1.1/users/show.json")
            .set({ Authorization: `Bearer ${this.token}` })
            .query({ screen_name: user });

        const embed = new RichEmbed()
            .setColor(12639981)
            .setThumbnail(body.profile_image_url_https)
            .setAuthor("Latest Tweet", "https://vgy.me/8tgKd0.png")
            .setTitle(`${body.name} (@${body.screen_name})`)
            .setURL(`https://twitter.com/${body.screen_name}`)
            .setDescription(body.status ? body.status.text : "???");

        return message.channel.send({ embed });
    } catch (error) {
        this.client.logger.error(error);
        if (error.statusCode === 401) await this.fetchToken();
        if (error.statusCode === 404) return message.channel.send(texts.noResultsFound);
        return message.channel.send(texts.error.replace(/{{err}}/g, error.message));
    }
  }

  async fetchToken() {
      const { body } = await snekfetch
        .post("https://api.twitter.com/oauth2/token")
        .set({
            Authorization: `Basic ${base64(`${TWITTER_API_KEY}:${TWITTER_SECRET}`)}`,
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        })
        .send("grant_type=client_credentials");

      this.token = body.access_token;
      return body;
  }
}

module.exports = Tweet;
