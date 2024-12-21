require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [
  {
    name: 'roll',
    description: 'Roll a dice',
    options: [
      {
        name: 'dice',
        type: 3, // String
        description: 'Dice notation (e.g., 1d6)',
        required: true,
      },
    ],
  },
  {
    name: 'weather',
    description: 'Get weather for a city',
    options: [
      {
        name: 'city',
        type: 3, // String
        description: 'City name',
        required: true,
      },
    ],
  },
  {
    name: 'gif',
    description: 'Fetch a random GIF based on keywords',
    options: [
        {
            name: 'keywords',
            type: 3, // String
            description: 'Keywords for the GIF search',
            required: true,
        },
    ],
  },
  // more commands here
];

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
