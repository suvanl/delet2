const Command = require("../../base/Command.js");
const cleverbot = require("cleverbot.io");
const { CLEVERBOT_API_USER, CLEVERBOT_API_KEY } = process.env;
const bot = new cleverbot(CLEVERBOT_API_USER, CLEVERBOT_API_KEY);

class CleverBot extends Command {
    constructor(client) {
      super(client, {
        name: "cleverbot",
        description: "Talks to cleverbot!",
        category: "Fun",
        usage: "cleverbot <message>",
        aliases: ["cb"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        bot.setNick("delet");
        bot.create(function() {
            const query = args.join(" ");
            if (!query) return message.channel.send("You must provide a message to say to me.");

            message.channel.startTyping();

            bot.ask(query, function(err, response) {
                message.channel.send(response.includes("Cleverbot") ? response.replace(/Cleverbot/g, "delet") : response);
                message.channel.stopTyping(true);
                
                if (err) {
                    this.client.logger.error(err);
                    return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
                }
            });
        });
    }
}

module.exports = CleverBot;
