function attack(attacker, defender, move) {
  if (move.pp <= 0) {
    console.log(`❌ ${move.name} has no PP left!`);
    return;
  }

  move.pp--;

  // ⚠️ accuracy API = sur 100
  const accuracy = move.accuracy || 100; // si null → 100%

  if (Math.random() * 100 > accuracy) {
    console.log(`❌ ${attacker.name}'s ${move.name} missed!`);
    return;
  }

  const power = move.power || 0; // si null → 0 dégâts

  defender.hp -= power;

  console.log(
    `⚔️ ${attacker.name} used ${move.name} and dealt ${power} damage!`
  );
}

function isDead(pokemon) {
  return pokemon.hp <= 0;
}

module.exports = { attack, isDead };