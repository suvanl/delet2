const Command = require("../../base/Command.js");
const fetch = require("node-fetch");

class ChangeMyMind extends Command {
    constructor(client) {
      super(client, {
        name: "changemymind",
        description: "Change my mind...",
        category: "Image",
        usage: "changemymind <text>",
        aliases: ["change-my-mind", "change"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
      let text = args.join(" ");
      if (!text) return message.channel.send("You must provide some text to appear on the image.");
      else text = encodeURIComponent(args.join(" "));

      message.channel.startTyping();

      fetch(`https://nekobot.xyz/api/imagegen?type=changemymind&text=${text}`)
        .then(res => res.json())
        .then(data => message.channel.send({ file: data.message }))
        .catch(error => {
          this.client.logger.error(error);
          message.channel.stopTyping(true);
          return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
        });
        
        message.channel.stopTyping(true);
    }
}

module.exports = ChangeMyMind;
