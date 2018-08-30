module.exports = (client, config) => ({
  embed: {
    color: 3447003,
    author: {
      name: client.user.username,
      icon_url: client.user.avatarURL
    },
    title: '!prefix [prefix]',
    description: 'This command allow you to change or see the current prefix',
    fields: [
      {
        name: 'Argument: prefix',
        value: 'When specified, change the current prefix.'
      },
      {
        name: 'Current Prefix',
        value: `The prefix is currently set to **${config.prefix}**`
      }
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: '© openquizzdb-bot'
    }
  }
});
