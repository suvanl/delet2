const Command = require("../../base/Command.js");
const { RichEmbed } = require("discord.js");
const fetch = require("node-fetch");
const moment = require("moment");

class GitHub extends Command {
    constructor(client) {
      super(client, {
        name: "github",
        description: "Returns information about the specified GitHub repository.",
        category: "Information",
        usage: "github <repo-owner> <repo-name>",
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
        
        fetch(`https://api.github.com/repos/${owner}/${repo}`)
            .then(res => res.json())
            .then(data => {
                const embed = new RichEmbed()
                    .setColor(0)
                    .setThumbnail(data.owner.avatar_url)
                    .setAuthor("GitHub", "https://vgy.me/B4CvF1.png")
                    .setTitle(data.full_name)
                    .setURL(data.html_url)
                    .setDescription(data.description ? data.description : "[No description set]")
                    .addField("❯ Created", moment.utc(data.created_at).format("DD/MM/YYYY HH:mm:ss"), true)
                    .addField("❯ Last updated", moment.utc(data.updated_at, "YYYYMMDD").fromNow(), true)
                    .addField("❯ Stars", data.stargazers_count, true)
                    .addField("❯ Forks", data.forks, true)
                    .addField("❯ Issues", data.open_issues, true)
                    .addField("❯ Language", data.language || "No language", true)
                    .addField("❯ License", data.license ? data.license.spdx_id : "Unlicensed", true)
                    .addField("❯ Archived?", data.archived.toString().toProperCase(), true)
                    .setFooter("All times are UTC")
                    .setTimestamp();
                return message.channel.send({ embed });
            })
            .catch(error => {
                if (error.status === 404) return message.channel.send(texts.general.noResultsFound);
                this.client.logger.error(error);
                return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
            });
    }
}

module.exports = GitHub;
