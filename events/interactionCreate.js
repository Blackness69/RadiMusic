// interactionCreate.js
const Discord = require('discord.js');
const { prefix } = require('../config');
const client = require(process.cwd() + '/index.js')

client.on("interactionCreate", async (interaction) => {
  // Add interaction create event handling logic here
  if (!interaction.guild) return;

  const commandName = interaction.commandName;
  if(!client.slashCommands) return;
  const slashCommand = client.slashCommands.get(commandName);
  if (!slashCommand) return
  try {
    return slashCommand.execute({client, interaction, Discord, prefix});
  } catch (error) {
    console.log(error)
    interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true 
   });
  }
});