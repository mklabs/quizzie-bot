module.exports = (client, config) => ({
  embed: {
    color: 3447003,
    author: {
      name: client.user.username,
      icon_url: client.user.avatarURL
    },

    title: 'Quizzie Bot Help',
    description: 'Here are the available commands:',

    fields: [
      {
        name: 'Configuration',
        value: `
${config.prefix}help   - See detailed informations about available commands or a specific command
${config.prefix}prefix - Get or Set the bot's prefix
`
      },

      {
        name: 'Quizz',
        value: `
${config.prefix}quizz - Starts up a new Quizz session
`
      },
    ],

    timestamp: new Date(),

    footer: {
      icon_url: client.user.avatarURL,
      text: '© quizzie-bot'
    }
  }
});
