const {
  ApplicationCommandOptionType,
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits,
  UserFlags,
} = require("discord.js");
const axios = require("axios");
module.exports = {
  name: ["server", "user-info"],
  description: "get info about any user in server",
  category: "Server",
  options: [
    {
      name: "user",
      type: ApplicationCommandOptionType.User,
      description: "User To Get Info About",
      required: false,
    },
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
    await interaction.deferReply();
    let user1 = interaction.options.getUser("user");
    if (!user1) {
      user1 = interaction.user;
    }
    const member = interaction.guild.members.cache.get(user1.id);
    
    const flags = {
      //UserFlags.ActiveDeveloper
      ActiveDeveloper: "<:ActiveDeveloper:1110553585231593555>",
      // UserFlags.BotHTTPInteractions = "",
      BotHTTPInteractions: "<:bot_http_interaction:1110553680303882291>",

      //UserFlags.BugHunterLevel1 = "",
      BugHunterLevel1: "<:BugHunterLevel1:1110553801867415604>",

      // UserFlags.BugHunterLevel2 = "",
      BugHunterLevel2: "<:bug_hunter_level_2:1110555969521451028>",

      //UserFlags.CertifiedModerator = "",
      CertifiedModerator: "<:DiscordCertifiedModerator:1110556524625023076>",

      //UserFlags.PremiumEarlySupporter = "",
      PremiumEarlySupporter: "<:early_supporter:1110556619022008344>",

      //Collaborator = "",
      //   UserFlags.HypeSquadOnlineHouse1 = "",
      HypeSquadOnlineHouse1: "<:HypeSquadOnlineHouse1:1110556713519689798>",

      //  UserFlags.HypeSquadOnlineHouse2 = "",
      HypeSquadOnlineHouse2: "<:HypeSquadOnlineHouse2:1110556740698783765>",

      HypeSquadOnlineHouse3: "<:hypesquad3:1110746817680904192>", //   UserFlags.HypeSquadOnlineHouse3 = "",
      //DisablePremium = "",
      //HasUnreadUrgentMessages = "",

      Hypesquad: "<:Hypesquad:1110563615943176273>",
      // UserFlags.Hypesquad = "",

      Partner: "<:partners:1110563237231083632>",
      // MFASMS = "",
      // UserFlags.Partner = "",

      //  PremiumEarlySupporter = "",
      // PremiumPromoDismissed = "",
      //UserFlags.Quarantined = "",

      // RestrictedCollaborator = "",
      //Spammer = "",

      Staff: "<:staff:1110563338821312572>",
      //  UserFlags. Staff = "",

      // UserFlags.TeamPseudoUser = "",
      TeamPseudoUser: "<:N_Pseudo:1110564025357570229>",

      VerifiedBot: "<:N_VerifiedBot:1110564113333108776>",
      //  UserFlags. VerifiedBot = "",

      VerifiedDeveloper: "<:N_VerifiedDev:1110564192878080170>",
      //UserFlags.VerifiedDeveloper = "",
    };

/*
const flags = {
  DISCORD_EMPLOYEE: '<:discordstaff:868235527059537960>',
    DISCORD_PARTNER: '<:serverownerpartner:868235522139619418>',
    BUGHUNTER_LEVEL_1: '<:bughunter1:868235523167240342>',
    BUGHUNTER_LEVEL_2: '<:bughunter2:868235521099444374>',
    HYPESQUAD_EVENTS: '<:hypesquadevents:868235528103944232>',
    HOUSE_BRAVERY: '<:hypesquadbravery:868235530020716584>',
    HOUSE_BRILLIANCE: '<:hypesquadbrilliance:868235525834817536>',
    HOUSE_BALANCE: '<:hypesquadbalance:868235523657965579>',
    EARLY_SUPPORTER: '<:earlysupporter:868235524882722866>',
    SYSTEM: 'System',
    VERIFIED_BOT: '<:verifieManager:868235529039265842>',
    VERIFIED_DEVELOPER: '<:verifieManagerdev:853642406121439273>'
}*/
    const roles = member.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((role) => role.toString())
      .slice(0, -1);

      const userFlags = member.user.flags ? member.user.flags.toArray() : [];

    const userBanner = await axios.get(
      `https://discord.com/api/users/${member.id}`,
      {
        headers: {
          Authorization: `Bot ${client.token}`,
        },
      }
    );

    var nickName = member.nickname;

    const { banner } = userBanner.data;
    let url = "";

    if (banner) {
      const extension = banner.startsWith("a_") ? ".gif" : ".png";
      url = `https://cdn.discordapp.com/banners/${member.id}/${banner}${extension}?size=1024`;
    }

    return client.embed(
      {
        title: `👤・User information`,
        desc: `Information about ${member.user.username}`,
        thumbnail: member.user.displayAvatarURL({ dynamic: true, size: 1024 }),
        image: url,
        fields: [
          {
            name: "Username",
            value: `${member.user.username}`,
            inline: true,
          },
          {
            name: "Discriminator",
            value: `${member.user.discriminator}`,
            inline: true,
          },
          {
            name: "Nickname",
            value: `${nickName || "No nickname"}`,
            inline: true,
          },
          {
            name: "id",
            value: `${member.user.id}`,
            inline: true,
          },
          {
            name: "Flags",
            value: `${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}`,
            inline: true,
          },
          {
            name: "Discord joined at",
            value: `<t:${Math.round(member.user.createdTimestamp / 1000)}>`,
            inline: true,
          },
          {
            name: "Server joined at",
            value: `<t:${Math.round(member.joinedAt / 1000)}>`,
            inline: true,
          },
          {
            name: `Roles [${roles.length || 0}]`,
            value: `${roles.join(", ") || "No Roles"}`,
            inline: false,
          },
        ],
        type: "editreply",
      },
      interaction
    );
  },
};
