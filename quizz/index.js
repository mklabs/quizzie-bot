const debug = require('debug')('openquizzdb-bot:quizz');
const db = require('../db/mythology.json');

let points = {};
const quizzGameStop = async (client, message, map) => {
  debug('Stopping game');

  message.channel.send(`Nous arrêtons le quizz. Voici les points:`);
  countPoints(client, message, map);
  assignWinner(client, message, map);
};

const countPoints = async (client, message, map) => {
  const pointsMap = Object.keys(points).map(user => ({
    user,
    point: points[user]
  }));

  const pointsMessage = pointsMap.sort((a, b) => a.point < b.point).map((score, i) => {
    return `#${i + 1} (${score.point}) - ${score.user}`;
  })

  if (pointsMessage) await message.channel.send(pointsMessage);
};

const assignWinner = async (client, message, map) => {
  const pointsMap = Object.keys(points).map(user => ({
    user,
    point: points[user]
  }));

  const pointsSorted = pointsMap.sort((a, b) => a.point < b.point);
  const winner = pointsSorted[0];

  await message.channel.send(`And the **winner** is **${winner.user}**!! Tu as gagné ${winner.point} :cookie:.`);
};

const quizzGame = async (client, message, map) => {
  const time = map.get('quizz-time') || 30;
  debug('Quizz game with time:', time);
  points = {};

  // Stop in time
  setTimeout(() => quizzGameStop(client, message, map), 1000 * 60 * time);

  const questions = Array.from(db.results);
  const quizzGameLoop = async (answerFound, question) => {
    debug('quizz game loop, answer', answerFound);

    if (!question) {
      debug('End of quizz, stop it.');
      return await quizzGameStop(client, message, map);
    }

    if (answerFound) {
      debug('Question: question', question.question);
      await message.channel.send(`**${question.question}**`);
    }

    // Use once here to not trigger on every message but the current gaming session
    client.once('message', async msg => {
      debug('Received response', msg.content);

      // Good anwser!
      if (msg.content === question.correct_answer) {
        await msg.channel.send(
          `Correct ${msg.author} - La bonne réponse était ${
            question.correct_answer
          }.`
        );

        points[msg.author.toString()] = (points[msg.author.toString()] || 0) + 1;

        await countPoints(client, msg, map);
        return quizzGameLoop(true, questions.shift());
      }

      // Recall quizz game to relisten on every message
      await quizzGameLoop(false, question);
    });
  };

  debug('Start gaming loop session');
  await quizzGameLoop(true, questions.shift());
  debug('End gaming loop session');
};

module.exports = {
  quizzGame,
  quizzGameStop
};
