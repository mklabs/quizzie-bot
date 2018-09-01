const debug = require('debug')('quizzie-bot:quizz');
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

  const pointsMessage = pointsMap
    .sort((a, b) => a.point < b.point)
    .map((score, i) => {
      return `#${i + 1} (${score.point}) - ${score.user}`;
    });

  debug('pointsMessage', pointsMessage, !!pointsMessage);
  if (pointsMessage.length) await message.channel.send(pointsMessage);
};

const assignWinner = async (client, message, map) => {
  const pointsMap = Object.keys(points).map(user => ({
    user,
    point: points[user]
  }));

  const pointsSorted = pointsMap.sort((a, b) => a.point < b.point);
  const winner = pointsSorted[0];

  if (!winner) {
    await message.channel.send(
      "Pas de gagnant :( Personne n'a marqué de points."
    );
  } else {
    await message.channel.send(
      `And the **winner** is **${winner.user}**!! Tu as gagné ${
        winner.point
      } :cookie:.`
    );
  }
};

const quizzGame = async (client, message, map) => {
  const time = map.get('quizz-time') || 30;
  debug('Quizz game with time:', time);
  points = {};

  // Stop in time
  const to = setTimeout(
    () => quizzGameStop(client, message, map),
    1000 * 60 * time
  );

  const questions = Array.from(db.results);
  const messageLoop = async question => {
    if (!question) {
      debug('End of quizz, stop it.');
      clearTimeout(to);
      return await quizzGameStop(client, message, map);
    }

    const correctAnswer = decodeURIComponent(
      question.correct_answer
    ).toLowerCase().trim().replace(/\.$/, '');

    // todo: prefix when stopping quizz
    message.channel
      .send(`**${decodeURIComponent(question.question)}**`)
      .then(() => {
        message.channel
          .awaitMessages(
            response => correctAnswer === response.content.toLowerCase() || response.content === 'Stop' || response.content === '!quizz stop',
            {
              max: 1,
              time: 30000,
              errors: ['time']
            }
          )
          .then(async collected => {
            const msg = collected.get(message.channel.lastMessageID);

            // todo: prefix
            if (msg.content === 'Stop' || msg.content === '!quizz stop') {
              return quizzGameStop(client, message, map);
            }

            message.channel.send(
              `Correct ${
                msg.author
              } - La bonne réponse était **${correctAnswer}**.`
            );

            const author = msg.author.toString();
            points[author] = (points[author] || 0) + 1;

            await countPoints(client, message, map);
            messageLoop(questions.shift());
          })
          .catch(() => {
            message.channel.send(
              `Plus de temps! La réponse correct était **${decodeURIComponent(
                question.correct_answer
              )}**`
            );

            messageLoop(questions.shift());
          });
      });
  };

  // call once to kick in the process
  messageLoop(questions.shift());
};

module.exports = {
  quizzGame,
  quizzGameStop
};
