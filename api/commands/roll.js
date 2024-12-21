const Roll = require('roll');
const roll = new Roll();

module.exports = async (interaction) => {
  const args = interaction.options.getString('dice');
  if (!args) {
    return interaction.reply("Please provide dice notation!");
  }
  
  try {
    const diceVal = roll.roll(args);
    if (diceVal.rolled.length === 1) {
      return interaction.reply(diceVal.result.toString());
    } else {
      return interaction.reply(`${diceVal.result} (${diceVal.rolled})`);
    }
  } catch (error) {
    console.error(error);
    return interaction.reply("Invalid dice notation!");
  }
};
