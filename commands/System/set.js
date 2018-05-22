// This command is to modify/edit guild configuration. Perm Level 3 for admins
// and owners only. Used for changing prefixes and role names and such.

// Note the use of destructuring here. instead of `args` we have:
// [action, key, ...value]
// This gives the equivalent of either:
// const action = args[0]; const key = args[1]; const value = args.slice(2);
// OR the same as:
// const [action, key, ...value] = args;

const Command = require("../../base/Command.js");
const { stripIndents } = require("common-tags");
const fs = require("fs");

class Set extends Command {
  constructor(client) {
    super(client, {
      name: "set",
      description: "Allows you to view or change settings for your server.",
      category: "System",
      usage: "set <view|get|edit> <key> <value>",
      guildOnly: true,
      aliases: ["setting", "settings"],
      permLevel: "Administrator"
    });
  }

  async run(message, [action, key, ...value], level) { // eslint-disable-line no-unused-vars
    if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);

    // Firstly, we need to retrieve current guild settings
    const settings = message.settings;
    const defaults = this.client.settings.get("default");
  
    // Secondly, if a user does `set edit <key> <new value>`, we need to change the key
    if (action && action.toLowerCase() === "edit") {
      if (!key) return message.reply("you must specify a key to edit.");
      if (!settings[key]) return message.reply("this key does not exist in my settings.");
      if (value.length < 1) return message.reply("you must specify a new value for this setting.");

      // GENERAL CHECKS

      // Channels
      if (key.includes("Channel")) {
        if (value.join(" ").startsWith("<" || "#")) return message.channel.send("Please specify a channel **name**, not the channel itself.\nE.g. `general`, not `#general`.");

        const channel = message.guild.channels.find("name", value.join(" "));
        if (!channel) return message.channel.send(`The channel "${value.join(" ")}" does not exist on this server.`);
      }

      // Roles
      if (key.includes("Role")) {
        if (value.join(" ").startsWith("<" || "@")) return message.channel.send("Please specify a role **name**, not the role itself.\nE.g. `Mod`, not `@Mod`.");

        const role = message.guild.roles.find("name", value.join(" "));
        if (!role) return message.channel.send(`The role "${value.join(" ")}" does not exist on this server.`);
      }

      // SPECIFIC CHECKS

      // Language
      if (key === "language") {
        const validLanguages = fs.readdirSync("locales");
        const langs = validLanguages.map(function(l) {
          return l.slice(0, -3);
        });

        if (!langs.includes(value.join(" "))) return message.channel.send(`"${value.join(" ")}" is not a valid/settable language.`);
      }

      // TODO: currency & true/false checks

      settings[key] = value.join(" ");

      this.client.settings.set(message.guild.id, settings);
      message.reply(`${key} was successfully edited to ${value.join(" ")}`);
    } else
  
    // Thirdly, if a user does `set del <key>`, let's ask the user if they're sure...
    if (action && action.toLowerCase() === "del" || action === "reset") {
      if (!key) return message.reply("you must specify a key to reset.");
      if (!settings[key]) return message.reply("this key does not exist in my settings.");
      
      // Throw the 'are you sure?' text at them.
      const response = await this.client.awaitReply(message, `Are you sure you want to reset \`${key}\` to the default \`${defaults[key]}\`?`);

      // If they respond with y or yes, continue.
      if (["y", "yes"].includes(response)) {

        // We reset the `key` here.
        delete settings[key];
        this.client.settings.set(message.guild.id, settings);
        message.reply(`\`${key}\` was successfully reset to default.`);
      } else

      // If they respond with n or no, we inform them that the action has been cancelled.
      if (["n","no","cancel"].includes(response)) {
        message.reply(`your setting for \`${key}\` remains at \`${settings[key]}\`.`);
      }
    } else
  
    // Using `set get <key>` we simply return the current value for the guild.
    if (action && action.toLowerCase() === "get") {
      if (!key) return message.reply("you must specify a key to view.");
      if (!settings[key]) return message.reply("this key does not exist in my settings.");
      message.reply(`the value of ${key} is currently ${settings[key]}`);
      
    } else {
      // Otherwise, the default action is to return the whole configuration in JSON format (to be prettified!)
      const array = [];
      Object.entries(settings).forEach(([key, value]) => {
        array.push(`${key}${" ".repeat(20 - key.length)}::  ${value}`); 
      });
      await message.channel.send(stripIndents`
      = Current Server Settings =
      ${array.join("\n")}`, {code: "asciidoc"});
    }
  }
}

module.exports = Set;
