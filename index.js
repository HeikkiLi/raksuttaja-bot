require('dotenv').config()
let Roll = require('roll')

const Discord = require('discord.js');
const client = new Discord.Client();

const roll = new Roll();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  const words = msg.content.split(' ');
  console.log(words);
  if (words[0] === 'ping') {
    msg.reply('pong');
  }
  else if(words[0] === '!roll'){
    if(words.length === 1){
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
  
});

client.login(process.env.BOT_TOKEN);