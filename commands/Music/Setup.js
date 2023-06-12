const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
    PermissionsBitField,
    ButtonStyle,
    ButtonBuilder,
    AttachmentBuilder,
    ActionRowBuilder
  } = require("discord.js");
  const { Database } = require("st.db");
  const ytsr = require("@distube/ytsr");
  const GSetup = new Database("./Models/Json/setup.json", { databaseInObject: true });
  module.exports = {
    name: ["music", "setup"],
    description: "search the song and play song",
    category: "Music",
    options: [],
    permissions: {
      channel: [],
      bot: [],
      user: ["ManageChannels"],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.editReply(`You don't have permission.`);

        await interaction.guild.channels.create({
            name: "song-request",
            type: 0,
            topic: `⏯ *Pause/Resume the song.*\n⬅ *Previous the song.*\n⏹ *Stop the song.*\n➡ *Skip the song.*\n🔁 *Loop/Unloop the song.*`,
            parent_id: interaction.channel.parentId,
            user_limit: 3,
            rate_limit_per_user: 3, 
        }).then(async (channel) => {
        //    const attachment = new AttachmentBuilder("./Resources/Images/orange-bg.jpg", { name: "setup.png" });

            const content = `**__Queue list:__**\nJoin a voice channel and queue songs by name or url in here.`;

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: `No song playing currently.` })
                .setImage(`https://i.pinimg.com/originals/13/b0/00/13b0000818cfd9cf27d39afaa051dc23.gif`)
                .setDescription(`>>> [Invite](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=2184310032&scope=bot%20applications.commands) `)
                .setFooter({ text: `Prefix is: /` });

            // SEND BANNER FIRST!
           
            await channel.send({ content: `${content}`, embeds: [embed], components: [client.diSwitch, client.diSwitch2] }).then(async (message) => {

            // Create database!
            await client.createSetup(interaction, channel.id, message.id); // Can find on handlers/loadDatabase.js
                
            const embed = new EmbedBuilder()
                .setDescription(`*Succesfully Setup Music System in* ${channel}`)
                .setColor(client.color);

            return interaction.followUp({ embeds: [embed] });
            })
        });
    },
  };
  