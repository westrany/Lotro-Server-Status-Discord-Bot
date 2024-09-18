const { commands } = require('./commands.js'); // Keep using CommonJS for other modules

/**
 * Dynamically import node-fetch
 */
async function fetchModule() {
  const fetch = (await import('node-fetch')).default;
  return fetch;
}

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;

if (!token) {
  throw new Error('The DISCORD_TOKEN environment variable is required.');
}
if (!applicationId) {
  throw new Error('The DISCORD_APPLICATION_ID environment variable is required.');
}

async function registerGlobalCommands() {
  const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;
  const fetch = await fetchModule();
  await registerCommands(url, fetch);
}

async function registerCommands(url, fetch) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${token}`,
    },
    method: 'PUT',
    body: JSON.stringify(commands),
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
