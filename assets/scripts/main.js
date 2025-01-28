const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const modal = document.getElementById('pokemonModal');
const modalDetails = document.getElementById('modalDetails');
const closeButton = document.querySelector('.close-button');

const maxRecords = 151;
const limit = 12;
let offset = 0;

let loadedPokemons = [];

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-id="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function addPokemonClickEvents() {
    const pokemonItems = document.querySelectorAll('#pokemonList .pokemon');

    pokemonItems.forEach((pokemonItem) => {
        pokemonItem.addEventListener('click', () => {
            const pokemonId = pokemonItem.getAttribute('data-id');
            const clickedPokemon = loadedPokemons.find((pokemon) => pokemon.number === parseInt(pokemonId));

            if (clickedPokemon) {
                // Exibe os detalhes do Pokémon
                modalDetails.innerHTML = `
                    <h1>#${clickedPokemon.number} ${clickedPokemon.name} </h1>
                    <img src="${clickedPokemon.photo}" alt="${clickedPokemon.name}">
                    <h2>Types:</h2>
                    <ol class="types">
                        ${clickedPokemon.types.map(type => `<li>${type}</li>`).join('')}
                    </ol>
                    <h2>Stats:</h2>
                    <ol class="stats">
                        ${clickedPokemon.stats.map((stat) =>
                    `<li class="stat">
                                <span class="name">${stat.stat.name} </span>
                                :
                                <span class="value">${stat.base_stat} </span>
                            </li>`
                ).join('')}
                    </ol>
                `;

                // Exibe o modal
                modal.style.display = 'flex';
            }
        });
    });

}

// Fecha o modal ao clicar no botão de fechar
closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Fecha o modal ao clicar fora da área de conteúdo
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        // Atualiza o array de Pokémons carregados
        loadedPokemons = [...loadedPokemons, ...pokemons];

        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;

        //Adiciona os eventos de clique após os elementos serem inseridos no DOM (OBS: MODIFICAR ESSA CORREÇÂO) 
        addPokemonClickEvents();
    });
}

// Carrega os primeiros Pokémons
loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNexPage = offset + limit;

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});
