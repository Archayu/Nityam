const {
  PermissionsBitField, InteractionType, PermissionFlagsBits
} = require("discord.js");
const chalk = require("chalk");
const ytsr = require("@distube/ytsr");
const { SEARCH_DEFAULT } = require("../../Settings/config")
module.exports = async (client, interaction) => {
//=================================== Command Interaction =====================================\\
  if (
    interaction.isCommand ||
    interaction.isContextMenuCommand ||
    interaction.isChatInputCommand
  ) {
    if (!interaction.guild || interaction.user.bot) return;

    await client.createExSetup(interaction);
    await client.createExVoice(interaction);
    const user = client.premiums.get(interaction.user.id);

    let subCommandName = "";
    try {
      subCommandName = interaction.options.getSubcommand();
    } catch {}
    let subCommandGroupName = "";
    try {
      subCommandGroupName = interaction.options.getSubcommandGroup();
    } catch {}

    if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
      const Random = SEARCH_DEFAULT[Math.floor(Math.random() * SEARCH_DEFAULT.length)];
      if(interaction.commandName == "play") {
          let choice = []
          await ytsr(interaction.options.getString("search") || Random, { safeSearch: true, limit: 10 }).then(result => {
              result.items.forEach(x => { choice.push({ name: x.name, value: x.url }) })
          });
          return await interaction.respond(choice).catch(() => { });
      } else if (interaction.options.getSubcommand() == "playskip") {
          let choice = []
          await ytsr(interaction.options.getString("search") || Random, { safeSearch: true, limit: 10 }).then(result => {
              result.items.forEach(x => { choice.push({ name: x.name, value: x.url }) })
          });
          return await interaction.respond(choice).catch(() => { });
      } else if (interaction.options.getSubcommand() == "playtop") {
          let choice = []
          await ytsr(interaction.options.getString("search") || Random, { safeSearch: true, limit: 10 }).then(result => {
              result.items.forEach(x => { choice.push({ name: x.name, value: x.url }) })
          });
          return await interaction.respond(choice).catch(() => { });
      }
  }

    const command = client.slash.find((command) => {
      switch (command.name.length) {
        case 1:
          return command.name[0] == interaction.commandName;
        case 2:
          return (
            command.name[0] == interaction.commandName &&
            command.name[1] == subCommandName
          );
        case 3:
          return (
            command.name[0] == interaction.commandName &&
            command.name[1] == subCommandGroupName &&
            command.name[2] == subCommandName
          );
      }
    });
    if (!command) return;

    console.log(
      chalk.bgRed(
        `[COMMAND] ${interaction.user.tag} Used ${command.name.at(-1)} in ${
          interaction.guild.name
        } (${interaction.guild.id})`
      )
    );
    //check default permission (must need)
    if (
      !interaction.guild.members.me.permissions.has(
        PermissionsBitField.Flags.SendMessages
      )
    )
      return interaction.user.dmChannel.send(
        `I don't have permissions To \`SendMessages\``
      );
    if (
      !interaction.guild.members.me.permissions.has(
        PermissionsBitField.Flags.ViewChannel
      )
    )
      return;
    if (
      !interaction.guild.members.me.permissions.has(
        PermissionsBitField.Flags.EmbedLinks
      )
    )
      return interaction.reply({
        content: `I don't have permissions To \`EmbedLinks\``,
        ephemeral: true,
      });


    const { channel } = interaction.member.voice;
    //check in voice channel
    if (command.settings.inVoice) {
      if (!channel)
        return interaction.reply({
          content: `Command Is Set To Be In Voice Please Get In A Voice Channel`,
          ephemeral: true,
        });
      // check bot perms in voice channel
      if (
        !interaction.guild.members.cache
          .get(client.user.id)
          .permissionsIn(channel)
          .has(command.permissions.channel || [])
      ) {
        return interaction.reply({
          content: `I Don't have permission \`${command.permissions.bot.join(", ")}\``,
          ephemeral: true,
        });
      }
    }

    //check user premium
    if (command.settings.isPremium && !user.isPremium) {
      return interaction.reply({
        content: `This Command Is Set To Be Premium. So Buy Premium To Use This Command`,
        ephemeral: true,
      });
    }
    //check owner
    if (command.settings.isOwner && interaction.user.id !== client.owner) {
      return interaction.reply({
        content: `This Command Is For Owner Only`,
        ephemeral: true,
      });
    }
    //check nsfw
    if(command.settings.isNSFW && !interaction.channel.nsfw) {
      return interaction.reply({
        content: `This Command Can Be Use In Only NSFW channels`,
        ephemeral: true,
      });
    }
    //check bot permissions in guild
    if (
      !interaction.guild.members.me.permissions.has(
        command.permissions.bot || []
      )
    ) {
      return interaction.reply({
        content: `I Need ${command.permissions.bot.join(", ")} To Use This Command`,
        ephemeral: true,
      });
    }
    //check user permissions
    if (!interaction.member.permissions.has(command.permissions.user || [])) {
      return interaction.reply({
        content: `You Need \`${command.permissions.user.join(", ")}\``,
        ephemeral: true,
      });
    }

    if (command) {
      try {
        client.addCount(command.name.at(-1));
        command.run({interaction: interaction, client: client});
      } catch (error) {
        await interaction.reply({
          content: `This Slash Command Is Not Registered And Hence Not Supported`,
          ephmeral: true,
        });
      }
    }
  }
  //=================================== Button Interaction =====================================\\
 // if(interaction.isButton()) {}
};
