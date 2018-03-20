// The MESSAGE event runs anytime a message is received
// Due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {

    // Ignores other bots' messages. This makes the bot ignore itself
    // and not get into a "botception" spam loop.
    if (message.author.bot) return;

    // Grabs the settings for this server from the PersistentCollection
    // If there is no guild, get default conf (DMs).
    const settings = message.guild ? this.client.getSettings(message.guild.id) : this.client.settings.get("default");

    // For ease of use in commands and functions, the settings are attached
    // to the message object, so `message.settings` is accessible.
    message.settings = settings;

    // Ignores any messages that don't start with the prefix set in the configuration file.
    if (message.content.indexOf(settings.prefix) !== 0) return;

    // Separates command name from args.
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Get the user or member's permission level from the elevation.
    const level = this.client.permlevel(message);

    // Check whether the command, or alias, exist in the collections defined
    // in app.js.
    const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
    // using this const varName = thing OR other-thing; is a pretty efficient
    // and clean way to grab one of 2 values.
    if (!cmd) return;

    // Some commands may not be usable in DMs. This check prevents those commands from running
    // and returns a friendly error message.
    if (cmd && !message.guild && cmd.conf.guildOnly)
      return message.channel.send("This command is unavailable via direct message. Please run this command in a guild (server).");

    if (level < this.client.levelCache[cmd.conf.permLevel]) {
      if (settings.systemNotice === "true") {
        return message.channel.send(`You do not have permission to use this command.
Your permission level is ${level} (${this.client.config.permLevels.find(l => l.level === level).name}), and this command requires level ${this.client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel}).`);
      } else {
        return;
      }
    }
      
    // To simplify message arguments, the author's level is now put on level (not member, so it is supported in DMs)
    // The "level" command module argument will be deprecated in the future.
    message.author.permLevel = level;

    message.flags = [];
    while (args[0] &&args[0][0] === "-") {
      message.flags.push(args.shift().slice(1));
    }
    
    // If the command exists, AND the user has permission to use it, this will run the command.
    this.client.logger.log(`${this.client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, "cmd");
    cmd.run(message, args, level);
  }
};