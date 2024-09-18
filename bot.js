const { Client, GatewayIntentBits } = require('discord.js');
const soap = require('soap');
const axios = require('axios');

// Create a new Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const WSDL_URL = 'https://gls.lotro.com/GLS.DataCenterServer/Service.asmx?WSDL';
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

// Function to check server status
async function checkServerStatus() {
    const statuses = {};
    for (const [server, url] of Object.entries(serverUrls)) {
        try {
            const response = await axios.get(url);
            statuses[server] = response.data.includes('AngmarStd') ? 'OPEN' : 'DOWN';
        } catch (error) {
            statuses[server] = 'ERROR';
            console.error(`Error checking status for ${server}:`, error);
        }
    }
    return statuses;
}

// Command handler
client.on('messageCreate', async (message) => {
    if (message.content === '!status') {
        const statuses = await checkServerStatus();
        let statusMessage = 'LOTRO Server Status:\n';
        for (const [server, status] of Object.entries(statuses)) {
            statusMessage += `${server}: ${status}\n`;
        }
        message.channel.send(statusMessage);
    }
});

// Login the bot
client.login('MTI4NTk5ODE3MzI5NDMwMTIzNA.GJxqkl.1tH8Ndas4CjbB3oBtHNhnsgJDR7u-iQakI1UOQ');
