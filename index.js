//Require the necessaru discord.js classes
const fs = require("node:fs");
const path = require("node:path");
const {Client, Events, GatewayIntentBits, Collection, ReactionUserManager} = require("discord.js");
const { DiscordAPI } = require("./config.json");

//Create a new client instance
const client = new Client({intents: [GatewayIntentBits.Guilds]});

client.commands = new Collection();

const commandPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles){
    const filePath = path.join(commandPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command){
        client.commands.set(command.data.name, command);
    } else {
        console.log("[WARNING] The command at " + filePath + " is missing a required \"data\" or \"execute\" property.");
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command){
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try{
        await command.execute(interaction);
    } catch (error){
        console.error(error);
        await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
    }
});

//When the client is ready, run this code (only once)
//We use "c" for the event parameter to keep it separate from the already defined "client"
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

//Log in to Discord with your client's token
client.login(DiscordAPI.Token);
