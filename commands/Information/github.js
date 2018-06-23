const Command = require("../../base/Command.js");
const { RichEmbed } = require("discord.js");
const snekfetch = require("snekfetch");
const moment = require("moment");

class GitHub extends Command {
    constructor(client) {
      super(client, {
        name: "github",
        description: "Returns information about the specified GitHub repository.",
        category: "Information",
        usage: "github",
        aliases: ["repo", "repo-info", "repository-info"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        let owner = args[0];
        if (!owner) return message.channel.send("You must provide the repository owner's username or organisation name.");
        else owner = encodeURIComponent(args[0]);

        let repo = args[1];
        if (!repo) return message.channel.send("You must provide a repository name to search for.");
        else repo = encodeURIComponent(args[1]);
        
        try {
            const { body } = await snekfetch.get(`https://api.github.com/repos/${owner}/${repo}`);

            const embed = new RichEmbed()
                .setColor(0)
                .setThumbnail(body.owner.avatar_url)
                .setAuthor("GitHub", "https://vgy.me/B4CvF1.png")
                .setTitle(body.full_name)
                .setURL(body.html_url)
                .setDescription(body.description ? body.description : "[No description set]")
                .addField("❯ Created", moment.utc(body.created_at).format("DD/MM/YYYY HH:mm:ss"), true)
                .addField("❯ Last updated", moment.utc(body.updated_at, "YYYYMMDD").fromNow(), true)
                .addField("❯ Stars", body.stargazers_count, true)
                .addField("❯ Forks", body.forks, true)
                .addField("❯ Issues", body.open_issues, true)
                .addField("❯ Language", body.language || "No language", true)
                .addField("❯ License", body.license ? body.license.spdx_id : "Unlicensed", true)
                .addField("❯ Archived?", body.archived.toString().toProperCase(), true)
                .setFooter("All times are UTC")
                .setTimestamp();

            return message.channel.send({embed});
        } catch (error) {
            if (error.status === 404) return message.channel.send(texts.noResultsFound);

            this.client.logger.error(error);
            return message.channel.send(texts.error.replace(/{{err}}/g, error.message));
        }
    }
}

module.exports = GitHub;
