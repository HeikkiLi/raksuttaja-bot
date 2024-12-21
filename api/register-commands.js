const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

// Ensure that these environment variables are correctly loaded
const clientId = process.env.CLIENT_ID;
const token = process.env.BOT_TOKEN;

if (!clientId || !token) {
  console.error("CLIENT_ID or BOT_TOKEN is missing in .env");
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(token);

async function registerCommands() {
  const commands = [
    {
      name: 'ping',
      description: 'Replies with pong',
    },
    {
      name: 'roll',
      description: 'Roll a dice',
      options: [
        {
          type: 3,  // STRING
          name: 'dice_expression',
          description: 'Enter the dice expression (e.g., 2d6)',
          required: true,
        },
      ],
    },
    {
      name: 'sää',
      description: 'Get weather information for a city',
      options: [
        {
          type: 3,  // STRING
          name: 'city',
          description: 'Enter the city name',
          required: true,
        },
      ],
    },
  ];

  try {
    console.log('Started refreshing application (/) commands.');
    // Registering commands globally for the bot
    await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    });
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

registerCommands();