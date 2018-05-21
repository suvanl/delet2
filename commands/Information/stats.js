const Command = require("../../base/Command.js");
const pkg = require("../../package.json");
const { version } = require("discord.js");
const { stripIndents } = require("common-tags");
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
    
    let platform;
    let build;

    if (process.platform === "win32") {
      platform = "windows";
      build = "Development";
    } else if (process.platform === "linux") {
      platform = process.platform;
      build = "Production";
      // Note that the above two `if`/`else if` statements are specific to delet, as
      // delet's development build runs on Windows, and delet's production server runs Linux.
    } else {
      platform = process.platform;
      build = "Unknown";
    }
    
    message.channel.send(stripIndents`
    = STATISTICS =
      • Users      :: ${this.client.users.size.toLocaleString()}
      • Servers    :: ${this.client.guilds.size.toLocaleString()}
      • Channels   :: ${this.client.channels.size.toLocaleString()}
      • Uptime     :: ${duration}
      • RAM usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
      • Build      :: ${build}
      • Platform   :: ${platform.toProperCase()}

    = VERSIONS =
      • delet      :: v${pkg.version}
      • Discord.js :: v${version}
      • Node.js    :: ${process.version}`, {code: "asciidoc"});
  }
}

module.exports = Stats;
