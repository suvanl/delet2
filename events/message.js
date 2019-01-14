// Copyright (c) 2019 An Idiot's Guide. All rights reserved. MIT license.
// https://github.com/AnIdiotsGuide/guidebot-class

// The MESSAGE event runs anytime a message is received.
// Due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {
    // Ignores other bots' messages. This makes the bot ignore itself
    // and not get into a spam loop with other bots (or even itself).
    if (message.author.bot) return;

    // Cancels any attempts to run commands in servers where the bot cannot
    // respond to the user, due to insufficient permissions.
    if (message.channel.type === "text" && !message.guild.me.hasPermission("SEND_MESSAGES")) return;

    // Grabs the settings for this server from the Enmap
    // If there is no guild, get default conf (for DMs).
    const settings = message.guild ? this.client.getSettings(message.guild) : this.client.getSettings("default");

    // For ease of use in commands and functions, the settings are attached
    // to the message object, so `message.settings` is accessible.
    message.settings = settings;

    // Loads in per-locale messages
    const texts = require(`../locales/${settings.language}`);

    // Ticks point 10 in the list of best practices (https://github.com/meew0/discord-bot-best-practices).
    // Useful for users who don't know delet's prefix, and are using delet for the first time.
    const mention = `<@${this.client.user.id}>`;
    if (message.content.startsWith(mention) && message.content.toLowerCase().includes("help")) {
      return message.channel.send(texts.help.mentionHelp.replace(/{{prefix}}/g, settings.prefix));
    }

    // Ignores any messages that don't start with the prefix set in the configuration file.
    if (message.content.indexOf(settings.prefix) !== 0) return;

    // Separates command name from args.
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Gets the user or member's permission level from the elevation.
    const level = this.client.permlevel(message);

    // Checks whether the command or alias exists in the collections defined
    // in index.js.
    const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
    // using this const varName = thing OR other-thing; is a pretty efficient
    // and clean way to grab one of 2 values.
    if (!cmd) return;

    // Some commands may not be usable in DMs. This check prevents those commands from running
    // and returns a friendly error message.
    if (cmd && !message.guild && cmd.conf.guildOnly)
      return message.channel.send(texts.general.guildOnly);

    if (cmd && cmd.conf.enabled === false)
      return message.channel.send(texts.general.cmdDisabled);

    // Prevents users from running commands that aren't available for their permLevel.
    if (level < this.client.levelCache[cmd.conf.permLevel]) {
      if (settings.systemNotice.toLowerCase() === "true") {
        return message.channel.send(`You do not have permission to use this command.\nYour permission level is ${level} (${this.client.config.permLevels.find(l => l.level === level).name}), and this command requires level ${this.client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel}).`);
      } else {
        return;
      }
    }
    
    // To simplify message arguments, the author's level is now put on level (not member, so it is supported in DMs)
    // The "level" command module argument will be deprecated in the future.
    message.author.permLevel = level;

    message.flags = [];
    while (args[0] && args[0][0] === "-") {
      message.flags.push(args.shift().slice(1));
    }
    
    // If the command exists, AND the user has permission to use it, this will run the command.
    this.client.logger.log(`${this.client.config.permLevels.find(l => l.level === level).name} ${message.author.tag} (${message.author.id}) ran command ${cmd.help.name}`, "cmd");
    cmd.run(message, args, level, settings, texts);
  }
};
