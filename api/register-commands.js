const { Client, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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


// Create a new REST client with the bot's token
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

client.once('ready', async () => {
  console.log('Bot is ready!');

  try {
    // Ensure client.user.id is available before attempting to register commands
    console.log('Bot Application ID:', client.user.id);

    console.log('Started refreshing application (/) commands.');

    // Register the commands with Discord API
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: commands,
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
});

// Login to Discord with the bot's token
client.login(process.env.BOT_TOKEN);