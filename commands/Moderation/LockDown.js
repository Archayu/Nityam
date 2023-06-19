const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ButtonBuilder,
  } = require("discord.js");
  module.exports = {
    name: ["lockdown"],
    description: "lock all channels in the guild",
    category: "Moderation",
    options: [
        {
            name: "ignored-channel",
            description: "channels to ignore",
            type: ApplicationCommandOptionType.Channel,
            required: false,
            channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
        },
        {
            name: "ignored-channel-2",
            description: "channels to ignore",
            type: ApplicationCommandOptionType.Channel,
            required: false,
            channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
        },
        {
            name: "ignored-channel-3",
            description: "channels to ignore",
            type: ApplicationCommandOptionType.Channel,
            required: false,
            channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
        },
        {
            name: "ignored-channel-4",
            description: "channels to ignore",
            type: ApplicationCommandOptionType.Channel,
            required: false,
            channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
        },
        {
            name: "ignored-channel-5",
            description: "channels to ignore",
            type: ApplicationCommandOptionType.Channel,
            required: false,
            channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
        }
    ],
    permissions: {
      channel: [],
      bot: ["ManageChannels"],
      user: ["Administrator"],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {
        await interaction.deferReply({
            ephemeral: true,
        });

        const ignoredChannel = interaction.options.getChannel("ignored-channel") || "0";
        const ignoredChannel2 = interaction.options.getChannel("ignored-channel-2") || "0";
        const ignoredChannel3 = interaction.options.getChannel("ignored-channel-3") || "0";
        const ignoredChannel4 = interaction.options.getChannel("ignored-channel-4") || "0";
        const ignoredChannel5 = interaction.options.getChannel("ignored-channel-5") || "0";


        const Confirm = new EmbedBuilder()
        .setTitle("Are you sure?")
        .setDescription("This will lock all channels in the guild")
        .setColor("Red")
        .setTimestamp()
        .setFooter(client.user.username, client.user.displayAvatarURL());

        const confirmButtons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("confirm")
            .setLabel("Yes")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("cancel")
            .setLabel("No")
            .setStyle(ButtonStyle.Success)
        );

        const confirmMessage = await interaction.editReply({
            embeds: [Confirm],
            components: [confirmButtons],
        });

        const filter = (i) => i.user.id === interaction.user.id;
        const collector = confirmMessage.createMessageComponentCollector({
            filter,
            time: 15000,
        });

        collector.on("collect", async (i) => {
            if (i.customId === "confirm") {
                await i.deferUpdate();
                await i.editReply({
                    content: "Locking down all channels",
                    ephemeral: true,
                });

                const channels = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildText || c.type === ChannelType.GuildAnnouncement);
                channels.forEach((channel) => {
                    if (channel.id === ignoredChannel?.id || channel.id === ignoredChannel2?.id || channel.id === ignoredChannel3?.id || channel.id === ignoredChannel4?.id || channel.id === ignoredChannel5?.id) return;
                    channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                        SendMessages: false,
                        ViewChannel: false
                    });
                });


            } else if (i.customId === "cancel") {
                await i.deferUpdate();
                await i.editReply({
                    content: "Aborted",
                    ephemeral: true,
                });
            }
        }
        );


    },
  };
  