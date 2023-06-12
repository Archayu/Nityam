require("dotenv").config();
module.exports = {
    webhook: {
        error: "" || process.env.error, //webhook link where error logs are sent
        join: "" || process.env.join, //webhook link where join logs are sent
        leave: "" || process.env.leave, //webhook link where leave logs are sent
    },

    TOKEN: "" || process.env.TOKEN, //Your Bot Token
    MONGO_URI: "" || process.env.MONGO_URI, //Mongo Uri
    EMBED_COLOR: "Orange" || process.env.EMBED_COLOR, //Embed Color
    DEV_ID: "1051806381461745664" || process.env.DEV_ID, //Developer ID
    OWNER_ID: "1051806381461745664" || process.env.OWNER_ID, //Owner ID\
    SEARCH_DEFAULT: ["lofi"],
    LEAVE_EMPTY: parseInt(process.env.LEAVE_EMPTY || "120000"), // 1000 = 1 sec

    // Spotify support playlist more 100+ track || false = default || Can get from here: https://developer.spotify.com/dashboard/applications
    SPOTIFY_TRACKS: parseBoolean(process.env.SPOTIFY_TRACKS || true),
    SPOTIFY_ID: process.env.SPOTIFY_ID || "",
    SPOTIFY_SECRET: process.env.SPOTIFY_SECRET ||""
}

function parseBoolean(ask) {
    if (typeof (ask) === 'string') {
        ask = ask.trim().toLowerCase();
    }
    switch (ask) {
        case true:
        case "true":
            return true;
        default:
            return false;
    }
}

