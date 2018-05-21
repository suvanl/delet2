const Command = require("../../base/Command.js");
const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const snekfetch = require("snekfetch");
const h = new (require("html-entities").AllHtmlEntities)();

class Trivia extends Command {
  constructor(client) {
    super(client, {
      name: "trivia",
      description: "Puts your general knowledge to the test.",
      category: "Fun",
      usage: "trivia",
      aliases: ["randomtrivia", "randomq", "testme", "quiz"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
      const { body } = await snekfetch.get("https://opentdb.com/api.php?amount=50&difficulty=medium&type=multiple");
      const quiz = body.results.random();
      const choices = quiz.incorrect_answers.map(answ => h.decode(answ));
      choices.push(h.decode(quiz.correct_answer));

      const randomChoices = new Array(4);
      for (let i = 0; i < 4; i++) {
          randomChoices[i] = choices.random();
          choices.splice(choices.indexOf(randomChoices[i]), 1);
      }

      const embed = new RichEmbed()
        .setColor(5360873)
        .setAuthor("Trivia", "https://vgy.me/9UDUk0.png")
        .setDescription(stripIndents`
        **Question**
        ${h.decode(quiz.question)}

        :regional_indicator_a: ${randomChoices[0]}
        :regional_indicator_b: ${randomChoices[1]}
        :regional_indicator_c: ${randomChoices[2]}
        :regional_indicator_d: ${randomChoices[3]}

        **Category & Difficulty**
        ${h.decode(quiz.category)} | ${h.decode(quiz.difficulty.toProperCase())}
        `)
        .setFooter("Reply with the correct letter within 60 seconds!", message.author.displayAvatarURL);

        const question = await this.client.awaitEmbedReply(message, "", m => m.author.id === message.author.id, 60000, {embed: embed});
        if (!question) return message.channel.send("**Trivia session ended**\nThe session timed out as you did not answer within 60 seconds.");

        const choice = randomChoices[["a", "b", "c", "d"].indexOf(question.toLowerCase())];
        if (!choice) return message.channel.send("That's not a valid answer!\nFor future reference, please ensure your answer is either **A**, **B**, **C**, or **D** (lowercase and uppercase are both accepted).");
        if (choice === h.decode(quiz.correct_answer)) {
            return message.channel.send("Well done, your answer is correct!\nTrivia session ended.");
        } else {
            return message.channel.send(`Unfortunately, that's the wrong answer. The correct answer was **${h.decode(quiz.correct_answer)}**, and you chose **${choice}**.\nTrivia session ended.`);
        }
  }
}

module.exports = Trivia;
