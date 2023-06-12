const emoji = require("../../Settings/emojis");

module.exports = (client) => {
  const Purger = require("discord-purger");
  client.purger = new Purger({
    handle: true,
    rejectEmoji: `${emoji.Error}`, // emoji to show on error.
    acceptEmoji: `${emoji.Success}`, // Emoji to show on success.
  });
};
