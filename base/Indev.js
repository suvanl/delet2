class Indev {
  constructor(client, {
    name = null,
    description = "No description provided.",
    category = "Miscellaneous",
    usage = "No usage provided.",
    enabled = false,
    guildOnly = false,
    aliases = new Array(),
    permLevel = "Bot Owner"
  }) {
    this.client = client;
    this.conf = { enabled, guildOnly, aliases, permLevel };
    this.help = { name, description, category, usage };
  }
}
module.exports = Indev;
