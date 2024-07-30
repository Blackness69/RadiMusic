module.exports = {
  name: 'ping',
  description: 'Shows the bot\'s ping',
  async execute({msg}) {
    msg.reply(`🏓 | Pong! **${Date.now() - msg.createdTimestamp}**ms.`);
  },
};