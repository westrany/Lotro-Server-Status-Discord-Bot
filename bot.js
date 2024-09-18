require('dotenv').config(); // Load environment variables from .env
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const axios = require('axios');

// Initialize the Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Register the /status command
const commands = [
  {
    name: 'status',
    description: 'Check the status of LOTRO servers',
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    // Use global command registration if bot is intended for multiple servers
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_APP_ID),
      { body: commands }
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
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
async function checkServers() {
  let serversUp = 0;
  const totalServers = Object.keys(serverUrls).length;
  const serverStatuses = [];

  for (const [serverName, url] of Object.entries(serverUrls)) {
    try {
      const response = await axios.get(url);
      const isUp = response.data.includes('AngmarStd');
      serverStatuses.push({ serverName, status: isUp ? 'UP' : 'DOWN' });
      if (isUp) serversUp++;
    } catch (error) {
      console.error(`Error checking ${serverName}: ${error.message}`);
      serverStatuses.push({ serverName, status: 'ERROR' });
    }
  }

  return {
    worldStatus: serversUp >= totalServers / 2 ? "World is UP" : "World is DOWN",
    serverStatuses,
  };
}

// Respond to the slash command
client.on('interactionCreate', async interaction => {
    console.log('Interaction received:', interaction.commandName); // Log interaction
  
    try {
      await interaction.deferReply();
      console.log('Reply deferred'); // Log after deferring the reply
  
      if (interaction.commandName === 'status') {
        const { worldStatus, serverStatuses } = await checkServers();
        let statusMessage = `World Status: ${worldStatus}\n`;
        serverStatuses.forEach(({ serverName, status }) => {
          statusMessage += `${serverName}: ${status}\n`;
        });
  
        await interaction.editReply(statusMessage);
        console.log('Reply sent successfully'); // Log after sending the reply
      }
    } catch (error) {
      console.error('Error handling interaction:', error);
      await interaction.editReply('There was an error while processing your request.');
    }
  });
  
  
