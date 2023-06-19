
const Member = require("../../Models/member.js");
const { EmbedBuilder, MessageCollector, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../Resources/Structures/EconomyConfig.js");
const pendings = {}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {
    name: ["economy", "marridge-invite"],
    description: "invite a user to marry",
    category: "Economy",
    options: [
        {
            name: "user",
            description: "The user you want to marry.",
            type: ApplicationCommandOptionType.User,
            required: true
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
    run: async (interaction, client) => {
        interaction.deferReply();
        const member = interaction.options.getUser("user");

        if (member.id === interaction.user.id) return interaction.editReply("You can't marry yourself.");
        if (member.bot) return interaction.editReply("You can't marry bots");

        /// Sent message went already sent
        for(const requester in pendings) {
            const receiver = pendings[requester];
            if (requester === interaction.user.id) { 
                interaction.editReply("You already have a sending marry request"); 
                return;
            } else if (receiver === interaction.user.id) {
                interaction.editReply("You already have a receiving marry request"); 
                return;
            } else if (requester === member.id) {
                interaction.editReply("This user already has a pending marry request"); 
                return;
            } else if (receiver === member.id) {
                interaction.editReply("This user already has a receiving marry request"); 
                return;
            }
        }

        /// Try to create new database went this member not have!
        await client.CreateAndUpdate(interaction.guild.id, member.id) /// Can find this module in Handlers/loadCreate.js

        //// This user already married
        const target = await Member.findOne({ guild_id: interaction.guild.id, user_id: member.id });
        if (target.married) {
            interaction.editReply("This user already married");
            return;
        }

        //// Your already married
        const your = await Member.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });
        if (your.married) {
            interaction.editReply("You already married");
            return;
        }

        const embeded = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setDescription(`You have sent a marry request to \`${member.tag}\`\nResponse: \`yes\` to accept or \`no\` to decline.`)
            .setFooter({ text: `Response Time: 30s` })
            .setTimestamp();

        const Boxed = await interaction.editReply({ embeds: [embeded] });

        pendings[interaction.user.id] = member.id;

        const filter = (m) => m.author.id === member.id && (m.content.toLowerCase() === "yes" || m.content.toLowerCase() === "no");
        const collector = new MessageCollector(interaction.channel, { filter: filter, time: 30000 });

        collector.on('collect', async (message) => {
            const content = message.content.toLowerCase();
            if (content === ('yes').toLocaleLowerCase()) {
                /// Save marry
                target.married = true; /// Set to true
                target.married_to = interaction.user.id; /// Change target married to your id
                await target.save();

                your.married = true /// Set to true
                your.married_to = member.id; /// Change your married to target id
                await your.save().then( async () => {
                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setAuthor({ name: "Marry Accepted", iconURL: interaction.user.avatarURL({ dynamic: true }) })
                        .setDescription(`\`${member.tag}\` *has accepted your marry request*`)
                        .setThumbnail(member.avatarURL({ size: 512, dynamic: true }))
                        .setFooter({ text: `${interaction.user.username} <3 ${member.username}` })
                        .setTimestamp();

                    // Delete pending request
                    delete pendings[interaction.user.id];
                    await message.reply({ embeds: [embed] });
                    return collector.stop();
                });
            } else if (content === ('no').toLocaleLowerCase()) {

                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: "Marry Declined", iconURL: interaction.user.avatarURL({ dynamic: true }) })
                    .setDescription(`\`${member.tag}\` *has declined your marry request*`)
                    .setThumbnail(member.avatarURL({ size: 512, dynamic: true }))
                    .setFooter({ text: `Requested by: ${interaction.user.tag}` })
                    .setTimestamp();

                // Delete pending request
                delete pendings[interaction.user.id];
                await message.reply({ embeds: [embed] });
                return collector.stop();
            }
        });

        collector.on('end', async (collected, reason) => {
            if(reason === "time") {
                // Delete pending request
                delete pendings[interaction.user.id];
                await Boxed.edit({ content: "No response.", embeds: [] })
                return collector.stop();
            }
        });
    },
  };
  