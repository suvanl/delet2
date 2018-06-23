// The HELP command is used to display every command's name and description
// to the user, so that they can see what commands are available. The help
// command is also filtered by level, so if a user does not have access to
// a command, it is not shown to them. If a command name is given with the
// help command, its extended help is shown.

const Command = require("../../base/Command.js");
class Help extends Command {
  constructor(client) {
    super(client, {
      name: "help",
      description: "Displays all commands available for you.",
      usage: "help [command]",
      aliases: ["h", "halp"]
    });
  }

  async run(message, args, level, settings, texts) {
    // Shows all filtered commands, if no specific command is called.
    if (!args[0]) {
      // Loads guild settings (for prefixes and eventually per-guild tweaks)
      const settings = message.settings;
      
      // Filters all commands by which are available for the user's level, using the <Collection>.filter() method.
      const myCommands = message.guild ? this.client.commands.filter(cmd => this.client.levelCache[cmd.conf.permLevel] <= level) : this.client.commands.filter(cmd => this.client.levelCache[cmd.conf.permLevel] <= level &&  cmd.conf.guildOnly !== true);
      
      // Gets command names only, and uses that array to get the longest name.
      // This allows the output to be nicely aligned.
      const commandNames = myCommands.keyArray();
      const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
      let currentCategory = "";
      let output = `= Command List =\n\n[Use ${settings.prefix}help <commandname> for details]\n`;
      const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
      sorted.forEach( c => {
        const cat = c.help.category.toProperCase();
        if (currentCategory !== cat) {
          output += `\u200b\n== ${cat} ==\n`;
          currentCategory = cat;
        }
        output += `${settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
      });

      let image;
      if (message.channel.type === "text" && message.guild.me.hasPermission("ATTACH_FILES")) {
        image = "https://vgy.me/k6Qkv8.png";
      } else {
        image = null;
      }

      // Sends the output to the message author, and catches any errors that occur
        message.channel.send(`${message.author}, sending a list of commands available for your permission level to your DMs... 📝`);
        message.author.send(output, { code:"asciidoc", split: { char: "\u200b" } })
          .catch(e => {
            if (e.toString().startsWith("DiscordAPIError: Cannot send messages to this user")) {
              return message.channel.send(texts.help.dmNotSent.replace(/{{author}}/g, message.author), {
                file: image
              });
            } else {
              this.client.logger.error(e);
              return message.channel.send(texts.general.error.replace(/{{err}}/g, e.message));
            }
          });
        
        if (message.channel.type === "dm") {
          await this.client.wait(2000);
          message.author.send(texts.help.dmCommands);
        }
      } else {
        // Shows help for individual commands.
        let command = args[0];
        const settings = message.settings;
        
        if (this.client.commands.has(command)) {
          command = this.client.commands.get(command);
          if (level < this.client.levelCache[command.conf.permLevel]) return;          
          message.channel.send(`= ${command.help.name} = \n${command.help.description}\n${texts.help.usage}   :: ${settings.prefix}${command.help.usage}\n${texts.help.aliases} :: ${command.conf.aliases.map(a => settings.prefix + a).join(", ")}`, { code:"asciidoc" });
        }
      }
    }
}

module.exports = Help;
