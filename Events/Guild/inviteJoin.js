const invites = require("../../Models/Invites"),
      invitedBy = require("../../Models/InviteBy"),
      rewards = require("../../Models/InviteRewards")



module.exports = async (client, member, invite, inviter) => {

    if(!invite || !inviter) return;

    let data = await invites.findOne({ Guild: member.guild.id, User: inviter.id });
    if(data) {

        const accountAge = member.user.createdTimestamp;
        const currentTime = Date.now();
        const fourteenDays = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds

        if (currentTime - accountAge < fourteenDays && data.JoinedUsers.includes(member.id)) {
            data.Total += 1;
            data.Rejoin += 1;
            data.save();
          } 
       else if (currentTime - accountAge < fourteenDays) {
            data.Total += 1;
            data.Fake += 1;
            data.JoinedUsers.push(member.id);
            data.save();
          } else if (data.JoinedUsers.includes(member.id)) {
            data.Rejoin += 1;
            data.save();
          } else {
            data.Total += 1;
            data.Invites += 1;
            data.JoinedUsers.push(member.id);
            data.save();
          }

          rewards.findOne({ Guild: member.guild.id, Invites: data.Invites }, async (err, data) => {
            if (data) {
                try {
                    var role = member.guild.roles.cache.get(data.Role);
                    inviter.roles.add(role);
                }
                catch { }
            }
        })

          
    } else {
        data = new invites(
        {
            Guild: member.guild.id,
            User: inviter.id,
            Invites: 0,
            Total: 0,
            Left: 0,
            Rejoin: 0,
            Fake: 0,
            JoinedUsers: []
        }
       ).save();

       const accountAge = member.user.createdTimestamp;
       const currentTime = Date.now();
       const fourteenDays = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds

       if (currentTime - accountAge < fourteenDays) {
           data.Total += 1;
           data.Fake += 1;
           data.Invites += 1;
           data.JoinedUsers.push(member.id);
           data.save();
         } else {
              data.Total += 1;
              data.Invites += 1;
              data.JoinedUsers.push(member.id);
              data.save();
         }

         rewards.findOne({ Guild: member.guild.id, Invites: data.Invites }, async (err, data) => {
            if (data) {
                try {
                    var role = member.guild.roles.cache.get(data.Role);
                    inviter.roles.add(role);
                }
                catch { }
            }
        })

    }

    invitedBy.findOne({ Guild: member.guild.id }, async (err, data2) => {
        if (data2) {
            data2.inviteUser = inviter.id,
                data2.User = member.id
            data2.save();
        }
        else {
            new invitedBy({
                Guild: member.guild.id,
                inviteUser: inviter.id,
                User: member.id
            }).save();
        }
    })


   


}