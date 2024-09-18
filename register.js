const { commands } = require('./commands.js'); // CommonJS for commands
const fetch = require('node-fetch'); // CommonJS for node-fetch

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;

if (!token) {
  throw new Error('The DISCORD_TOKEN environment variable is required.');
}
if (!applicationId) {
  throw new Error('The DISCORD_APPLICATION_ID environment variable is required.');
}

/**
 * Register all commands globally. This can take a few minutes, so ensure that
 * these are the commands you want.
 */
async function registerGlobalCommands() {
  const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;
  await registerCommands(url);
}

/**
 * Function to send the request to Discord API to register commands
 */
async function registerCommands(url) {
  // Log the commands to make sure they're correctly loaded
  console.log('Registering commands:', commands);

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${token}`,
    },
    method: 'PUT',
    body: JSON.stringify(commands),  // Send the commands as JSON
  });

  if (response.ok) {
    console.log('Registered all commands successfully.');
  } else {
    console.error('Error registering commands');
    const text = await response.text();
    console.error(text);
  }
  return response;
}

registerGlobalCommands();
