const fs = require('fs');
const path = require('path');
const config = require('./config');
const debug = require('debug')('openquizzdb-bot:commands');
const helps = require('./help');
const { quizzGame, quizzGameStop } = require('./quizz');

const help = async (client, message, map) => {
  const command = message.content.split(' ').slice(1, 2)[0];
  if (command === 'prefix') {
    return await prefixHelp(client, message);
  }

  if (command === 'quizz') {
    return await quizzHelp(client, message);
  }

  await message.channel.send(
    'Use `help <command>` to view detailled information about a specific command\n**Available commands**'
  );

  return await message.channel.send(helps.help(client, config));
};

const prefixHelp = async (client, message, map) => {
  return await message.channel.send(helps.prefix(client, config));
};

const quizzHelp = async (client, message, map) => {
  return await message.channel.send(helps.quizz(client, config));
};

const prefixChange = async (client, message, map) => {
  // Gets the prefix from the command (eg. "!prefix +" it will take the "+" from it)
  const newPrefix = message.content.split(' ').slice(1, 2)[0];
  // change the configuration in memory
  config.prefix = newPrefix;

  await message.channel.send(`Changing prefix to ${newPrefix}`);
  debug('Changing prefix to %s', newPrefix);

  // Now we have to save the file.
  const configPath = path.join(__dirname, 'config.json');
  return fs.writeFile(configPath, JSON.stringify(config), err => {
    if (err) console.error(err);
  });
};

const prefix = async (client, message, map) => {
  if (message.content === `${config.prefix}prefix`) {
    return await prefixHelp(client, message);
  }

  if (message.content === `${config.prefix}prefix help`) {
    return await prefixHelp(client, message);
  }

  return await prefixChange(client, message);
};

const quizzTime = async (client, message, map) => {
  if (message.content === `${config.prefix}quizz time`) {
    const time = map.get('quizz-time') || 30;

    return await message.channel.send(
      `Please specify a valid time. Example: \`${config.prefix}quizz time 10\`. Current time is set to ${time} minutes.`
    );
  }

  const timeString = message.content.split(' ').slice(2, 3)[0];
  const time = Number(timeString);
  if (isNaN(time)) {
    return await message.channel.send(
      `Please specify a valid time as a number. Example: \`${
        config.prefix
      }quizz time 10\``
    );
  }

  await message.channel.send(`Setting Quizz time to ${time} minutes`);
  map.set('quizz-time', time);
};

const startQuizz = async (client, message, map) => {
  await message.channel.send(`Starting game, get ready!`);
  const time = map.get('quizz-time') || 30;

  await message.channel.send(`Quizz time is set to ${time} minutes.`);
  return await quizzGame(client, message, map);
};

const stopQuizz = async (client, message, map) => {
  await message.channel.send('Stopping quizz.');
  return await quizzGameStop(client, message, map)
};

// todo: handle session
const quizz = async (client, message, map) => {
  if (message.content === `${config.prefix}quizz help`) {
    return await prefixHelp(client, message);
  }

  if (message.content.startsWith(`${config.prefix}quizz time`)) {
    return await quizzTime(client, message, map);
  }

  if (message.content.startsWith(`${config.prefix}quizz start`)) {
    return await startQuizz(client, message, map);
  }

  if (message.content.startsWith(`${config.prefix}quizz stop`)) {
    return await stopQuizz(client, message, map);
  }

  await message.channel.send(`
**Bienvenue à OpenQuizzDB Night** Je vais tester votre connaissance générale
sur le sujet qui vous sied. A la fin de la session, un gagnant s'en ira avec le
titre **QuizzDB Brutasse** et des :cookie:.

La session de jeu commencera lorsque \`!quizz start\` sera lancée, vous pouvez
configurer le quizz selon les commandes suivantes.
`);

  await quizzHelp(client, message);
  // setTimeout(() => startQuizz(client, message, map), 1000 * 30);
  // setTimeout(() => message.channel.send('Le jeu commencera dans 10 secondes ...'), 1000 * 20);
};

module.exports = {
  help,
  quizz,
  prefix,
  prefixHelp,
  prefixChange,
  startQuizz,
  stopQuizz,
  quizzTime
};
