// ready.js
const { ActivityType, ChannelType } = require('discord.js');
const colors = require('colors');
var AsciiTable = require('ascii-table');
var table = new AsciiTable();
table.setHeading('Mongo Database', 'Stats').setBorder('|', '=', "0", "0");
const client = require(process.cwd() + '/index.js')

client.on("ready", async (client) => {
  client.user.setActivity({
    name: '.ping',
    type: ActivityType.Playing,
  });
  await client.application.commands.set(client.slashCommands.map(command => command.data));


  if (!client.slashCommands) {
    console.log(colors.blue('Slash Commands • Not Registered'))
    console.log(colors.blue('0===========================0'));
  } else {
    console.log(colors.blue('Slash Commands • Registered'))
    console.log(colors.blue('0===========================0'));
  }
  if (client) {
    console.log(colors.red(`${client.user.tag} • Online`))
    console.log(colors.red('0===========================0'));
    } else {
      console.log(colors.red(`Client not found`));
    console.log(colors.red('0===========================0'));
  }
});