
const pokeApi = {}

function getDescription(pokemon) {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemon.number}`;
    
    fetch(url)
        .then(response => response.json())
        .then((data) => {
            const filteredFlavorTextEntries = data.flavor_text_entries.filter(
                (element) => element.language.name === "en"
            );
            
            let description = filteredFlavorTextEntries[0].flavor_text;
            let generation = data.generation.name;
            let generationSplit = generation.split('-');
            let generationUpper = generationSplit[0].charAt(0).toUpperCase() + generationSplit[0].substring(1) + ' ' + generationSplit[1].toUpperCase();
            
            let eggsNames = data.egg_groups.map((e) => {
                return e.name;
            });

            let eggsUpper = eggsNames.map ((e) => {
                return e.charAt(0).toUpperCase() + e.substring(1);
            })
            
            pokemon.eggGroups = eggsUpper.join(', ');
            pokemon.generation = generationUpper;         
            pokemon.description = description.replace('', ' ');
        })

    return pokemon;
}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
    pokemon.height = pokeDetail.height;
    pokemon.weight = pokeDetail.weight;
    pokemon.baseExp = pokeDetail.base_experience;

    const abilities = pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name)
    const [ability] = abilities

    pokemon.abilities = abilities;
    pokemon.ability = ability;

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    const moves = pokeDetail.moves.map((moveSlot) => moveSlot.move.name)
    const [move] = moves

    pokemon.moves = moves
    pokemon.move = move

    const stats = pokeDetail.stats.map((statSlot) => statSlot.base_stat)
    const [stat] = stats

    pokemon.stats = stats
    pokemon.stat = stat

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
        .then(getDescription)
        //.then(getEvolutions)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}
