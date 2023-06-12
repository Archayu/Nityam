const invitedBy = require("../../Models/Invites"),
      invites = require("../../Models/Invites");


module.exports = async (client, member) => {
    const inviteByData = await invitedBy.findOne({ Guild: member.guild.id, User: member.id });

    if(inviteByData) {
        const inviteData = await invites.findOne({ Guild: member.guild.id, User: inviteByData.inviteUser });
        if (inviteData) {
            inviteData.Invites -= 1;
            inviteData.Left += 1;
            inviteData.save();
        }
    }
}