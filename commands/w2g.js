const { SlashCommandBuilder } = require("discord.js");
const { W2gAPI } = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
            .setName("w2g")
            .setDescription("Creates a w2g link from a videolink")
            .addStringOption(option =>
                option.setName("video-url")
                    .setDescription("Url for the video to watch together")
                    .setRequired(true)),

    async execute(interaction){
        const url = interaction.options.getString("video-url");
        console.log(url);

        fetch("https://api.w2g.tv/rooms/create.json", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
        body: JSON.stringify({
            "w2g_api_key": W2gAPI.Token,
            "share": url
            })
        })
        .then(response => response.json())
        .then(async function (data) {
            content = "W2G: Here is your room! https://w2g.tv/rooms/" + data.streamkey;
            await interaction.reply(content);
            console.log("User " + interaction.user.username + " used command " + interaction.commandName + " and sent a video successfully!")
        })
        .catch(async error => {
        	await interaction.reply({content:"Något har gått fel!\n Felmeddelandet är: **" + error.toString() + "**", ephemeral:true})
            console.log("User " + interaction.user.username + " used command " + interaction.commandName + " unsuccessfully. The error message is: \n" + error.toString())
        })
    }
}
