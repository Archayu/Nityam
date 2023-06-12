const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = async (client) => {

    client.enSwitch =  new ActionRowBuilder().addComponents([
        new ButtonBuilder()
          .setEmoji("⏮")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("N_previous"),
    
        new ButtonBuilder()
          .setEmoji("◀")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("N_reverse"),
    
        new ButtonBuilder()
          .setEmoji("⏸")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("N_pause"),
    
        new ButtonBuilder()
          .setEmoji("▶")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("N_forward"),
    
        new ButtonBuilder()
          .setEmoji("⏩")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("N_skip")
    ]);

    client.enSwitch2 = new ActionRowBuilder().addComponents([
    new ButtonBuilder()
    .setEmoji("🔁")
    .setStyle(ButtonStyle.Secondary)
    .setCustomId("N_loop"),

  new ButtonBuilder()
    .setEmoji("🔉")
    .setStyle(ButtonStyle.Secondary)
    .setCustomId("N_vol-"),

  new ButtonBuilder()
    .setEmoji("⏹")
    .setStyle(ButtonStyle.Secondary)
    .setCustomId("N_stop"),

  new ButtonBuilder()
    .setEmoji("🔊")
    .setStyle(ButtonStyle.Secondary)
    .setCustomId("N_vol+"),

  new ButtonBuilder()
    .setEmoji("🔀")
    .setStyle(ButtonStyle.Secondary)
    .setCustomId("N_shuffle")
        ]);

        client.enSwitch3 = new ActionRowBuilder().addComponents([
            new ButtonBuilder()
              .setLabel("Queue")
              .setStyle(ButtonStyle.Secondary)
              .setCustomId("N_queue"),
        
            new ButtonBuilder()
              .setLabel("Clear Queue")
              .setStyle(ButtonStyle.Secondary)
              .setCustomId("N_clear_queue")
          ]);

    client.diSwitch = new ActionRowBuilder()
    .addComponents([
        new ButtonBuilder()
          .setEmoji("⏮")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true)
          .setCustomId("N_previous"),
    
        new ButtonBuilder()
          .setEmoji("◀")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true)
          .setCustomId("N_reverse"),
    
        new ButtonBuilder()
          .setEmoji("⏸")
          .setDisabled(true)
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("N_pause"),
    
        new ButtonBuilder()
          .setEmoji("▶")
          .setDisabled(true)
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("N_forward"),
    
        new ButtonBuilder()
          .setEmoji("⏩")
          .setDisabled(true)
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("N_skip")
       
        ]);

    client.diSwitch2 = new ActionRowBuilder()
        .addComponents([
            new ButtonBuilder()
      .setEmoji("🔁")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true)
      .setCustomId("N_loop"),

    new ButtonBuilder()
      .setEmoji("🔉")
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("N_vol-"),

    new ButtonBuilder()
      .setEmoji("⏹")
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("N_stop"),

    new ButtonBuilder()
      .setEmoji("🔊")
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("N_vol+"),

    new ButtonBuilder()
      .setEmoji("🔀")
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("N_shuffle")
        ])

        client.diSwitch3 = new ActionRowBuilder().addComponents([
            new ButtonBuilder()
              .setLabel("Queue")
              .setDisabled(true)
              .setStyle(ButtonStyle.Secondary)
              .setCustomId("N_queue"),
        
            new ButtonBuilder()
              .setLabel("Clear Queue")
              .setDisabled(true)
              .setStyle(ButtonStyle.Secondary)
              .setCustomId("N_clear_queue")
          ]);
};