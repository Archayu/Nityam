const Clan = require("../../Models/clan");
const Member = require("../../Models/member.js");
const { EmbedBuilder, MessageCollector, ApplicationCommandOptionType } = require("discord.js");
const { ClanPage } = require("../../Resources/Structures/Pagination.js");
const config = require("../../Resources/Structures/EconomyConfig.js");
const humanizeDuration = require("humanize-duration");
const pendings = {}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
module.exports = {
    name: ["clan", "invite"],
    description: "invite a user to your clan",
    category: "Clan",
    options: [
        {
            name: "user",
            description: "The user you want to invite.",
            type: ApplicationCommandOptionType.User, /// 6 = User
            required: true,
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

      if (member.id === interaction.user.id) return interaction.editReply("You can't add yourself");
      if (member.bot) return interaction.editReply("You can't add bots");

      /// Sent message went already sent
      for(const requester in pendings) {
          const receiver = pendings[requester];
          if (requester === interaction.user.id) { 
              interaction.editReply("You already have a sending invitation"); 
              return;
          } else if (receiver === interaction.user.id) {
              interaction.editReply("You already have a receiving invitation"); 
              return;
          } else if (requester === member.id) {
              interaction.editReply("This user already has a pending invitation"); 
              return;
          } else if (receiver === member.id) {
              interaction.editReply("This user already has a receiving invitation"); 
              return;
          }
        }

        await client.CreateAndUpdate(interaction.guild.id, member.id) /// Can find this module in Handlers/loadCreate.js
    
        const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });
        if (!clan) return interaction.editReply("You are not the clan owner");
        
        /// This member already in another clan
        const inClan = await Clan.findOne({ guild_id: interaction.guild.id, clan_members: member.id });
        if (inClan) return interaction.editReply("This member is already in a clan");

        if (clan.clan_members.includes(member.id)) return interaction.editReply("This member is already in your clan");
        if (clan.clan_members.length >= clan.member_limit) return interaction.editReply("Your clan is full");

        const embeded = new EmbedBuilder()
            .setColor(client.color)
            .setTitle("Clan Invite")
            .setDescription(`\`${member.tag}\` *Type [Yes/No] to response!*`)
            .setThumbnail(clan.clan_icon)
            .setFooter({ text: `Clan Tag: ${clan.clan_tag} | Response Time: 30s` });


        const Boxed = await interaction.editReply({ embeds: [embeded] });

        pendings[interaction.user.id] = member.id;

        const filter = (m) => m.author.id === member.id && (m.content.toLowerCase() === "yes" || m.content.toLowerCase() === "no");
        const collector = new MessageCollector(interaction.channel, { filter: filter, time: 30000 });

        collector.on('collect', async (message) => {
            const content = message.content.toLowerCase();
            if (content === ('yes').toLocaleLowerCase()) {
                await clan.clan_members.push(member.id);

                await clan.save().then( async () => {
                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle("Clan Invite")
                        .setDescription(`\`${member.tag}\` *has accepted your clan invite*`)
                        .setThumbnail(clan.clan_icon)
                        .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

                    // Delete pending request
                    delete pendings[interaction.user.id];
                    await message.reply({ embeds: [embed] });
                    return collector.stop();
                });
            } else if (content === ('no').toLocaleLowerCase()) {

                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle("Clan Invite")
                    .setDescription(`\`${member.tag}\` *has declined your clan invite*`)
                    .setThumbnail(clan.clan_icon)
                    .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

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
  