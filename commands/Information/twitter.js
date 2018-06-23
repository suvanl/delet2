// Based on Xiao's Twitter command (https://github.com/dragonfire535/xiao/)
// Licensed under the GNU General Public License v3.0

const Command = require("../../base/Command.js");
const snekfetch = require("snekfetch");
const { RichEmbed } = require("discord.js");
const { base64 } = require("../../util/Utils.js");
const { TWITTER_API_KEY, TWITTER_SECRET } = process.env;

class Twitter extends Command {
  constructor(client) {
    super(client, {
      name: "twitter",
      description: "Returns info about a Twitter user.",
      category: "Information",
      usage: "twitter [user]",
      aliases: ["twitterinfo", "twitter-info", "tinfo"]
    });

    this.token = null;
  }

  async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
    const user = args[0];
    if (!user) return message.channel.send("You must specify a Twitter user to get information on.");

    try {
        if (!this.token) await this.fetchToken();
        const { body } = await snekfetch
            .get("https://api.twitter.com/1.1/users/show.json")
            .set({ Authorization: `Bearer ${this.token}` })
            .query({ screen_name: user });

        const embed = new RichEmbed()
            .setColor(44269)
            .setThumbnail(body.profile_image_url_https)
            .setAuthor("Twitter", "https://vgy.me/a7ii9V.png")
            .setTitle(`${body.name} (@${body.screen_name})`)
            .setURL(`https://twitter.com/${body.screen_name}`)
            .setDescription(body.description)
            .addField("❯ Followers", body.followers_count, true)
            .addField("❯ Following", body.friends_count, true)
            .addField("❯ Tweets", body.statuses_count, true)
            .addField("❯ Protected", body.protected ? "Yes" : "No", true)
            .addField("❯ Verified", body.verified ? "Yes" : "No", true)
            .addField("❯ Created", new Date(body.created_at).toDateString(), true)
            .addField("❯ Latest Tweet", body.status ? body.status.text : "???")
            .setFooter(`Info requested by ${message.author.tag}`, message.author.displayAvatarURL)
            .setTimestamp();

        return message.channel.send({ embed });
    } catch (error) {
        this.client.logger.error(error);
        if (error.statusCode === 401) await this.fetchToken();
        if (error.statusCode === 404) return message.channel.send(texts.general.noResultsFound);
        return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
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

module.exports = Twitter;
