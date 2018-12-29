# Contributing
**We accept contributions for anything!** Just fork this repository, make any changes you desire, and submit a pull request!
Examples of things you can contribute are fortunes for the 8ball command, new commands and improvements to existing features, but you can submit a PR for basically anything.

## Fortunes for the 8ball command
Check the comments in the file [here](https://github.com/DS-Development/delet/blob/master/commands/Fun/8ball.js).

## Translations
If you'd like to sign up to be a translator for delet, you can do so [here](https://delet.js.org/go/translate). Note that the process of adding translations to the bot has not started yet, and we cannot guarantee that it will ever take place, as it will only do so if there is enough demand for this feature. The purpose of signing up is so we know who to go to in the event that we do end up implementing this feature.

## Commands
The default command base we use is as follows:
```js
const Command = require("../../base/Command.js");

class CommandName extends Command {
    constructor(client) {
      super(client, {
        // The name of the command. In most cases, this should match the class and file name.
        name: "",
        // State what the command does
        description: "",
        // Choose from one of the directory names within the `commands` folder
        category: "",
        // State the command usage including all possible parameters/arguments
        usage: "",
        // An array of any other names the command can be invoked with.
        // Each value in the array must be a string.
        aliases: [],
        // If the command can be run in DMs, remove this property or set it to false.
        guildOnly: true,
        // Choose from "User", "Moderator", "Admin", "Bot Support", "Bot Admin" or "Bot Owner".
        // If the permLevel is just "User", the `permLevel` property can be removed from the constructor.
        permLevel: ""
      });
    }

    // Make sure to remove all unused params or add `// eslint-disable-line no-unused-vars` on the line
    async run(message, args, level, settings, texts) {
        // Command code here
    }
}

module.exports = CommandName;
```

### Want to join the DS Development Group?
Head to [delet.js.org/go/join](https://delet.js.org/go/join)!
