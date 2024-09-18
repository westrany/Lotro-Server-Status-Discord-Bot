require('dotenv').config(); // Load environment variables from .env
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const axios = require('axios');
const commands = require('./commands.js'); // Import commands

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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

// Check server status
async function checkServerStatus(serverName) {
  const url = serverUrls[serverName];
  if (!url) return `Server "${serverName}" not found.`;

  try {
    const response = await axios.get(url);
    const isUp = response.data.includes('AngmarStd');
    return `${serverName}: ${isUp ? 'UP' : 'DOWN'}`;
  } catch (error) {
    console.error(`Error checking ${serverName}: ${error.message}`);
    return `${serverName}: ERROR`;
  }
}

// Check all servers
async function checkAllServers() {
  let serversUp = 0;
  const totalServers = Object.keys(serverUrls).length;
  const serverStatuses = [];

  for (const [serverName, url] of Object.entries(serverUrls)) {
    try {
      const response = await axios.get(url);
      const isUp = response.data.includes('AngmarStd');
      serverStatuses.push(`${serverName}: ${isUp ? 'UP' : 'DOWN'}`);
      if (isUp) serversUp++;
    } catch (error) {
      console.error(`Error checking ${serverName}: ${error.message}`);
      serverStatuses.push(`${serverName}: ERROR`);
    }
  }

  const worldStatus = serversUp >= totalServers / 2 ? "World is UP" : "World is DOWN";
  return `World Status: ${worldStatus}\n` + serverStatuses.join('\n');
}

// Single interaction handler
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'status') {
    try {
      await interaction.deferReply();  // Defer to give time to fetch the status

      const serverName = interaction.options.getString('server');  // Get the server name from the user input
      let statusMessage;

      if (serverName) {
        // Fetch the status for a specific server
        statusMessage = await checkServerStatus(serverName);
      } else {
        // Fetch the status for all servers
        statusMessage = await checkAllServers();
      }

      await interaction.editReply(statusMessage);  // Edit the reply with the status message
    } catch (error) {
      console.error('Error while handling interaction:', error);
      await interaction.editReply('There was an error processing your request.');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
