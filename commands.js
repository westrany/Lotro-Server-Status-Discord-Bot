const { SlashCommandBuilder } = require('discord.js');

// Define the commands
const commands = [
  new SlashCommandBuilder()
    .setName('status')
    .setDescription('Check the status of LOTRO servers or a specific server')
    .addStringOption(option =>
      option.setName('server')
        .setDescription('The name of the server you want to check')
        .setRequired(false)), // The server option is optional
  new SlashCommandBuilder()
    .setName('monitor')
    .setDescription('Start monitoring server statuses and post updates when they change')
];

// Export commands
module.exports = commands.map(command => command.toJSON());
