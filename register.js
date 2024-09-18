const { commands } = require('./commands.js'); // Use require instead of import
const fetch = require('node-fetch'); // Use require for node-fetch

/**
 * This file is meant to be run from the command line, and is not used by the
 * application server. It's allowed to use node.js primitives, and only needs
 * to be run once.
 */

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
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${token}`,
    },
    method: 'PUT',
    body: JSON.stringify(commands),  // Register all commands from commands.js
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

// Call the function to register the global commands
registerGlobalCommands();
