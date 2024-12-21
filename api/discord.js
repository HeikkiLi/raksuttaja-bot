const { InteractionType } = require('discord-api-types/v10');
const weatherCommand = require('./commands/weather');
const gifCommand = require('./commands/gif');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const interaction = req.body;

        // Handle interaction
        if (interaction.type === InteractionType.ApplicationCommand) {
            const { commandName } = interaction.data;

            switch (commandName) {
                case 'weather':
                    return weatherCommand(interaction);
                case 'gif':
                    return gifCommand(interaction);
                default:
                    return res.status(400).json({ error: 'Unknown command' });
            }
        }

        return res.status(400).json({ error: 'Unhandled interaction type' });
    }

    res.status(405).json({ error: 'Method Not Allowed' });
};
