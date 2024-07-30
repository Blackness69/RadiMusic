const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("music system")
    .addSubcommand(subcommand =>
        subcommand.setName("play")
        .setDescription("Play a song.")
        .addStringOption(option =>
            option.setName("query")
            .setDescription("Specify the name or URL of the song.")
            .setRequired(true)
        )
     )
     .addSubcommand(subcommand =>
        subcommand.setName("volume")
        .setDescription("Adjust the volume of the song.")
        .addNumberOption(option =>
            option.setName("percentage")
            .setDescription("Adjust volume in appropriate units: 10 = 10%")
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(true)
        )
     )
     .addSubcommand(subcommand =>
        subcommand.setName("options")
        .setDescription("Select options.")
        .addStringOption(option =>
            option.setName("options")
            .setDescription("Select music options.")
            .setRequired(true)
            .addChoices(
                {name: "queue", value: "queue"},
                {name: "skip", value: "skip"},
                {name: "pause", value: "pause"},
                {name: "resume", value: "resume"},
                {name: "stop", value: "stop"},
                {name: "loop-queue", value: "loopqueue"},
                {name: "loop-all", value: "loopall"},
                {name: "autoplay", value: "autoplay"},

            )
        )
     ), 
     async execute({interaction, client}) {
        const {options, member, guild, channel} = interaction;

        const subcommand = options.getSubcommand();
        const query = options.getString("query");
        const volume = options.getNumber("percentage");
        const option = options.getString("options");
        const voiceChannel = member.voice.channel;

        const embed = new EmbedBuilder();

        if (!voiceChannel) {
            embed.setColor("Red").setDescription("You must be on voice chat!");
            return interaction.reply({ embeds: [embed], ephemeral: true});
        }

        if (!member.voice.channelId == guild.members.me.voice.channelId) {
            embed.setColor("Red").setDescription(`You cannot use the music system because it is already active in the: <#${guild.members.me.voice.channelId}>`);
            return interaction.reply({ embeds: [embed], ephemeral: true});
        }

        try {
            switch (subcommand) {
                case "play":
                    client.distube.play(voiceChannel, query, {textChannel: channel, member: member});
                    return interaction.reply ({ content: "🎶 Request received."});
                case "volume":
                    client.distube.setVolume(voiceChannel, volume);
                    return interaction.reply ({ content: `🔊 The volume level has been set to: ${volume}%.`});                
                case "options":
                    const queue = await client.distube.getQueue(voiceChannel);

                    if(!queue) {
                        embed.setColor("Red").setDescription("No active queue.");
                        return interaction.reply({ embeds: [embed], ephemeral: true});
                    }

                    switch(option) {
                        case "skip":
                            await queue.skip(voiceChannel);
                            embed.setColor('#a200ff').setDescription("⏩ The track was skipped");
                            return interaction.reply({ embeds: [embed], ephemeral: true});
                        case "stop":
                            await queue.stop(voiceChannel);
                            embed.setColor('#a200ff').setDescription("🛑 The queue has been stopped");
                            return interaction.reply({ embeds: [embed], ephemeral: true});
                        case "pause":
                            await queue.pause(voiceChannel);
                            embed.setColor('#a200ff').setDescription("⏸️ The track was paused");
                            return interaction.reply({ embeds: [embed], ephemeral: true});
                        case "resume":
                            await queue.resume(voiceChannel);
                            embed.setColor('#a200ff').setDescription("▶️ The track was resumed");
                            return interaction.reply({ embeds: [embed], ephemeral: true});
                        case "queue":
                            await (voiceChannel);
                            embed.setColor('#a200ff').setDescription(`${queue.songs.map(
                                (song, id) => `\n**${id + 1}.** ${song.name} - \`${song.formattedDuration}\``
                            )}`);
                            return interaction.reply({ embeds: [embed], ephemeral: true});
                        case "loopqueue":
                            if(queue.repeatMode === 2) {
                                await client.distube.setRepeatMode(interaction, 0);
                                embed.setColor('#a200ff').setDescription(`\`🔁\` | **The track is not looped in mode:** \`Queue\``)
                                return interaction.reply({ embeds: [embed], ephemeral: true});
                            } else {
                                await client.distube.setRepeatMode(interaction, 2);
                                embed.setColor('#a200ff').setDescription(`\`🔁\` | **The track is looped in mode:** \`Queue\``)
                                return interaction.reply({ embeds: [embed], ephemeral: true});

                            }
                        case "loopall":
                            if(queue.repeatMode === 0) {
                                await client.distube.setRepeatMode(interaction, 1);
                                embed.setColor('#a200ff').setDescription(`🔁 **The track is looped in mode:** \`All\``)
                                return interaction.reply({ embeds: [embed], ephemeral: true});
                            } else {
                                await client.distube.setRepeatMode(interaction, 0);
                                embed.setColor('#a200ff').setDescription(`🔁 **The track is not looped in mode:** \`All\``)
                                return interaction.reply({ embeds: [embed], ephemeral: true});

                            } 
                        case "autoplay":
                            if(!queue.autoplay) {
                                await client.distube.toggleAutoplay(interaction);
                                embed.setColor('#a200ff').setDescription(`📻 *Autoplay was:* \`Active\``);
                                return interaction.reply({ embeds: [embed], ephemeral: true});
                            } else {
                                await client.distube.toggleAutoplay(interaction);
                                embed.setColor('#a200ff').setDescription(`📻 *Autoplay was:* \`Inactive\``);
                                return interaction.reply({ embeds: [embed], ephemeral: true}); 
                            }       




                    }
            }
        }catch(err) {
            console.log(err);

            embed.setColor("Red").setDescription("❌ | Something went wrong...");

            return interaction.reply({ embeds: [embed], ephemeral: true});
        }
     }
}