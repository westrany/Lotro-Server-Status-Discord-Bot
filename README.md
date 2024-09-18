# Lotro Server Status Discord Bot
A Discord bot built to monitor and provide updates on the server statuses for the game Lord of the Rings Online (LOTRO). The bot allows users to check server statuses, monitor server changes, and receive real-time notifications when server statuses change.  

Add this bot to your Discord server [here](https://discord.com/oauth2/authorize?client_id=1285998173294301234&permissions=2147567680&integration_type=0&scope=bot+applications.commands)!



# Index  

1. [Features](#features)  
2. [Technologies Used](#technologies-used)  
3. [Getting Started](#getting-started)  
    3.1. [Prerequisites](#prerequisites)  
    3.2. [Clone the Repository](#clone-the-repository)  
    3.3. [Install dependencies with NPM install](#install-dependencies-with-npm-install)  
    3.4. [Environment Variables](#environment-variables)  
    3.5. [Bot Commands](#bot-commands)  
4. [How to Run the Bot Locally](#how-to-run-the-bot-locally)  
5. [Deploying the Bot with Railway](#deploying-the-bot-with-railway)  
6. [Commands Overview](#commands-overview)  
    6.1. [/status](#status)  
    6.2. [/monitor](#monitor)  
7. [Known Issues](#known-issues)  
8. [Contributions](#contributions)  
9. [License](#license)  
10. [Acknowledgements](#acknowledgements)  
11. [Final Notes](#final-notes)  

## Features  

- **/status:** Check the status of all LOTRO servers or a specific server.
- **/monitor:** Monitor server statuses and receive updates when they change.
- **Status notifications** are embedded for clarity and aesthetics.
- **Real-time server status updates** using Discord slash commands.

## Technologies Used  

- **Node.js** for the bot's backend logic.
- **discord.js** to interact with Discord's API.
- **Railway** as a hosting platform to run the bot 24/7.

## Getting Started

### Prerequisites

To get started, you’ll need:

- Node.js installed (v14.0.0 or higher recommended).
- Discord Developer Account to create a bot and get your bot's token.
- Railway (or any other hosting platform) to host the bot.

### Clone the Repository
```git clone https://github.com/yourusername/Lotro-Server-Status-Discord-Bot.git```  

### Install dependencies with NPM install  
```npm instal```

### Environment Variables  
Create a .env file in the root of the project and add the following environment variables:  
```
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_APPLICATION_ID=your_discord_application_id
```

### Bot Commands
The bot offers the following commands:

1. **/status:** Check the status of LOTRO servers.  

    - Optional ```server``` argument to check the status of a specific server.  

2. **/monitor:** Enable real-time monitoring of LOTRO servers.
    - The bot will notify you when servers go down or come back up.

## How to Run the Bot Locally

1. **Register Commands** (only needed when setting up or updating commands): To register commands globally, run:
``` node register.js ```

2. **Start the Bot:** To run the bot locally, use the following command:  
```npm run start```
The bot will now be live and ready to interact in your Discord server.

## Deploying the Bot with Railway  

1.**Deploy to Railway:** You can deploy the bot to Railway for 24/7 uptime.  
    - Link your GitHub repository and deploy the bot directly from the Railway dashboard.  
    - Set up environment variables (```DISCORD_TOKEN```, ```DISCORD_CLIENT_ID```, ```DISCORD_APPLICATION_ID```) in the Railway environment.  

2. **Monitor Usage:** Railway gives you $5 credit with a free tier which should be enough to keep this running for about 21 days. _I am currently looking for a free alternative._

## Commands Overview  

### ```/status```  

**Description:** Check the status of all LOTRO servers or a specific server.  

- Example: ``/status`` shows the status of all servers.  
- Example: ``/status server:Angmar`` shows the status of the "Angmar" server.    

### ```/monitor```  

**Description:** Starts monitoring the status of LOTRO servers. The bot sends notifications when server statuses change.  

- Example: ```/monitor``` in a channel will enable monitoring in that channel.  
- The bot will send grouped status changes for multiple servers.

## Known Issues  

1. Ensure your Discord bot has the necessary permissions in your server to send messages and respond to slash commands.   
2. The bot will go to sleep after using all of Railway's free tier $5 credit. _I am currently looking for free alternatives to this._

## Contributions  

Feel free to fork this repository and submit pull requests. Issues and feature requests are welcome!  

## License  

This project is free to use under the MIT Licence. Just remember to give credit where credit is due!

## Acknowledgements  

A very special thanks to dt192 for helping me brainstorm, structure and debug this bot.  

## Final Notes  

- Make sure to regularly update your bot's commands by re-running the register.js script when necessary.  
- If you experience any issues, feel free to raise an issue on the repository or contact me directly via GitHub.  




 
