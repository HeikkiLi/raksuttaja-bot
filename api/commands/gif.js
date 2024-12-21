const fetch = require("node-fetch");

module.exports = async (interaction) => {
    const keywords = interaction.options.getString('keywords');
    if (!keywords) {
        return interaction.reply("Anna hakusanat GIF:lle! Esim: kissa");
    }

    try {
        const url = `https://tenor.googleapis.com/v2/search?q=${keywords}&key=${process.env.TENOR_KEY}&limit=25&contentfilter=low`;
        const response = await fetch(url);
        const result = await response.json();

        if (!result.results || result.results.length === 0) {
            return interaction.reply("Ei löytynyt GIF:iä hakusanoille: " + keywords);
        }

        const index = Math.floor(Math.random() * result.results.length);
        const gifUrl = result.results[index]["media_formats"]["gif"]["url"];

        // Reply with the GIF URL
        return interaction.reply(gifUrl);
    } catch (error) {
        console.error("Error fetching GIF:", error);
        return interaction.reply("Virhe GIF:n hakemisessa!");
    }
};
