// messageCreate.js
const Discord = require('discord.js');
const { prefix } = require('../config');
const client = require(process.cwd() + '/index.js')

client.on("messageCreate", async (msg) => {
  if(!msg.content || !msg.guild) return;

  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName) && !client.aliases.has(commandName)) return;

  const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));
  try {
    await command.execute({client, Discord, args, prefix, msg});
  } catch (error) {
    console.error(error);
    msg.reply('There was an error executing that command!');
  }
});