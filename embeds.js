const { EmbedBuilder } = require('discord.js');

// Function to create a server status embed for a single server
function createServerStatusEmbed(serverName, serverStatus, statusEmoji) {
  const color = serverStatus === 'UP' ? '#00FF00' : '#FF0000'; // Green for UP, Red for DOWN
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(`${serverName} Server Status`)
    .setDescription(`${serverName} is ${serverStatus} ${statusEmoji}`)
    .setFooter({ text: 'Server status information' })
    .setTimestamp();  // Include current timestamp
}

// Function to create an embed for all server statuses
function createAllServerStatusEmbed(serverStatuses) {
  const embed = new EmbedBuilder()
    .setColor('#0099ff')  // Default color for all statuses
    .setTitle('Server Statuses')
    .setFooter({ text: 'Last updated' })
    .setTimestamp();  // Include current timestamp

  // Add each server and its status as a field in the embed
  for (const [server, status] of Object.entries(serverStatuses)) {
    const statusIcon = status === 'UP' ? '✅' : '⛔';
    embed.addFields({ name: server, value: statusIcon, inline: true });
  }

  return embed;
}

module.exports = { createServerStatusEmbed, createAllServerStatusEmbed };
