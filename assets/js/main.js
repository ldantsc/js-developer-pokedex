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
        <img src="${pokemon.photo}"
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
    const detailHtml = `
    <div class="details-title ${classBg}">
            <h1>${pokemon.name}</h1>
            <button onclick="popupButton()" class="close-btn">X</button>
    </div>

    <div class="details-container">
    <img src="${photo}"alt="${pokemon.name}">
    <ol id="more-detail" class="">
        <li><span>name</span><span>${pokemon.name}</span></li>
        <li><span>height</span><span>${pokemon.height}</span></li>
        <li><span>weight</span><span>${pokemon.weight}</span></li>
        <li><span>Abilities</span>${abilities.map((ability) => `<span>abilities</span>${ability.replace("-", " ")}</span>`).join('')}</li>
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
