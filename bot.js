require('dotenv').config(); // Load environment variables from .env
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const axios = require('axios');
const commands = require('./commands.js'); // Import commands

// Emojis to be used for singular server status enquiries
const happyEmojis = ['😊', '😇', '💚', '🧙🏻‍♂️'];
const sadEmojis = ['😭', '😡', '😈', '🤬'];

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

let monitoringChannel = null;  // This will store the channel ID where monitoring is enabled
let previousServerStatuses = {};  // Store previous statuses to compare changes

// Function to get random emoji
function getRandomEmoji(emojis) {
  return emojis[Math.floor(Math.random() * emojis.length)];
}

// Register the commands on startup
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_APP_ID),
      { body: commands }  // Register the commands from commands.js
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
})();

// Server URLs
const serverUrls = {
  'Angmar': 'http://gls.lotro.com/GLS.DataCenterServer/StatusServer.aspx?s=10.192.145.73',
  'Arkenstone': 'http://gls.lotro.com/GLS.DataCenterServer/StatusServer.aspx?s=10.192.144.103',
  'Belegaer': 'http://gls.lotro.com/GLS.DataCenterServer/StatusServer.aspx?s=10.192.144.153',
  'Brandywine': 'http://gls.lotro.com/GLS.DataCenterServer/StatusServer.aspx?s=10.192.144.113',
  'Crickhollow': 'http://gls.lotro.com/GLS.DataCenterServer/StatusServer.aspx?s=10.192.144.123',
  'Evernight': 'http://gls.lotro.com/GLS.DataCenterServer/StatusServer.aspx?s=10.192.144.163',
  'Gladden': 'http://gls.lotro.com/GLS.DataCenterServer/StatusServer.aspx?s=10.192.144.133',
  'Gwaihir': 'http://gls.lotro.com/GLS.DataCenterServer/StatusServer.aspx?s=10.192.144.173',
  'Landroval': 'http://gls.lotro.com/GLS.DataCenterServer/StatusServer.aspx?s=10.192.144.143',
  'Laurelin': 'http://gls.lotro.com/GLS.DataCenterServer/StatusServer.aspx?s=10.192.144.183',
  'Mordor': 'http://gls.lotro.com/GLS.DataCenterServer/StatusServer.aspx?s=10.33.111.10',
  'Sirannon': 'http://gls.lotro.com/GLS.DataCenterServer/StatusServer.aspx?s=10.192.144.193',
  'Treebeard': 'http://gls.lotro.com/GLS.DataCenterServer/StatusServer.aspx?s=10.192.145.137',
};

// Function to check all server statuses
async function checkAllServers() {
  const serverStatuses = {};

  for (const [serverName, url] of Object.entries(serverUrls)) {
    try {
      const response = await axios.get(url);
      const isUp = response.data.includes('AngmarStd');
      serverStatuses[serverName] = isUp ? 'UP' : 'DOWN';
    } catch (error) {
      console.error(`Error checking ${serverName}: ${error.message}`);
      serverStatuses[serverName] = 'ERROR';
    }
  }

  return serverStatuses;
}

// Function to monitor server statuses
async function monitorServerStatuses(channel) {
  setInterval(async () => {
    const currentStatuses = await checkAllServers();

    // Compare current status with the previous ones
    for (const [serverName, status] of Object.entries(currentStatuses)) {
      if (previousServerStatuses[serverName] && previousServerStatuses[serverName] !== status) {
        const upMessage = `🎉 ${serverName} is back up 🎉`;
        const downMessage = `⚠️ ${serverName} is down! ⚠️`;
        await channel.send(status === 'UP' ? upMessage : downMessage);
      }
    }

    // Update and display server statuses with emoji and server name in a simple list
    statusMessage = "";
    for (const [server, status] of Object.entries(currentStatuses)) {
    const statusIcon = status === 'UP' ? '✅' : '⛔';
    statusMessage += `${statusIcon} ${server}\n`;
    }

    await channel.send(statusMessage);

    // Update the previous statuses
    previousServerStatuses = currentStatuses;
    }, 60000);  // Check every 60 seconds
}

// Single interaction handler
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'status') {
    try {
      await interaction.deferReply();  // Defer reply immediately

      const serverName = interaction.options.getString('server');
      let statusMessage;

      if (serverName) {
        // Normalize server name to lowercase for case-insensitive matching
        const normalizedServerName = serverName.toLowerCase();

        const serverStatuses = await checkAllServers();  // Fetch all server statuses

        // Convert server names to lowercase for comparison
        const serverKey = Object.keys(serverStatuses).find(
          key => key.toLowerCase() === normalizedServerName
        );

        if (serverKey) {
          // If server name is found, return the status with emoji
          const statusEmoji = serverStatuses[serverKey] === 'UP' ? getRandomEmoji(happyEmojis) : getRandomEmoji(sadEmojis);
          statusMessage = `${serverKey} is ${serverStatuses[serverKey]} ${statusEmoji}`;
        } else {
          // Server name not found
          statusMessage = `Server "${serverName}" not found.`;
        }
      } else {
        // Fetch all server statuses and display as a table
        const serverStatuses = await checkAllServers();
        statusMessage = "**SERVER NAME | STATUS**\n";
        for (const [server, status] of Object.entries(serverStatuses)) {
          const statusIcon = status === 'UP' ? '✅' : '⛔';
          statusMessage += `${server.padEnd(20)} | ${statusIcon}\n`;
        }
      }

      await interaction.editReply(statusMessage);  // Edit deferred reply with status
    } catch (error) {
      console.error('Error while handling interaction:', error);
      await interaction.editReply('There was an error processing your request.');
    }
  } else if (interaction.commandName === 'monitor') {
    try {
      await interaction.deferReply();  // Defer reply immediately

      // Set up monitoring and inform the user
      monitoringChannel = interaction.channel;
      await interaction.editReply('Server status monitoring enabled in this channel.');

      // Start monitoring server statuses
      monitorServerStatuses(interaction.channel);
    } catch (error) {
      console.error('Error enabling monitor:', error);
      await interaction.editReply('There was an error enabling the server status monitor.');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
