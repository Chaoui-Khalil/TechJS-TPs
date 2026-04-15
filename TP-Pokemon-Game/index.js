#!/usr/bin/env node

const inquirer = require("inquirer");
const { getPokemon } = require("./api");
const { attack, isDead } = require("./game");

// choisir pokemon joueur
async function choosePokemon() {
  const { name } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Choose your pokemon (pikachu, charmander, bulbasaur, squirtle):"
    }
  ]);

  return await getPokemon(name.toLowerCase());
}

// bot choisit un move valide (PP > 0)
function botChooseMove(pokemon) {
  const availableMoves = pokemon.moves.filter(m => m.pp > 0);

  if (availableMoves.length === 0) return null;

  return availableMoves[
    Math.floor(Math.random() * availableMoves.length)
  ];
}

// joueur choisit un move
async function chooseMove(pokemon) {
  const availableMoves = pokemon.moves.filter(m => m.pp > 0);

  if (availableMoves.length === 0) {
    console.log("❌ No moves left!");
    return null;
  }

  const { move } = await inquirer.prompt([
    {
      type: "list",
      name: "move",
      message: "Choose your move:",
      choices: availableMoves.map((m) => ({
        name: `${m.name} (Power: ${m.power || 0}, Acc: ${m.accuracy || 100}, PP: ${m.pp})`,
        value: m.name
      }))
    }
  ]);

  return pokemon.moves.find((m) => m.name === move);
}

// jeu principal
async function startGame() {
  console.log("🎮 Pokemon Battle Start!\n");

  const player = await choosePokemon();

  const pokemons = ["pikachu", "charmander", "bulbasaur", "squirtle"];
  const randomName =
    pokemons[Math.floor(Math.random() * pokemons.length)];

  const bot = await getPokemon(randomName);

  console.log(`👤 You chose ${player.name}`);
  console.log(`🤖 Bot chose ${bot.name}`);

  // boucle du jeu
  while (player.hp > 0 && bot.hp > 0) {
    console.log(`\n❤️ Player HP: ${player.hp} | Bot HP: ${bot.hp}`);

    // tour joueur
    const playerMove = await chooseMove(player);
    if (!playerMove) break;

    attack(player, bot, playerMove);

    if (isDead(bot)) break;

    // tour bot
    const botMove = botChooseMove(bot);
    if (!botMove) {
      console.log("🤖 Bot has no moves left!");
      break;
    }

    attack(bot, player, botMove);

    if (isDead(player)) break;
  }

  console.log("\n🏁 GAME OVER");

  if (player.hp > bot.hp) {
    console.log("🏆 You win!");
  } else if (player.hp < bot.hp) {
    console.log("💀 You lose!");
  } else {
    console.log("🤝 It's a draw!");
  }
}

startGame();