// Copyright (c) 2019 An Idiot's Guide. All rights reserved. MIT license.
// https://github.com/AnIdiotsGuide/guidebot-class

const Command = require("../../base/Command.js");
const pkg = require("../../package.json");
const { NODE_ENV } = process.env;
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
    
    message.channel.send(stripIndents`
    = STATISTICS =
      • Users      :: ${this.client.users.size.toLocaleString()}
      • Servers    :: ${this.client.guilds.size.toLocaleString()}
      • Channels   :: ${this.client.channels.size.toLocaleString()}
      • Uptime     :: ${duration}
      • RAM usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
      • Build      :: ${NODE_ENV.toProperCase()}
      • Platform   :: ${process.platform === "win32" ? "Windows" : process.platform.toProperCase()}

    = VERSIONS =
      • delet      :: v${pkg.version}
      • Discord.js :: v${version}
      • Node.js    :: ${process.version}`, { code: "asciidoc" });
  }
}

module.exports = Stats;
