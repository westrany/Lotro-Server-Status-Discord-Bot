const { MessageEmbed } = require('discord.js');

// Function to create a server status embed
function createServerStatusEmbed(serverName, serverStatus, statusEmoji) {
  const color = serverStatus === 'UP' ? '#00FF00' : '#FF0000'; // Green for UP, Red for DOWN
  return new MessageEmbed()
    .setColor(color)
    .setTitle(`${serverName} Server Status`)
    .setDescription(`${serverName} is ${serverStatus} ${statusEmoji}`)
    .setFooter('Server status information')
    .setTimestamp();  // Include current timestamp
}

// Function to create a full server list embed
function createFullStatusEmbed(serverStatuses) {
  const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Server Statuses')
    .setFooter('Last updated')
    .setTimestamp();
  
  // Add each server and status as a field
  for (const [server, status] of Object.entries(serverStatuses)) {
    const statusIcon = status === 'UP' ? '✅' : '⛔';
    embed.addField(server, statusIcon, true);
  }

  return embed;
}

module.exports = { createServerStatusEmbed, createFullStatusEmbed };
