// index.js
const { token } = require('./config.js');
const fs = require('fs');
require('dotenv').config();
const {DisTube} = require("distube");
const {SpotifyPlugin} = require("@distube/spotify");
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => {
  res.send('Online Yo Boy !');
});

app.listen(port, () => {
  console.log(`Example app listening to https://localhost:${port}`)
});

const { ActivityType, Collection, GatewayIntentBits, Client, Collector, VoiceChannel, EmbedBuilder, Partials } = require('discord.js');

const Discord = require('discord.js');
const client = new Client({
  intents: Object.keys(GatewayIntentBits).map(intent => intent),
  partials: [Partials.Message, Partials.GuildMessageReactions, Partials.Channel, Partials.MessageReactionAdd, Partials.MessageReactionRemove, Partials.Reaction],
  allowedMentions: { repliedUser: false, parse: ['users'] }
});

module.exports = client;

client.commands = new Collection();
client.slashCommands = new Collection();
client.aliases = new Collection();

        const commandFolders = fs.readdirSync('./commands');
        for (const folder of commandFolders) {
          const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
          for (const file of commandFiles) {
            const command = require(`./commands/${folder}/${file}`);
    command.category = folder;
    client.commands.set(command.name, command);
    if(!command.aliases) continue;
    for (const aliase of command.aliases) {
      client.aliases.set(aliase, command.name)
    }
  }
};

const slashCommandFolders = fs.readdirSync('./slashCommands');
for (const folder of slashCommandFolders) {
  const slashCommandFiles = fs.readdirSync(`./slashCommands/${folder}`).filter(file => file.endsWith('.js'));
  for (const file of slashCommandFiles) {
    const slashCommand = require(`./slashCommands/${folder}/${file}`);
    slashCommand.category = folder;
    if (slashCommand.data) {
      client.slashCommands.set(slashCommand.data.name, slashCommand);
    }
  }
}

module.exports = client;
// Load event handler files
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  require(`./events/${file}`);
};

// Load table files
const tableFiles = fs.readdirSync('./tables').filter(file => file.endsWith('.js'));

for (const file of tableFiles) {
 client.on("ready", require(`./tables/${file}`));
}

client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
        new SpotifyPlugin(),
        new SoundCloudPlugin(),
        new YtDlpPlugin()
    ]
});

const status = queue =>
    `Volume: \`${queue.volume}%\` |  Filter: \`${queue.filters.names.join(', ') || 'Inactive'}\` | Repeat: \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'Queue' : 'Track') : 'Off'
    }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
client.distube
    .on('playSong', (queue, song) =>
        queue.textChannel.send({
            embeds: [new EmbedBuilder().setColor('#a200ff')
                .setDescription(`🎶 | Playinvg: \`${song.name}\` - \`${song.formattedDuration}\`\nFrom: ${song.user
                    }\n${status(queue)}`)]
        })
    )
    .on('addSong', (queue, song) =>
        queue.textChannel.send(
            {
                embeds: [new EmbedBuilder().setColor('#a200ff')
                    .setDescription(`🎶 | Added \`${song.name}\` - \`${song.formattedDuration}\` to queue by: ${song.user}`)]
            }
        )
    )
    .on('addList', (queue, playlist) =>
        queue.textChannel.send(
            {
                embeds: [new EmbedBuilder().setColor('#a200ff')
                    .setDescription(`🎶 | Added from \`${playlist.name}\` : \`${playlist.songs.length
                        } \` queue tracks; \n${status(queue)}`)]
            }
        )
    )
    .on('error', (e, queue, song) => {
        queue.textChannel.send(`⛔ | An error encountered: ${e}`);
    })
    .on('empty', channel => channel.send({
        embeds: [new EmbedBuilder().setColor("Red")
            .setDescription('⛔ | The voice channel is empty! Leaving the channel...')]
    }))
    .on('searchNoResult', (message, query) =>
        message.channel.send(
            {
                embeds: [new EmbedBuilder().setColor("Red")
                    .setDescription('`⛔ | No results found for: \`${query}\`!`')]
            })
    )
    .on('finish', queue => queue.textChannel.send({
        embeds: [new EmbedBuilder().setColor('#a200ff')
            .setDescription('🏁 | The queue is finished!')]
    }))


const process = require('node:process');

process.on('unhandledRejection', async (reason, promise) => {
    console.log('Unsupported rejection at:', promise, 'Reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.log('Uncatchable exception:', err);
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log('Monitor uncaught exceptions:', err, origin);
});

client.login(token);