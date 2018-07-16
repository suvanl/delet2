const Command = require("../../base/Command.js");
const shortener = require("isgd");

class Shorten extends Command {
  constructor(client) {
    super(client, {
      name: "shorten",
      description: "Shortens the specified link.",
      category: "Utility",
      usage: "shorten [URL] [custom title]",
      aliases: ["isgd", "urlshortner", "shorten-url"]
    });
  }

  async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
      if (!args[0]) return message.channel.send(texts.cmd.noLink);
      if (!args[1]) {
          shortener.shorten(args[0], function(res) {
              if (res.startsWith("Error:")) return message.channel.send(texts.cmd.invalidURL);
              message.channel.send(`${texts.cmd.shortened} **<${res}>**.`);
          });
      } else {
          shortener.custom(args[0], args[1], function(res) {
              if (res.startsWith("Error:")) return message.channel.send(texts.general.error.replace(/{{err}}/g, res.slice(7)));
              message.channel.send(`${texts.cmd.shortened} **<${res}>**.`);
          });
      }
  }
}

module.exports = Shorten;
