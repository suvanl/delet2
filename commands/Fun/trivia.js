const Command = require("../../base/Command.js");
const Discord = require("discord.js");
const request = require("request");

class Trivia extends Command {
  constructor(client) {
    super(client, {
      name: "trivia",
      description: "Puts your general knowledge to the test.",
      category: "Fun",
      usage: "trivia",
      aliases: ["randomtrivia", "randomq", "testme"],
      guildOnly: true
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
      const activeChannels = [];

      if (activeChannels.includes(message.channel.id)) {
          return message.channel.send("A trivia session is already active!");
      }

      const options = {
          method: "GET",
          url: "https://opentdb.com/api.php?amount=1&type=boolean&encode=url3986"
      };

      request(options, async (error, response, body) => {
          if (error) {
              return message.channel.send("An error occurred.");
          }

          if (response) {
              if (response.statusCode === 200) {
                  try {
                      body = JSON.parse(body);
                      body = body.results[0];

                      const embed = new Discord.RichEmbed()
                      .setColor(4169468)
                      .setTitle("Trivia")
                      .setDescription(`**Question**\n${decodeURIComponent(body.question)}`)
                      .addField("Category", decodeURIComponent(body.category), true)
                      .addField("Difficulty", body.difficulty.toProperCase(), true)
                      .setFooter("Reply with \"True\" or \"False\" within 60 seconds!", "https://opentdb.com/images/logo.png");
                      const question = await message.channel.send({embed});

                      activeChannels.push(message.channel.id);

                      const validAnswers = [
                          "true",
                          "false"
                      ];

                      const trivia = message.channel.createMessageCollector(
                          msg => !msg.author.bot && validAnswers.includes(msg.content.toLowerCase()),
                          {
                              maxMatches: 1,
                              time: 60 * 1000
                          }
                      );

                      trivia.on("collect", ans => {
                          if (ans.content === body.correct_answer.toLowerCase()) {
                              const reply = "well done, your answer is correct!\nTrivia session ended.";
                              message.reply(reply).catch(e => {
                                this.client.logger.error(e);
                            });
                          } else {
                              const reply = "unfortunately, that's the wrong answer.\nTrivia session ended.";
                              message.reply(reply).catch(e => {
                                this.client.logger.error(e);
                            });
                          }
                      });

                      trivia.on("end", (answers, reason) => {
                          activeChannels.splice(activeChannels.indexOf(message.channel.id), 1);

                          if (reason === "time") {
                              message.channel.send("**Trivia ended**\nThe session timed out as no one answered within 60 seconds.")
                                .then(() => {
                                    question.delete().catch(e => {
                                        this.client.logger.error(e);
                                    });
                                }).catch(e => {
                                    this.client.logger.error(e);
                                });
                          }
                      });
                  } catch (e) {
                      this.client.logger.error(e);
                  }
              } else {
                  return message.channel.send("An error occurred.");
              }
          }
      });
  }
}

module.exports = Trivia;
