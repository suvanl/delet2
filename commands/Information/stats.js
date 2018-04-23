const Command = require("../../base/Command.js");
const pkg = require("../../package.json");
const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

class Stats extends Command {
  constructor(client) {
    super(client, {
      name: "stats",
      description: "Sends some useful bot statistics.",
      category: "Information",
      usage: "stats",
      aliases: ["statistics"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const duration = moment.duration(this.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
    message.channel.send(`= STATISTICS =
  • Users      :: ${this.client.users.size.toLocaleString()}
  • Servers    :: ${this.client.guilds.size.toLocaleString()}
  • Channels   :: ${this.client.channels.size.toLocaleString()}
  • Uptime     :: ${duration}
  • RAM usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
  • Version    :: v${pkg.version}
  • Platform   :: ${process.platform.toProperCase()}
  • Discord.js :: v${version}
  • Node.js    :: ${process.version}`, {code: "asciidoc"});
  }
}

module.exports = Stats;
