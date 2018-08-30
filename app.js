const Discord = require('discord.js');
const config = require('./config.json');
const { ready, guildCreate, guildDelete, onMessage } = require('./routes');

const client = new Discord.Client();
client.login(process.env.token || config.token);

const Enmap = require('enmap');
// Normal enmap with default options
const map = new Enmap({ name: 'settings' });

// Routes

// This event will run if the bot starts, and logs in, successfully.
client.on('ready', ready(client, map));

// This event triggers when the bot joins a guild (discord server)
client.on('guildCreate', guildCreate(client, map));

// This event triggers when the bot leaves a guild (discord server)
client.on('guildDelete', guildDelete(client, map));

// This event triggers when a message is posted on the given server
client.on('message', onMessage(client, map));
