require("dotenv").config();
module.exports = {
    webhook: {
        error: "https://discord.com/api/webhooks/1085420191137149008/bcD6fxnxVnMQ8l_yV9oljK2aDxXpyNlG7wQ7xeL0ASzbIdJfJONZZHXXi1AQ-gvVKvAv" || process.env.error, //webhook link where error logs are sent
        join: "https://discord.com/api/webhooks/1085425141007274054/QKiL2MuqVqC_ZqmzEgdaQHo64mJRVnrA5ZCzy6cH8sbORw8f11lFRqIwifx7wOA1ZrB-" || process.env.join, //webhook link where join logs are sent
        leave: "https://discord.com/api/webhooks/1085426926488915998/9KKV20TTzian5yOjy_pHVfnLEbUv7mQyUw5mdK_1K3EIQ45BGh39T5KIYbG86PzWpQ2J" || process.env.leave, //webhook link where leave logs are sent
    },

    TOKEN: "OTg4MzU1NDk4MzcxODQyMTA4.Gjd95y.yQWqElusxf_luMFCyn64V670Qlk0m3-5A9632w" || process.env.TOKEN, //Your Bot Token
    MONGO_URI: "mongodb+srv://nityam:nityam@50th.rbhohex.mongodb.net/?retryWrites=true&w=majority" || process.env.MONGO_URI, //Mongo Uri
    EMBED_COLOR: "Orange" || process.env.EMBED_COLOR, //Embed Color
    DEV_ID: "1051806381461745664" || process.env.DEV_ID, //Developer ID
    OWNER_ID: "1051806381461745664" || process.env.OWNER_ID, //Owner ID\
    SEARCH_DEFAULT: ["lofi"],
    LEAVE_EMPTY: parseInt(process.env.LEAVE_EMPTY || "120000"), // 1000 = 1 sec

    // Spotify support playlist more 100+ track || false = default || Can get from here: https://developer.spotify.com/dashboard/applications
    SPOTIFY_TRACKS: parseBoolean(process.env.SPOTIFY_TRACKS || true),
    SPOTIFY_ID: process.env.SPOTIFY_ID || "c594853244e04c22809850ac5515354c",
    SPOTIFY_SECRET: process.env.SPOTIFY_SECRET ||"bc4929f4f59a4d05a3558bcc2c70c2e4"
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

