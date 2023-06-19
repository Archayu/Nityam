const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    CommandInteraction,
    Client
  } = require("discord.js");
const Member = require("../../Models/member.js");
  module.exports = {
    name: ["economy", "vote"],
    description: "vote a user for building his/her reputation",
    category: "Economy",
    options: [
        {
            name: "user",
            required: true,
            description: "The user you want to vote.",
            type: ApplicationCommandOptionType.User,
        }
    ],
    permissions: {
      channel: [],
      bot: [],
      user: [],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
        /**
       * @param {CommandInteraction} interaction
       * @param {Client} client   
       */
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });

        const member = interaction.options.getUser("user");
        if (member.bot) return interaction.editReply("You can't vote bots");

        /// Try to create new database went this member not have!
        await client.CreateAndUpdate(interaction.guild.id, member.id) /// Can find this module in Handlers/loadCreate.js

        const interac = await Member.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });

        const user = await Member.findOne({ guild_id: interaction.guild.id, user_id: member.id });
        if(user.user_id === interaction.user.id) return interaction.editReply("You can't vote yourself.");

        const cooldown = new Date(interac.vote_cooldown);
        /// Format time and send message
        const time = new Date(cooldown - new Date());
        const time_format = `${time.getUTCHours()} hours, ${time.getUTCMinutes()} minutes and ${time.getUTCSeconds()} seconds`;

        if(interac.vote_cooldown > Date.now()) {
            return interaction.editReply(`You can't vote yet, you have to wait \`${time_format}\``);
        }

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setDescription(`\`${interaction.user.tag}\` is voting for \`${member.tag}\``)
            .setThumbnail(member.avatarURL({ dynamic: true }))
            .setFooter({ text: `Vote by: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })

        user.reputation += 1;
        await user.save();

        /// Get vote cooldown in database
        interac.vote_cooldown = Date.now() + (interac.vote_cooldown_time * 1000);
        await interac.save();

        return interaction.editReply({ embeds: [embed] });
    },
  };
  