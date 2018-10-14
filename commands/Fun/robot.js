const Command = require("../../base/Command.js");
const { get } = require("snekfetch");

class Robot extends Command {
    constructor(client) {
      super(client, {
        name: "robot",
        description: "Generates a picture of a robot from some given text.",
        category: "Fun",
        usage: "robot <text>",
        aliases: ["robohash"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        const query = args.join(" ");
        if (!query) return message.channel.send("You must some text to use to generate the robot.");
        if (query.match(/[-!$%^&*()_+|~=`{}[\]:";'<>?,./]/g)) return message.channel.send("Your query cannot include symbols.");

        message.channel.startTyping();

        try {
          const { raw } = await get(`https://robohash.org/${query}.png`);
          message.channel.stopTyping();
          return message.channel.send(`*"${query}"*`, { file: raw });
        } catch (error) {
          this.client.logger.error(error);
          return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
        }
    }
}

module.exports = Robot;
