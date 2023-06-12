const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
    AttachmentBuilder,

  } = require("discord.js");

  const { Rank } = require("canvacord")
  const users = require('../../Models/User_Exp');

const configs = require("../../Models/Leveling")
  module.exports = {
    name: ["level", "rank"],
    description: "check your rank",
    category: "Leveling",
    options: [
        {
            name: "user",
            type: ApplicationCommandOptionType.User,
            description: "The User Whose You want To Check Rank",
            required: false
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
        const  data1 = await configs.findOne({ id: interaction.guild.id }) || await configs.create({ id: interaction.guild.id });
        if (!data1.xp)
        return client.errNormal(
          {
            error: `Text Leveling System Is Disabled`,
            type: "ephemeral", //editreply, reply, update, ephemeraledit, ephemeral
          },
          interaction
        );

        await interaction.reply("Calculating data!");

        const user = interaction.options.getUser("user") || interaction.user;
        let datas = await users.find({ guild: interaction.guild.id }) || {}, data, rank;

        const member = await interaction.guild.members.fetch(user.id)
        for (let i = 0; i < datas.length; i++) {
            let v = datas[i];

            if (v.user === user.id) {
                data = v;
                rank = i + 1;
                break;
            }
        };

        if (!data) return interaction.editReply("you have no xp & data")

        let reqXP = 100;

        for (let i = 1; i <= data.level; i++)reqXP += 5 * (i ^ 2) + (50 * i) + 100;

const img = new Rank()
.setAvatar(user.displayAvatarURL({ extension: 'png'}))
.setBackground(`IMAGE`, "https://cdn.discordapp.com/attachments/1078842444411576400/1109165228639391846/orange-bg.jpg")
.setCurrentXP(data.xp)
.setRequiredXP(reqXP)
.setLevel(data.level)
.setRank(rank)
.setUsername(user.username)
.setProgressBar(["#ffa500", "#daff00"], "GRADIENT")
.setDiscriminator(user.discriminator)
.setStatus(member.presence.status)
.renderEmojis(true)


const img2 = await img.build();

/*
        const canvas = createCanvas(1000, 300),
            ctx = canvas.getContext('2d'),
            bar_width = 600,
            bg = await loadImage(""),
            av = await loadImage(interaction.user.displayAvatarURL({ extension: 'png', dynamic: false }));

        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        // Middle circle for Avatar Background
        ctx.beginPath();
        ctx.arc(120, 120, 110, 0, 2 * Math.PI);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();

        // XP Bar
        ctx.lineJoin = "round";
        ctx.lineWidth = 69;

        // Shadow of xp bar
        ctx.strokeRect(298, 199, bar_width, 2);

        // Empty Bar
        ctx.strokeStyle = "black";
        ctx.strokeRect(300, 200, bar_width, 0);

        // Filled Bar
        ctx.strokeStyle = "orange"
        ctx.strokeRect(300, 200, bar_width * data.xp / reqXP, 0);

        // Adding Username
        ctx.font = "bold 40px Sans";
        ctx.fillStyle = "black"; // Username color
        ctx.textAlign = "center";
        ctx.fillText(user.username, 120, 275, 200);

        // Adding stats
        ctx.fillText("#" + rank, 760, 40, 80);
        ctx.fillText(data.level, 930, 40, 80);

        // Adding titles
        ctx.fillStyle = "black";
        ctx.font = "bold 25px Sans";
        ctx.fillText("Rank", 680, 40, 200);
        ctx.fillText("Level", 850, 40, 200);

        // Adding bar title
        ctx.fillStyle = "#white";
        ctx.font = "bold 22px Serif";
        ctx.fillText(`${data.xp}/${reqXP} XP`, 850, 150);
        ctx.fillText(`${((data.xp * 100) / reqXP).toFixed(0)}/100 %`, 350, 150);

        // Remove the corners
        ctx.beginPath();
        ctx.arc(120, 120, 110, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();

        // Add the avatar
        ctx.drawImage(av, 10, 10, 220, 200);
*/

        const at = new AttachmentBuilder()
        .setFile(img2)
        .setName("text-level-rank.png")
        .setDescription(`The Rank Of the ${user.username}`)
        
        interaction.editReply({
            files: [at]
        })
        
        
    },
  };
  