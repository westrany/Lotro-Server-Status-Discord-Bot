# Lotro Server Status Discord Bot  

A Discord bot built to monitor and provide updates on the server statuses for the game Lord of the Rings Online (LOTRO). The bot allows users to check server statuses, monitor server changes, and receive real-time notifications when server statuses change.  

**🔗🤖 Add this bot to your Discord server [here](https://discord.com/oauth2/authorize?client_id=1285998173294301234&permissions=2147567680&integration_type=0&scope=bot+applications.commands)! 🤖🔗**

**Update 24 Sep 2024: bot seems to be working as inteded (I recommend adding /monitor to it's own dedicated channel). New features added: bot now tracks status for Bullroarer and I added a /stop command that you can use in the same channel as /monitor to stop the auto monitoring server status updates**

![image](https://github.com/user-attachments/assets/a984e6b5-5e71-4fe7-b836-e99d9004961f)



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
5. [Commands Overview](#commands-overview)  
    5.1. [/status](#status)  
    5.2. [/monitor](#monitor)  
6. [Known Issues](#known-issues)  
7. [Contributions](#contributions)  
8. [License](#license)  
9. [Acknowledgements](#acknowledgements)  
10. [Final Notes](#final-notes)  

## Features  

![image](https://github.com/user-attachments/assets/a5f85574-5451-4550-9711-571f0cbc8b41)   

- **/status:** Check the status of all LOTRO servers or a specific server.
- **/monitor:** Monitor server statuses and receive updates when they change. Only use in 1 channel per Discord server.
- **/stop:** Command to stop the monitor function, must be used on same channel as /monitor.
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
DISCORD_CLIENT_ID=your_discord_application_id
DISCORD_APPLICATION_ID=your_discord_application_id
```

### Bot Commands
The bot offers the following commands:

1. **/status:** Check the status of LOTRO servers.  

    - Optional ```server``` argument to check the status of a specific server.  

2. **/monitor:** Enable real-time monitoring of LOTRO servers.
    - The bot will notify you when servers go down or come back up.
    - Can only be called in 1 channel per Discord server.
  
3. **/stop:** Disable the real-time monitoring of LOTRO servers.
    - Use on the same channel where you called ```/monitor```.

## How to Run the Bot Locally

1. **Register Commands** (only needed when setting up or updating commands): To register commands globally, run:
``` node register.js ```

2. **Start the Bot:** To run the bot locally, use the following command:  
```npm run start```
The bot will now be live and ready to interact in your Discord server.

## Commands Overview  

### ```/status```  

**Description:** Check the status of all LOTRO servers or a specific server.  

- Example: ``/status`` shows the status of all servers.  

![image](https://github.com/user-attachments/assets/b086a2a2-1836-4919-849d-27acc3c3e9de)  

  
- Example: ``/status server:Angmar`` shows the status of the "Angmar" server.

![image](https://github.com/user-attachments/assets/c130aeb6-111d-454e-81f2-4939062371ca)  
 

### ```/monitor```  

**Description:** Starts monitoring the status of LOTRO servers. The bot sends notifications when server statuses change.  

- Example: ```/monitor``` in a channel will enable monitoring in that channel.  
- The bot will send grouped status changes for multiple servers.

![image](https://github.com/user-attachments/assets/952d22a3-3212-4287-a0b1-4395cfffac5a)  

### ```/stop```

**Description:** Stops monitoring the status of LOTRO servers. Use in same channel as ```/monitor```.

![image](https://github.com/user-attachments/assets/11c5ae31-a833-48cb-8106-938dd3bc6315)

## Known Issues  

1. Bot is currently being hosted for free on FPS. This means that I have to manually click on a button to add more running time to the bot (so if the bot is suddently offline my depest apologies). _I am working on a better alternative._

2. I can't really tell if ```/monitor``` is working as intended since servers don't seem to go up and down all the time. Any feedback on this is very much appreciated! 

## Contributions  

Feel free to fork this repository and submit pull requests. Issues and feature requests are always welcome!  

## License  

This project is free to use under the MIT Licence. Just remember to give credit where credit is due!

## Acknowledgements  

A very special thanks to dt192 for helping me brainstorm, structure and debug this bot.  

## Final Notes  

- Make sure to regularly update your bot's commands by re-running the register.js script when necessary.  
- If you experience any issues, feel free to raise an issue on the repository or contact me directly via GitHub.  




 
