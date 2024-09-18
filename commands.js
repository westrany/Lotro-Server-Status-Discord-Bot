const { SlashCommandBuilder } = require('discord.js');

// Define all commands
const commands = [
  new SlashCommandBuilder()
    .setName('status')
    .setDescription('Check the status of LOTRO servers'),
    
  // Add more commands as needed
];

// Export commands as JSON to be used in the bot
module.exports = commands.map(command => command.toJSON());
