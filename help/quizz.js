module.exports = (client, config) => ({
  embed: {
    color: 3447003,
    author: {
      name: client.user.username,
      icon_url: client.user.avatarURL
    },
    title: `!quizz <argument>`,
    description: `This command allow you to start and configure a new Quizz session`,
    fields: [
      {
        name: `!quizz time ##`,
        value: `Get or set the quizz time (default: 30min). Example: `!quizz time 10` or `!quizz time 5` to set it to 10 or 5 minutes.`
      },
      // {
      //   name: `!quizz config`,
      //   value: `See current quizz configuration`
      // },
      {
        name: `!quizz start`,
        value: `Starts the Quizz game session`
      },
      {
        name: `!quizz stop`,
        value: `Stop the Quizz game session, defining the winner based on previous valid answers.`
      }
      // {
      //   name: `!quizz amount ##`,
      //   value: `Set the number of available questions (default: 30). Example: `!quizz time 100` or `!quizz time 5` to set it to 100 or 5 questions.`
      // },
      // {
      //   name: `!quizz categ <categ>`,
      //   value: `Set the quizz category (default: all). `Available categories (in french):` *all, adultes, animaux, archeologie, arts, bd, celebrites, cinema, culture, gastronomie, geographie, histoire, informatique, internet, litterature, loisirs, monde, musique, nature, quotidien, sciences, sports, television, tourisme*`
      // },
      // {
      //   name: `!quizz diff <diff>`,
      //   value: `Set the quizz difficulty (default: all). `Available difficulties (in french):` *all, 1, 2, 3 (pour facile , moyen, confirmé)*`
      // }
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: `© quizzie-bot`
    }
  }
});
