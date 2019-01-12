const Command = require("../../base/Command.js");
const fetch = require("node-fetch");

class Joke extends Command {
    constructor(client) {
      super(client, {
        name: "joke",
        description: "Tells a general or programming-related joke.",
        category: "Fun",
        usage: "joke",
        aliases: ["humour", "humor"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
      fetch("https://official-joke-api.appspot.com/random_joke")
        .then(res => res.json())
        .then(data => message.channel.send(`${data.setup} ${data.punchline}`))
        .catch(error => {
          this.client.logger.error(error);
          return message.channel.send(texts.general.error.replace(/{{err}}/g, error));
        });
    }
}

module.exports = Joke;
