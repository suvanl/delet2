const Command = require("../../base/Command.js");
const { RichEmbed } = require("discord.js");

class EightBall extends Command {
  constructor(client) {
    super(client, {
      name: "8ball",
      description: "Consults my magic 8-ball!",
      category: "Fun",
      usage: "8ball [question]",
      aliases: ["8-ball", "eightball", "fortune"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
      const settings = message.guild ? this.client.getSettings(message.guild.id) : this.client.settings.get("default");

      // SUBMITTING OUTCOMES
      // If you wish to submit a outcome, please fork this repository, add the outcome to the "outcomes" array, and
      // create a pull request. Please add a comment next to it, stating whether it is positive, negative, or neutral.
      // If you're unsure, leave it blank. If you do state if it's positive, neutral or negative, please update the
      // "OUTCOME TYPES" comments accordingly. 
      
      // Please ensure your outcome has an "opposite" outcome to it too, so the number of positive and negative outcomes
      // match. Unlike a regular magic 8 ball, delet's one has an equal number of positive and negative outcomes.

      // OUTCOME TYPES
      //
      // Positive: 14
      // Neutral:  7
      // Negative: 14

      const outcomes = [
        "Yes.", // Positive
        "No.", // Negative
        "Maybe.", // Neutral
        "Most certainly!", // Positive
        "Definitely not.", // Negative
        "Undoubtedly.", // Positive
        "Affirmative.", // Positive
        "Negative.", // Negative
        "No way, José!", // Negative
        "Only on Wednesdays.", // Neutral
        "If you are Ethan, yes. Otherwise, no.", // Neutral
        "no fucc u", // Negative
        "Certainly not.", // Negative
        "Seems like my magic 8 ball is broken... Try again.",
        "I sure hope so!", // Positive
        "There is a good chance.", // Positive
        "Quite likely.", // Positive
        "I think so.", // Positive
        "I hope not.", // Negative
        "I hope so.", // Positive
        "Possibly.", // Neutral
        "Forget about it.", // Negative
        "http://i.imgur.com/n7A21Jq.gif", // Negative
        "sry gtg", // Neutral
        "I highly doubt it.", // Negative
        "My sources say no.", // Negative
        "My sources say yes.", // Positive
        "All signs point to yes.", // Positive
        "delet this and try again", // neutral
        "If this is about Suvan being gay, no. If not, yes.", // positive
        // below sourced from https://en.wikipedia.org/wiki/Magic_8-Ball#Possible_answers
        "Outlook not so good.", // negative
        "Outlook good.", // positive
        // above sourced from https://en.wikipedia.org/wiki/Magic_8-Ball#Possible_answers
        "You may rely on it.", // Positive
        "Don't count on it.",
        "maybe idk lmao", // neutral
        "who gives a shit lul", // negative
        "No. Why would you even ask such a thing?" // Negative
      ];

      if (args[0]) {
        const randomOutcome = outcomes.random();
        try {
          if (randomOutcome.startsWith("http://i.imgur.com/")) {
            const embed = new RichEmbed()
              .setTitle("Magic 8 Ball 🎱")
              .setImage(randomOutcome)
              .setFooter(`Question asked by ${message.author.tag}`, message.author.displayAvatarURL);
            message.channel.send({embed});
          } else {
            const embed = new RichEmbed()
              .setTitle("Magic 8 Ball 🎱")
              .setDescription(`The 8 ball says:\n**${randomOutcome}**\n   ‍   `)
              .setFooter(`Question asked by ${message.author.tag}`, message.author.displayAvatarURL);
            message.channel.send({embed});
          }
        } catch (error) {
          this.client.logger.error(error);
          message.channel.send(`My magic 8 ball says: ${texts.error.replace(/{{err}}/g, error.message)}`);
        }
      } else {
        message.channel.send(`Unsure how to use this command? Use \`${settings.prefix}help 8ball\` to see how.`);
      }
  }
}

module.exports = EightBall;
