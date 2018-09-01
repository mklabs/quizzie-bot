const fs = require('fs');
const path = require('path');
const config = require('./config');
const { prefix, help, quizz } = require('./commands');
const debug = require('debug')('quizzie-bot:routes');

const ready = (client, map) => {
  return () => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(
      `Bot has started, with ${client.users.size} users, in ${
        client.channels.size
      } channels of ${client.guilds.size} guilds.`
    );

    debug('Bot has started. Current prefix:', config.prefix);
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the 'ClientUser'.
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
  };
};

const guildCreate = (client, map) => {
  return guild => {
    // This event triggers when the bot joins a guild.
    console.log(
      `New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${
        guild.memberCount
      } members!`
    );

    client.user.setActivity(`Serving ${client.guilds.size} servers`);
  };
};

const guildDelete = (client, map) => {
  return guild => {
    // This event triggers when the bot leaves a guild.
    console.log(
      `Leaving guild: ${guild.name} (id: ${guild.id}). This guild has ${
        guild.memberCount
      } members!`
    );

    client.user.setActivity(`Serving ${client.guilds.size} servers`);
  };
};

const onMessage = (client, map) => {
  // This event triggers when a message is posted on the given server
  return async message => {
    try {
      // We ignore any content not starting with configured prefix or if its the bot itself
      if (!message.content.startsWith(config.prefix) || message.author.bot) return;
      debug('Message:', message.content.toString());

      if (message.content.startsWith(`${config.prefix}ping`)) {
        return await message.channel.send('pong!');
      }

      if (message.content.startsWith(`${config.prefix}help`)) {
        return await help(client, message, map);
      }

      if (message.content.startsWith(`${config.prefix}prefix`)) {
        return await prefix(client, message, map);
      }

      if (message.content.startsWith(`${config.prefix}quizz`)) {
        return await quizz(client, message, map);
      }
    } catch(e) {
      console.error(e);
    }
  };
};

module.exports = {
  ready,
  guildCreate,
  guildDelete,
  onMessage
};
