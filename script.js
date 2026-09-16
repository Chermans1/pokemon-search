const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const result = document.querySelector("#result");

searchForm.addEventListener("submit", function (event) {
  // Stopper skjemaet fra å laste siden på nytt ved submit
  event.preventDefault();

  getPokemon(searchInput.value.trim().toLowerCase());
});

async function getPokemon(name) {
  try {
    result.innerHTML = `<p>Loading Pokémon...</p>`;
    // Venter på svar fra API-et før koden fortsetter
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

    // Hvis Pokémon ikke finnes, lager vi en feil
    if (!response.ok) {
      throw new Error("Pokémon not found");
    }

    const data = await response.json();

    // Bruker Pokémonens første type for å hente svakheter fra type-endpointet
    const typeName = data.types[0].type.name;

    // Henter alle Pokémon-typene og samler dem til én tekststreng
    const types = data.types
      .map(function (type) {
        return type.type.name;
      })
      .join(", ");

    // Henter mer informasjon om typen
    const typeResponse = await fetch(
      `https://pokeapi.co/api/v2/type/${typeName}`,
    );

    const typeData = await typeResponse.json();

    // Henter artsinformasjon
    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${name}`,
    );

    const speciesData = await speciesResponse.json();

    // Finner den første engelske beskrivelsen i species-dataene
    const flavorText = speciesData.flavor_text_entries.find(function (entry) {
      return entry.language.name === "en";
    });

    // Erstatter spesielle linjeskift fra API-et med vanlige mellomrom
    const description = flavorText.flavor_text
      .replace(/\f/g, " ")
      .replace(/\n/g, " ");

    // Henter habitat og generasjon fra species-data
    const habitat = speciesData.habitat ? speciesData.habitat.name : "ukjent";
    const generation = speciesData.generation.name;

    // Henter alle svakheter fra type-data og samler dem til én tekststreng
    const weaknesses = typeData.damage_relations.double_damage_from
      .map(function (weakness) {
        return weakness.name;
      })
      .join(", ");

    // Lager HTML for alle stats
    let statsHTML = "";

    data.stats.forEach(function (stat) {
      statsHTML += `
        <p>${stat.stat.name}: ${stat.base_stat}</p>
      `;
    });

    // Viser resultatet på nettsiden
    result.innerHTML = `
      <img src="${data.sprites.front_default}" alt="${data.name}">
      
      <h2>${data.name}</h2>
      <p>${description}</p>
      <p>Type: ${types}</p>
      <p>Weaknesses: ${weaknesses}</p>
      <p>Habitat: ${habitat}</p>
      <p>Generation: ${generation}</p>

      <h3>Stats</h3>
      ${statsHTML}
    `;
  } catch (error) {
    // Logger den faktiske feilen i konsollen for feilsøking
    console.error(error);

    // Viser en enkel feilmelding til brukeren
    result.innerHTML = `
      <p>Pokémon not found. Check the name and try again.</p>
    `;
  }
}
