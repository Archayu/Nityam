const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    CommandInteraction,
    Client,
    PermissionFlagsBits
  } = require("discord.js");
const config = require("../../Resources/Structures/EconomyConfig");
 const DarkAuction = require("../../Models/darkauction")
  module.exports = {
    name: ["economy", "darkauction", "start"],
    description: "start a role auction in a guild",
    category: "Economy",
    options: [
        {
            name: "role",
            description: "The role you want to auction.",
            type: ApplicationCommandOptionType.Role, /// 8 = Role
            required: true
        },
        {
            name: "price",
            description: "The start price you want to auction.",
            type: ApplicationCommandOptionType.Integer,
            required: true
        },
    ],
    permissions: {
      channel: [],
      bot: [],
      user: ["Administrator"],
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
        const role = interaction.options.getRole("role");
                const price = interaction.options.getInteger("price");

                const auction = await DarkAuction.findOne({ guild_id: interaction.guild.id });
                if (auction.enabled === true) {
                    interaction.editReply("DarkAuction is already running.");
                    return;
                }

                const MessageStart = new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: `DARK AUCTION`, iconURL: client.user.avatarURL({ format: "png", dynamic: true, size: 512 }) })
                    .setDescription(`
                    **Role:** ${role.name}
                    **Starting Bid:** $${numberWithCommas(price * config.dark_auction.multiple)} Coins
                    **Bidder:** No bids yet.
                    `)
                    .setFooter({ text: `Time remaining: 120 seconds` });

                await interaction.guild.channels.create({
                    name: "dark-auction",
                    type: 0, 
                    topic: `Dark Auction: Selling ${role.name} for $${numberWithCommas(price * config.dark_auction.multiple)} Coins`,
                    parent: interaction.channel.parentId,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone,
                            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
                        }
                    ]
                }).then(async (channel) => {
                    await channel.send({ embeds: [MessageStart] }).then(async (message) => {
                        await DarkAuction.findOneAndUpdate({ guild_id: interaction.guild.id }, {
                            guild_id: interaction.guild.id,
                            enabled: true,
                            channel_id: channel.id,
                            message_id: message.id,
                            item: role.name,
                            price: price,
                            old_price: price,
                            bidder: "",
                            ended: true,
                            history: [],
                        }, { upsert: true });

                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setAuthor({ name: `DARK AUCTION`, iconURL: client.user.avatarURL({ format: "png", dynamic: true, size: 512 }) })
                        .setDescription(`
                        **Role:** ${role.name}
                        **Price:** $${numberWithCommas(price * config.dark_auction.multiple)} Coins
                        `)
                        .setThumbnail(client.user.displayAvatarURL())
                        .setFooter({ text: `Started by ${interaction.user.tag}`, icon_url: interaction.user.displayAvatarURL() });
        
                    return interaction.editReply({ embeds: [embed] });
                });
            });
    },
  };
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}