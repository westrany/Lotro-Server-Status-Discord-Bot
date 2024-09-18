const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

// Create a new Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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
    'Treebeard': 'http://gls.lotro.com/GLS.DataCenterServer/StatusServer.aspx?s=10.192.145.137'
};

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Function to check the status of each server
async function checkServers() {
    let serversUp = 0; // Counter for how many servers are up
    const totalServers = Object.keys(serverUrls).length;
    const serverStatuses = [];

    // Cycle through each server
    for (const [serverName, url] of Object.entries(serverUrls)) {
        try {
            // Fetch the status page for each server
            const response = await axios.get(url);

            // Check if the page contains 'AngmarStd' (indicating the server is up)
            const isUp = response.data.includes('AngmarStd');
            serverStatuses.push({ serverName, status: isUp ? 'UP' : 'DOWN' });

            if (isUp) serversUp++;
        } catch (error) {
            console.error(`Error checking ${serverName}: ${error.message}`);
            serverStatuses.push({ serverName, status: 'ERROR' });
        }
    }

    return {
        worldStatus: serversUp >= totalServers / 2 ? "World is UP" : "World is DOWN",
        serverStatuses
    };
}

// Command handler
client.on('messageCreate', async (message) => {
    if (message.content === '!status') {
        const { worldStatus, serverStatuses } = await checkServers();
        let statusMessage = `World Status: ${worldStatus}\n`;
        for (const { serverName, status } of serverStatuses) {
            statusMessage += `${serverName}: ${status}\n`;
        }
        message.channel.send(statusMessage);
    }
});

// Login the bot
client.login('BOT-TOKEN-HERE');
