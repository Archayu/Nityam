const { Client, GatewayIntentBits, Collection, RESTEvents, Events } = require("discord.js");
const { DisTube } = require('distube');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { SpotifyPlugin } = require('@distube/spotify');
const { DeezerPlugin } = require('@distube/deezer');



class MainClient extends Client {
	 constructor() {
        super({
            shards: "auto",
            allowedMentions: { parse: ["users", "roles"] },
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildPresences
            ]
        });

    this.config = require("./Settings/config.js");
    this.owner = this.config.OWNER_ID;
    this.dev = this.config.DEV_ID;
    this.color = this.config.EMBED_COLOR;
    this.footer = "Nityam Made With 🚩 By Ayush";
    this.prefix = "/"
    this.distube = new DisTube(this, {
        leaveOnEmpty: false, // Don't set this to "true" for 247 Commands working!
        emptyCooldown: 60,
        leaveOnFinish: false, // Don't set this to "true" for 247 Commands working!
        leaveOnStop: true,
        plugins: [
            new SoundCloudPlugin(),
            new DeezerPlugin(),
            checkSpotify(this)
        ],
    });
    

    if(!this.token) this.token = this.config.TOKEN;

    process.on('unhandledRejection', error => console.log(error));
    process.on('uncaughtException', error => console.log(error));

    const client = this;

    ["slash", "premiums"].forEach(x => client[x] = new Collection());
    ["Command", "Giveaways", "Manager", "Functions","errLogger","Events", "Database",].forEach(x => require(`./Handler/${x}`)(client));

	}
		connect() {
        return super.login(this.token);
    };
};

module.exports = MainClient;

function checkSpotify(client) {
    if (client.config.SPOTIFY_TRACKS) {
        console.log("[INFO] You're (Enabled) Spotify More Tracks Support!");
        return spotifyOn(client);
    } else {
        console.log("[INFO] You're (Not Enabled) Spotify More Tracks Support!");
        return spotifyOff();
    }
}

function spotifyOn(client) {
    return new SpotifyPlugin({
        emitEventsAfterFetching: true,
        api: {
            clientId: client.config.SPOTIFY_ID,
            clientSecret: client.config.SPOTIFY_SECRET
        }
    })
}

function spotifyOff() {
    return new SpotifyPlugin({
        emitEventsAfterFetching: true,
    })
}