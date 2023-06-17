const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
    ModalBuilder,
    TextInputBuilder,
    ActionRowBuilder,
    TextInputStyle,

  } = require("discord.js");
  const configs = require("../../Models/Leveling");
  module.exports = {
    name: ["level", "announce", "message"],
    description: "edit level up messages",
    category: "Leveling",
    options: [
    ],
    permissions: {
      channel: [],
      bot: [],
      user: ["ManageMessages"],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {
        const  data = await configs.findOne({ id: interaction.guild.id }) || await configs.create({ id: interaction.guild.id });
        
        if (!data.xp)
        return client.errNormal(
          {
            error: `Text Leveling System Is Disabled`,
            type: "ephemeral", //editreply, reply, update, ephemeraledit, ephemeral
          },
          interaction
        );

    


        const failMsg = new TextInputBuilder()
        .setCustomId("failmsg")
        .setMaxLength(2048)
        .setMinLength(8)
        .setStyle(TextInputStyle.Paragraph)
        .setValue(`${data.levelRewardMessage.fail}`)
        .setPlaceholder("It Will Occor When The Reward Is There On That Level But Bot Can't Gave The Reward")
        .setLabel("Fail Message")
        .setRequired(true)

        const successMsg = new TextInputBuilder()
        .setCustomId("success")
        .setMaxLength(2048)
        .setMinLength(8)
        .setStyle(TextInputStyle.Paragraph)
        .setValue(`${data.levelRewardMessage.success}`)
        .setPlaceholder("It Will Occor When The Reward Is There On That Level and Bot Gave The Reward")
        .setLabel("Success Message")
        .setRequired(true)

        const Message = new TextInputBuilder()
        .setCustomId("msg")
        .setMaxLength(2048)
        .setMinLength(8)
        .setStyle(TextInputStyle.Paragraph)
        .setValue(`${data.xpLevelUp.message}`)
        .setPlaceholder("It Will Occor When The No Reward Is There On that Level")
        .setLabel("Simple Message")
        .setRequired(true)

        const modal = new ModalBuilder()
        .setTitle("Announcement Messages For Text Levels")
        .setCustomId("gggg")
        .setComponents(
          new ActionRowBuilder().addComponents(Message),
          new ActionRowBuilder().addComponents(successMsg),
          new ActionRowBuilder().addComponents(failMsg)
        )

      await interaction.showModal(modal)

        const collector = await interaction.awaitModalSubmit({
          time: 60000,
          filter: i => i.user.id === interaction.user.id
        }).catch(error => {
          console.error(error)
          return null;
        });


        if (collector) {
          const fail = collector.fields.getTextInputValue("failmsg"),
          success = collector.fields.getTextInputValue("success"),
          message = collector.fields.getTextInputValue("msg");

          data.levelRewardMessage.fail = fail
          data.levelRewardMessage.success = success
          data.xpLevelUp.message = message
          await data.save();

          collector.reply(
            {
              content: "Announce Messages Updated. \n> Tip: Use `/text-level announce tags` To See The Available tags "
            }
          )
        }


    },
  };
  