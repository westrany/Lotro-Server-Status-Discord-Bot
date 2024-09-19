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
        const embed = createAllServerStatusEmbed(serverStatuses);
        await interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      console.error('Error while handling interaction:', error);
      await interaction.editReply('There was an error processing your request.');
    }
  } else if (interaction.commandName === 'monitor') {
    try {
      // Send a reply indicating monitoring is enabled
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setDescription('Server status monitoring enabled in this channel.')
        .setTimestamp();

      monitoringChannel = interaction.channel;
      await interaction.reply({ embeds: [embed] });  // Reply once, no need to defer

      // Start monitoring server statuses (this will run separately from the interaction response)
      monitorServerStatuses(interaction.channel);  
    } catch (error) {
      console.error('Error enabling monitor:', error);
      await interaction.reply('There was an error enabling the server status monitor.');
    }
  }
});

// Function to monitor server statuses and send updates
async function monitorServerStatuses(channel) {
  const checkInterval = 60000; // Check every 60 seconds

  // Store previous statuses to compare with the current status
  const previousStatuses = await checkAllServers();

  // Send initial server status update
  const fullStatusEmbed = createAllServerStatusEmbed(previousStatuses);
  await channel.send({ embeds: [fullStatusEmbed] });

  setInterval(async () => {
    const currentStatuses = await checkAllServers();
    const serversUp = [];
    const serversDown = [];
    let hasStatusChanged = false;  // Flag to track if status has changed

    // Compare current status with the previous ones
    for (const [serverName, status] of Object.entries(currentStatuses)) {
      const previousStatus = previousStatuses[serverName];

      if (status !== previousStatus) {
        hasStatusChanged = true;
        if (status === 'UP') {
          serversUp.push(serverName);
        } else if (status === 'DOWN') {
          serversDown.push(serverName);
        }
        previousStatuses[serverName] = status; // Update the stored status
      }
    }

    // Only send messages if the status has changed
    if (hasStatusChanged) {
      // Handle cases where all servers are up or down
      const allServersUp = Object.values(currentStatuses).every(status => status === 'UP');
      const allServersDown = Object.values(currentStatuses).every(status => status === 'DOWN');

      if (allServersUp) {
        const allUpEmbed = new EmbedBuilder()
          .setColor('#00FF00')
          .setDescription('🎉 All servers are up 🎉')
          .setTimestamp();
        await channel.send({ embeds: [allUpEmbed] });
      } else if (allServersDown) {
        const allDownEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setDescription('⚠️ All servers are down! ⚠️')
          .setTimestamp();
        await channel.send({ embeds: [allDownEmbed] });
      } else {
        // Send grouped messages for servers going up or down
        if (serversUp.length > 0) {
          const upMessage = `✅ ${serversUp.join(', ')} ${serversUp.length > 1 ? 'are' : 'is'} back up ✅`;
          const upEmbed = new EmbedBuilder().setColor('#00FF00').setDescription(upMessage).setTimestamp();
          await channel.send({ embeds: [upEmbed] });
        }

        if (serversDown.length > 0) {
          const downMessage = `⚠️ ${serversDown.join(', ')} ${serversDown.length > 1 ? 'are' : 'is'} down! ⚠️`;
          const downEmbed = new EmbedBuilder().setColor('#FF0000').setDescription(downMessage).setTimestamp();
          await channel.send({ embeds: [downEmbed] });
        }
      }

      // Send the full server status after the changes
      const fullStatusEmbed = createAllServerStatusEmbed(currentStatuses);
      await channel.send({ embeds: [fullStatusEmbed] });
    }
  }, checkInterval);
}

client.login(token);  // Use the token to log in the bot
