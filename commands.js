const { SlashCommandBuilder } = require('discord.js');

// Define the commands
const commands = [
  new SlashCommandBuilder()
    .setName('status')
    .setDescription('Check the status of LOTRO servers or a specific server')
    .addStringOption(option =>
      option.setName('server')
        .setDescription('The name of the server you want to check')
        .setRequired(false)),

  new SlashCommandBuilder()
    .setName('monitor')
    .setDescription('Enable server status monitoring in this channel'),  // Define monitor command
];

// Export commands as JSON
module.exports = commands.map(command => command.toJSON());
