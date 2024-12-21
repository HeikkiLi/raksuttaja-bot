require('dotenv').config()

let Roll = require('roll')
let { getWeather }= require('./weather.js');

const {Client, RichEmbed, Embed} = require('discord.js');
const fetch = require("node-fetch")

const client = new Client();
const roll = new Roll();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
  if(msg.content){
    console.log("msg.content: " + msg.content);
    const tokens = msg.content.split(' ');
    console.log(tokens);

    if (tokens[0] === 'ping') {
      msg.reply('pong');
    }
    else if(tokens[0] === '!roll'){
      if(tokens.length === 1){
        msg.reply("anna nopat!");
      }
      else{
        try{
          let rollArgs = msg.content.substring(msg.content.indexOf(' ')+1);
          let diceVal = roll.roll(rollArgs);
          if(diceVal.rolled.length === 1){
            msg.reply(diceVal.result);
          }
          else{
            msg.reply(diceVal.result + " (" + diceVal.rolled + ")");
          }
        }
        catch(e){
          console.log(e);
        }
      }
    }
    else if(tokens[0] === '!sää'){
      if(tokens.length > 1){
        const city = tokens.slice(1, tokens.length).join(" ");
        getWeather(city, msg);
      }
      else {
        msg.reply("Anna kaupunki!");
      }
    }
    else if(tokens[0] === '!gif'){
      const keyWords = tokens.slice(1, tokens.length).join(" ");
  
      const url = `https://tenor.googleapis.com/v2/search?q=${keyWords}&key=${process.env.TENOR_KEY}&limit=25&contentfilter=low`;
      
      const response = await fetch(url);
      const result = await response.json();

      const index = Math.floor(Math.random() * result.results.length);
      
      const gifUrl = result.results[index]["media_formats"]["gif"]["url"];

      // Send the GIF URL as a message back to the channel
      msg.channel.send(gifUrl);
      
    }
    else if(tokens[0] === '!poll'){
      const Embed = new RichEmbed()
                              .setColor(0xFFC300)
                              .setTitle("Initiate Poll")
                              .setDescription("!poll to initiate a poll.");
      if(!tokens[1]){
        msg.channel.send(Embed);
      }
      else{
        const keyWords = tokens.slice(1, tokens.length).join(" ");

        msg.channel.send("📋 " + "**" + keyWords + "**").then(messageReaction => {
          messageReaction.react("👍");
          messageReaction.react("👎");
          msg.delete(3000).catch(console.error);
        })
      }

    }
  }
  
});

client.login(process.env.BOT_TOKEN);
