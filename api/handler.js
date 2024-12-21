const weatherCommand = require('./commands/weather');
const gifCommand = require('./commands/gif');

// Command router function
module.exports = async (interaction) => {
    const { commandName } = interaction.data;

    switch (commandName) {
        case 'weather':
            return weatherCommand(interaction);
        case 'gif':
            return gifCommand(interaction);
        default:
            return {
                type: 4,
                data: {
                    content: 'Unknown command! Please try again.',
                },
            };
    }
};
