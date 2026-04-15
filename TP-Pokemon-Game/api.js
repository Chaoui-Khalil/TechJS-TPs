const axios = require("axios");

// récupérer un pokemon depuis PokeAPI
async function getPokemon(name) {
  const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
  const res = await axios.get(url);

  const data = res.data;

  // prendre 5 moves max
  const moves = await Promise.all(
    data.moves.slice(0, 5).map(async (m) => {
      const moveRes = await axios.get(m.move.url);
      const moveData = moveRes.data;

      return {
        name: moveData.name,
        power: moveData.power || 0,       // parfois null
        accuracy: moveData.accuracy || 0, // parfois null
        pp: moveData.pp || 0
      };
    })
  );

  return {
    name: data.name,
    hp: 300,
    moves
  };
}

module.exports = { getPokemon };