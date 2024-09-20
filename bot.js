const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);  // Google's DNS

require('dotenv').config(); // Load environment variables from .env
const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } = require('discord.js');

const token = process.env.DISCORD_TOKEN; // Fetch the token from environment variables 

if (!token) {
  throw new Error('The DISCORD_TOKEN environment variable is required.');
}

const axios = require('axios');
const commands = require('./commands.js'); // Import commands
const { createServerStatusEmbed, createAllServerStatusEmbed } = require('./embeds.js'); // Import embed functions

// Emojis to be used for singular server status enquiries
const happyEmojis = ['😊', '😇', '💚', '🧙🏻‍♂️'];
const sadEmojis = ['😭', '😡', '😈', '🤬'];

// Specify intents and presence
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,  // Include this if your bot listens to messages
    GatewayIntentBits.MessageContent  // Needed for message content access
  ],
  presence: {
    status: 'online',
    activities: [{
      name: '/help',  // Adjust as needed
      type: 'LISTENING'  // Activity type
    }]
  }
});

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
      Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID), // Use the correct environment variable here
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
          // If server name is found, return the status with emoji using an embed
          const statusEmoji = serverStatuses[serverKey] === 'UP' ? getRandomEmoji(happyEmojis) : getRandomEmoji(sadEmojis);
          const embed = createServerStatusEmbed(serverKey, serverStatuses[serverKey], statusEmoji);
          await interaction.editReply({ embeds: [embed] });
        } else {
          // Server name not found
          statusMessage = `Server "${serverName}" not found.`;
          await interaction.editReply(statusMessage);  // Send a simple reply if server not found
        }
      } else {
        // Fetch all server statuses and display in an embed
        const serverStatuses = await checkAllServers();
        let message, color;

        const allServersUp = Object.values(serverStatuses).every(status => status === 'UP');
        const allServersDown = Object.values(serverStatuses).every(status => status === 'DOWN');

        if (allServersUp) {
          message = '🎉 All servers are up! 🎉';
          color = '#00FF00';
        } else if (allServersDown) {
          message = '⚠️ All servers are down! ⚠️';
          color = '#FF0000';
        } else { 
          const downServers = Object.keys(serverStatuses).filter(server => serverStatuses[server] === 'DOWN');
          message = `⚠️ Server ${downServers.join('/') || 'names'} ${downServers.length > 1 ? 'are' : 'is'} down! ⚠️`;
          color = '#FF0000';
        }

        const embed = new EmbedBuilder()
          .setColor(color)
          .setDescription(message);

        await interaction.editReply({ embeds: [embed, createAllServerStatusEmbed(serverStatuses)] });
      }
    } catch (error) {
      console.error('Error while handling interaction:', error);
      await interaction.editReply('There was an error processing your request.');
    }
  }
});

client.login(token);  // Use the token to log in the bot
