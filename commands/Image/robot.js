const Command = require("../../base/Command.js");
const fetch = require("node-fetch");

class Robot extends Command {
    constructor(client) {
      super(client, {
        name: "robot",
        description: "Generates a picture of a robot from some given text.",
        category: "Image",
        usage: "robot <text>",
        aliases: ["robohash"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        const query = args.join(" ");
        if (!query) return message.channel.send("You must some text to use to generate the robot.");
        if (query.match(/[-!$%^&*()_+|~=`{}[\]:";'<>?,./]/g)) return message.channel.send("Your query cannot include symbols.");

        message.channel.startTyping();

        fetch(`https://robohash.org/${encodeURIComponent(query)}.png`)
          .then(res => message.channel.send({ files: [{ attachment: res.body, name: `${query}.png` }] })
          .catch(error => {
            this.client.logger.error(error);
            message.channel.stopTyping(true);
            return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
          }));

        message.channel.stopTyping(true);
    }
}

module.exports = Robot;
