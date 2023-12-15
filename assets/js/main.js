const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const section = document.getElementById('main-content')
const details = document.getElementById('details-content')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li id="${pokemon.number}" class="pokemon ${pokemon.type}">
        <span class="number">#${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>
        
        <div class="detail">
        <ol class="types">
        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
        </ol>
        <img class="pokemon-img" src="${pokemon.photo}"
        alt="${pokemon.name}">
        </div>
        <button onclick="popupButton(${pokemon.number})" class="btn-details">More details</button>
        </li>
    `
}


function detailPagePokemon(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    fetch(url).then(res => res.json()).then(pokemon => {

    const abilities = pokemon.abilities.map((abilitiesSlot) => abilitiesSlot.ability.name)
    pokemon.abilities = abilities
    const photo = pokemon.sprites.other.dream_world.front_default
    const classBg = pokemon.types[0].type.name
    const convertWeightToPound = ((pokemon.weight / 10) * 2.2).toFixed(1)


    const detailHtml = `
    <div class="details-title ${classBg}">
        <h1>${pokemon.name}</h1>
        <button onclick="popupButton()" class="return-btn"><i class="bi bi-arrow-left"></i></button>
    </div>

    <div class="details-container">
        <img class="details-image" src="${photo}" alt="${pokemon.name}">
            <ol id="more-detail" class="detail-list upper">
                ${pokemon.stats.map((pokemon) => `<li><span>${(pokemon.stat.name).replace('-', ' ')}</span><span class=${pokemon.stat.name}>${pokemon.base_stat}</span></li>`).join('')}
                <li><span>height</span><span class="default-stats">${(pokemon.height/10).toFixed(2)}cm</span></li>
                <li><span>weight</span><span class="default-stats">${convertWeightToPound}lb (${pokemon.weight / 10}kg)</span></li>
                <li><span>abilities</span>${abilities.map((ability) => `<span class="default-stats pd-0">${ability.replace("-", " ")}</span>`)}</li>
            </ol>
    </div>
        `
        details.innerHTML = detailHtml
    })
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

function popupButton(pokemon) {
    if(section.classList.contains("hidden")){
        section.classList.remove("hidden")
        details.classList.add("hidden")
    } else {
        detailPagePokemon(pokemon)
        section.classList.add("hidden")
        details.classList.remove("hidden")
    }
}
