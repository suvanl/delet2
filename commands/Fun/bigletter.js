const Command = require("../../base/Command.js");

class BigLetter extends Command {
    constructor(client) {
      super(client, {
        name: "bigletter",
        description: "Converts the specified text to regional indicators.",
        category: "Fun",
        usage: "bigletter <text>",
        aliases: ["regional", "regional-indicator"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
      const generate = () => {
        let text = args.join(" ");
        if (!text) return message.channel.send("You must provide some text to convert to regional indicator emojis.");
        else text = args.join(" ").toLowerCase();

        const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        const isAlphaNumeric = (str) => {
          let code, i, len;
          for (i = 0, len = str.length; i < len; i++) {
            code = str.charCodeAt(i);
            if (!(code > 47 && code < 58) && !(code > 64 && code < 91) && !(code > 96 && code < 123) && code !== 32) {
              return false;
            }
          }
          return true;
        };

        if (!isAlphaNumeric(text)) return message.channel.send("Invalid character(s) provided.\nPlease ensure you have only provided alphanumeric characters.");

        let output = "";

        for (let i = 0; i < text.length; i++) {
          const char = text.charAt(i);
          if (char === " ") output += char;
          else if (numbers.includes(char)) output += numberToString(char);
          else output += `:regional_indicator_${char}: `;
        }

        return output;
      };

      const numberToString = (number) => {
        let value = "";

        switch (number) {
          case "0":
            value = ":zero :";
            break;

          case "1":
            value = ":one: ";
            break;

          case "2":
            value = ":two: ";
            break;

          case "3":
            value = ":three: ";
            break;

          case "4":
            value = ":four: ";
            break;

          case "5":
            value = ":five: ";
            break;

          case "6":
            value = ":six: ";
            break;

          case "7":
            value = ":seven: ";
            break;

          case "8":
            value = ":eight: ";
            break;

          case "9":
            value = ":nine: ";
            break;
        }
        return value;
      };

      message.channel.send(generate())
        .catch(error => {
          if (error.message === "Cannot send an empty message") return;
          else this.client.logger.error(error.message);
        });
    }
}

module.exports = BigLetter;
