require('dotenv').config(); // Load environment variables from .env
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const axios = require('axios');
const commands = require('./commands.js'); // Import commands

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

let monitoringChannel = null;  // This will store the channel ID where monitoring is enabled
let previousServerStatuses = {};  // Store previous statuses to compare changes

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
          // If the status has changed, post an update in the channel
          await channel.send(`Server ${serverName} is now ${status}`);
        }
      }
  
      // Update the previous statuses
      previousServerStatuses = currentStatuses;
    }, 60000);  // Check every 60 seconds
  }
  
  // Single interaction handler
  client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
  
    if (interaction.commandName === 'status') {
      const serverName = interaction.options.getString('server');
      if (serverName) {
        // Fetch specific server status
        const serverStatuses = await checkAllServers();
        const statusMessage = serverStatuses[serverName]
          ? `${serverName}: ${serverStatuses[serverName]}`
          : `Server "${serverName}" not found.`;
        await interaction.reply(statusMessage);
      } else {
        // Fetch all server statuses
        const serverStatuses = await checkAllServers();
        let statusMessage = "Server Statuses:\n";
        for (const [server, status] of Object.entries(serverStatuses)) {
          statusMessage += `${server}: ${status}\n`;
        }
        await interaction.reply(statusMessage);
      }
    } else if (interaction.commandName === 'monitor') {
      // Enable monitoring in the current channel
      monitoringChannel = interaction.channel;
      await interaction.reply('Server status monitoring enabled in this channel.');
  
      // Start monitoring server statuses
      monitorServerStatuses(interaction.channel);
    }
  });
  
  client.login(process.env.DISCORD_TOKEN);
