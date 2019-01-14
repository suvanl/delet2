// Copyright (c) 2019 An Idiot's Guide. All rights reserved. MIT license.
// https://github.com/AnIdiotsGuide/guidebot-class

// This command is to modify/edit guild configuration. Perm Level 3 for admins
// and owners only. Used for changing prefixes and role names and such.

// Note the use of destructuring here. instead of `args` we have:
// [action, key, ...value]
// This gives the equivalent of either:
// const action = args[0]; const key = args[1]; const value = args.slice(2);
// OR the same as:
// const [action, key, ...value] = args;

const Command = require("../../base/Command.js");
const { currencies } = require("../../util/data.js");
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
    const overrides = this.client.settings.get(message.guild.id);
    if (!this.client.settings.has(message.guild.id)) this.client.settings.set(message.guild.id, {});
  
    // Secondly, if a user does `set edit <key> <new value>`, we need to change the key
    if (action && action.toLowerCase() === "edit") {
      if (!key) return message.reply("you must specify a key to edit.");
      if (!settings[key]) return message.reply("this key does not exist in my settings.");

      const joinedValue = value.join(" ");
      if (joinedValue.length < 1) return message.reply("you must specify a new value for this setting.");
      if (joinedValue === settings[key]) return message.reply("this setting already has that value.");

      // If the guild does not have any overrides, initialise it
      if (!this.client.settings.has(message.guild.id)) this.client.settings.set(message.guild.id, {});

      // GENERAL CHECKS

      // Channels
      if (key.includes("Channel")) {
        if (joinedValue.startsWith("<" || "#")) return message.channel.send("Please specify a channel **name**, not the channel itself.\nE.g. `general`, not `#general`.");

        const channel = message.guild.channels.find(c => c.name === joinedValue);
        if (!channel) return message.channel.send(`A channel with the name "${joinedValue}" does not exist on this server.`);
      }

      // Roles
      if (key.includes("Role")) {
        if (joinedValue.startsWith("<" || "@")) return message.channel.send("Please specify a role **name**, not the role itself.\nE.g. `Mod`, not `@Mod`.");

        const role = message.guild.roles.find(c => c.name === joinedValue);
        if (!role) return message.channel.send(`The role "${joinedValue}" does not exist on this server.`);
      }

      // SPECIFIC CHECKS

      // Language
      if (key === "language") {
        const validLanguages = fs.readdirSync("locales");
        const langs = validLanguages.map(l => {
          return l.slice(0, -3);
        });

        if (!langs.includes(joinedValue)) return message.channel.send(`"${joinedValue}" is not a valid/settable language.`);
      }

      // Currency
      if (key === "currency") {
        if (!currencies.includes(joinedValue)) return message.channel.send(`"${joinedValue}" is not a valid/settable currency.\nThe valid currencies are: ${currencies.map(c => "`" + c + "`").join(", ")}.`);
      }

      // systemNotice and welcomeEnabled
      if (key === "systemNotice" || key === "welcomeEnabled") {
        switch (joinedValue) {
          case "true":
          break;

          case "false":
          break;

          default: return message.channel.send("This key can only be set to `true` or `false`.");
        }
      }

      settings[key] = joinedValue;

      // Modify overrides directly
      this.client.settings.set(message.guild.id, joinedValue, key);
      message.reply(`${key} was successfully edited to **${joinedValue}**.`);
    } else
  
    // If a user does `set del <key>`, let's ask the user if they're sure...
    if (action && action.toLowerCase() === "del" || action === "reset") {
      if (!key) return message.reply("you must specify a key to reset.");
      if (!settings[key]) return message.reply("this key does not exist in my settings.");
      if (!overrides[key]) return message.reply("this key does not have an override and is already using defaults.");
      
      // Throw the 'are you sure?' text at them.
      const response = await this.client.awaitReply(message, `Are you sure you want to reset \`${key}\` to the default \`${defaults[key]}\`? (y/n)`);

      // If they respond with y or yes, continue.
      if (["y", "yes"].includes(response)) {

        // We reset the `key` here.
        this.client.settings.delete(message.guild.id, key);
        message.reply(`\`${key}\` was successfully reset to default.`);
      } else

      // If they respond with n or no, we inform them that the action has been cancelled.
      if (["n", "no", "cancel"].includes(response)) {
        message.reply(`your setting for \`${key}\` remains at \`${settings[key]}\`.`);
      }
    } else
  
    // Using `set get <key>` we simply return the current value for the guild.
    if (action && action.toLowerCase() === "get") {
      if (!key) return message.reply("you must specify a key to view.");
      if (!settings[key]) return message.reply("this key does not exist in my settings.");
      message.reply(`the value of \`${key}\` is currently \`${settings[key]}\`.`);
      
    } else {
      // Otherwise, the default action is to return the whole configuration
      const array = [];
      Object.entries(settings).forEach(([key, value]) => {
        array.push(`${key}${" ".repeat(20 - key.length)}::  ${value}`); 
      });
      await message.channel.send(stripIndents`
      = Current Server Settings =
      ${array.join("\n")}`, { code: "asciidoc" });
    }
  }
}

module.exports = Set;
