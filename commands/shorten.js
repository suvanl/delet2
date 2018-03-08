const Command = require("../base/Command.js");
const shortener = require("isgd");

class Shorten extends Command {
  constructor(client) {
    super(client, {
      name: "shorten",
      description: "Shortens the specified link.",
      category: "Utility",
      usage: "shorten [URL] [custom title]"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
      if (!args[0]) return message.channel.send("Please provide a URL (link) to shorten.");
      if (!args[1]) {
          shortener.shorten(args[0], function(res) {
              if (res.startsWith("Error:")) return message.channel.send("Invalid URL (link).");
              message.channel.send(`Your shortened link: **<${res}>**.`);
          });
      } else {
          shortener.custom(args[0], args[1], function(res) {
              if (res.startsWith("Error:")) return message.channel.send(`An error occurred:\n\`\`\`${res}\`\`\``);
              message.channel.send(`Your shortened link: **<${res}>**.`);
          });
      }
  }
}

module.exports = Shorten;
