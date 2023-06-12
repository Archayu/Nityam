const { EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");

const GMessage = new Database("./Models/Json/message.json", { databaseInObject: true });
const GSetup = new Database("./Models/Json/setup.json", { databaseInObject: true });


module.exports = async (client, queue, song) => {
    const db = await GSetup.get(queue.textChannel.guild.id);
    if (db.setup_enable === true) return;

    const data = await GMessage.get(queue.textChannel.guild.id);
    const msg = await queue.textChannel.messages.cache.get(data.message_id);

    const embed = new EmbedBuilder()
        .setDescription(`**Queued • [${song.name}](${song.url})** \`${song.formattedDuration}\` • ${song.user}`)
        .setColor(client.color)

    await msg.edit({ content: " ", embeds: [embed] })
}