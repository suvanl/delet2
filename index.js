/*
delet - a multipurpose Discord bot
© suvanl, nitramleo (of the DS Development Group) 2017 - 2018
Licensed under the GPL-3.0 license.

https://delet.js.org/
*/

// This will check if the Node.js version the system is running is the required
// Node.js version (9.x.x) and if it isn't, it will throw the following error to say so.

if (process.version.slice(1).split(".")[0] < 9) throw new Error("Node.js 9.0.0 or higher is required. Update Node on your system.");

// Loads up the Discord.js library
const Discord = require("discord.js");

// We also load/import the rest of the modules we need in this file:
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const klaw = require("klaw");
const path = require("path");

class Delet extends Discord.Client {
  constructor(options) {
    super(options);

    // Loads the config.js file that contains the token and prefix values.
    this.config = require("./config.js");
    // client.config.token = bot's token
    // client.config.prefix = bot's message prefix

    // Aliases and commands are put in collections where they can be read from,
    // catalogued, listed, etc.
    this.commands = new Enmap();
    this.aliases = new Enmap();

    // Integrates the use of the Enhanced Map module, which essentially
    // saves a collection to disk. This is used for per-server configs,
    // and makes things extremely easy for this purpose.
    this.settings = new Enmap({ provider: new EnmapLevel({ name: "settings" }) });

    // Requiring the Logger class for easy console logging
    this.logger = require("./util/Logger");
  }

  // Permission level function
  // NOTE: don't give level 10 to anyone, unless it is a command that ONLY the bot owner should be able to run.

  permlevel(message) {
    let permlvl = 0;

    const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  }

  
  // COMMAND LOAD AND UNLOAD
  // To simplify the loading and unloading of commands from multiple locations
  // including the index.js load loop, and the reload function, these 2 ensure
  // that unloading happens in a consistent manner across the board.

  loadCommand(commandPath, commandName) {
    try {
      const props = new (require(`${commandPath}${path.sep}${commandName}`))(client);
      client.logger.log(`Loading command: ${props.help.name}. 👌`, "log");
      props.conf.location = commandPath;
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
  }

  async unloadCommand(commandPath, commandName) {
    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias.`;

    if (command.shutdown) {
      await command.shutdown(client);
    }
    delete require.cache[require.resolve(`${commandPath}${path.sep}${commandName}.js`)];
    return false;
  }

  // SETTINGS FUNCTIONS
  // These functions are used by any and all location in the bot that wants to either
  // read the current *complete* guild settings (default + overrides, merged) or that
  // wants to change settings for a specific guild.

  // getSettings merges the client defaults with the guild settings. Guild settings in
  // Enmap should only have *unique* overrides that are different from defaults.
  getSettings(id) {
    const defaults = client.settings.get("default");
    let guild = client.settings.get(id);
    if (typeof guild != "object") guild = {};
    const returnObject = {};
    Object.keys(defaults).forEach((key) => {
      returnObject[key] = guild[key] ? guild[key] : defaults[key];
    });
    return returnObject;
  }

  // writeSettings overrides, or adds, any configuration item that is different
  // than the defaults. This ensures less storage wasted and to detect overrides.
  writeSettings(id, newSettings) {
    const defaults = client.settings.get("default");
    let settings = client.settings.get(id);
    if (typeof settings != "object") settings = {};
    for (const key in newSettings) {
      if (defaults[key] !== newSettings[key]) {
        settings[key] = newSettings[key];
      } else {
        delete settings[key];
      }
    }
    client.settings.set(id, settings);
  }
}

// This is the client. Can sometimes be called `bot` or `self` too,
// in other bots. Either way, `client.something`, or `bot.something`,
// is used, this is what is being referred to - the client.
const client = new Delet();
console.log(client.config.permLevels.map(p => `${p.level} : ${p.name}`));

// Starts by getting some useful functions that will be used
// throughout the bot, such as logs and elevation features.
require("./modules/functions.js")(client);

// Carrying out fancy Node 8 async/await stuff here, and to do that
// stuff needs to be wrapped in an anonymous function.

const init = async () => {

  // Now loads **commands** into memory, as a collection, so they're accessible
  // here and everywhere else.
  klaw("./commands").on("data", (item) => {
    const cmdFile = path.parse(item.path);
    if (!cmdFile.ext || cmdFile.ext !== ".js") return;
    const response = client.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
    if (response) client.logger.error(response);
  });

  // Then loads events, which will include the `message` and `ready` event.
  const evtFiles = await readdir("./events/");
  client.logger.log(`Loading a total of ${evtFiles.length} events.`, "log");
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    const event = new (require(`./events/${file}`))(client);
    //
    client.on(eventName, (...args) => event.run(...args));
    delete require.cache[require.resolve(`./events/${file}`)];
  });

  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  // Logs the client in to Discord.
  client.login(client.config.token);

  // Ends the top-level async/await function.
};

init();

client.on("disconnect", () => client.logger.warn("Bot is disconnecting..."))
  .on("reconnect", () => client.logger.log("Bot reconnecting...", "log"))
  .on("error", e => client.logger.error(e))
  .on("warn", info => client.logger.warn(info));