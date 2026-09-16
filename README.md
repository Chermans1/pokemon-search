# Pokémon Search

JavaScript Advanced, oppgave 3. Et søkefelt som henter data om en Pokémon fra PokéAPI og viser bilde, beskrivelse, type, svakheter, habitat, generasjon og stats.

Bygget fordi sønnen min Benjamin er opptatt av Pokémon, så han har vært testeren.

## Slik kjører du den

Åpne `index.html` i en nettleser. Ingen installasjon, ingen API-nøkkel.

## API

[PokéAPI](https://pokeapi.co/), som er gratis og ikke krever nøkkel. Jeg bruker tre endepunkter:

| Endepunkt                 | Hva jeg henter                                   |
| ------------------------- | ------------------------------------------------ |
| `/pokemon/{navn}`         | Navn, bilde, typer og stats                      |
| `/pokemon-species/{navn}` | Beskrivelsen fra spillene, habitat og generasjon |
| `/type/{type}`            | Hva typen tar dobbel skade fra, altså svakheten  |

## Kravene i oppgaven

Oppgaven ba om minst to av tre kriterier. Prosjektet oppfyller alle tre.

1. **Flere ulike endepunkter.** Tre stykker, se tabellen over.
2. **Endepunkt som tar parameter i URL-en.** Alle tre tar navnet eller typen direkte i stien.
3. **Data som må løkkes gjennom.** `forEach()` bygger stats-linjene, `map()` henter typer og svakheter, og `find()` finner den første engelske beskrivelsen.

## Asynkron JavaScript

API-kallene gjøres med fetch i en async-funksjon, og jeg bruker await for å vente på svarene.

Kallene kjører etter hverandre med vilje, ikke i parallell, fordi type-oppslaget trenger typenavnet fra det første svaret.

## To ting som var verdt å lære

**`fetch` kaster ikke feil på 404.** Skriver du «pikchu» svarer API-et 404, men koden går videre som om alt gikk bra, og knekker først når den prøver å lese data som ikke finnes. Derfor sjekker jeg `response.ok` og kaster feilen selv.

**`habitat` kan være `null` for enkelte Pokémon, for eksempel Zoroark.** Uten sjekk kaster `speciesData.habitat.name` en TypeError, som fanges av `catch` og gir brukeren «Pokémon not found» selv om pokemonen ble funnet. Feilmeldingen ville altså løyet. Løst med en enkel sjekk som viser «ukjent» i stedet.

## Beskrivelsene fra spillene

Tekstene i `flavor_text_entries` kommer rett fra spillene og inneholder harde linjeskift, både `\n` og `\f`. De må vaskes bort før teksten vises, ellers blir det rot.

## Design

Vanlig CSS uten rammeverk. Fargene ligger som variabler på `:root`, og `prefers-color-scheme: dark` bytter dem når systemet står i mørk modus.

Spriten fra API-et er bare 96 piksler, så den vises med `image-rendering: pixelated` for å holde seg skarp når den forstørres.

## Filer

| Fil          | Innhold                                        |
| ------------ | ---------------------------------------------- |
| `index.html` | Struktur: skjema og resultatboks               |
| `script.js`  | Henting fra API-et og oppbygging av resultatet |
| `styles.css` | Utseende, mørk modus og responsivt oppsett     |
