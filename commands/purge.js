const Command = require('../base/Command.js');

class Purge extends Command {
  constructor(client) {
    super(client, {
      name: 'purge',
      description: 'Purges (bulk-deletes) between 2 and 99 messages.',
      category: 'Moderation',
      usage: 'purge [user] <number>',
      extended: 'This command will either purge a mentioned user\'s messages (between 2 and 99), the contents of the channel, or the bot\'s own messages.',
      aliases: ['prune'],
      permLevel: "DeletMod",
      botPerms: ['MANAGE_MESSAGES']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    
    const user = message.mentions.users.first();
    const amount = parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : parseInt(message.content.split(' ')[2]);

    if (!amount) return message.reply('you must specify an amount to delete!');
    if (!amount && !user) return message.reply('you must specify a user and amount, or just an amount, of messages to purge!');

    let messages = await message.channel.fetchMessages({ limit: amount });

    if (user) {
      const filterBy = user ? user.id : this.client.user.id;
      messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
    }

    this.client.emit('messageDeleteBulk', messages);
    for (const msg of messages.values()) msg.channel.messages.delete(msg.id);
    
    message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
  }
}

module.exports = Purge;