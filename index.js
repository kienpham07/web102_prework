/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for (const game of games) {

        // create a new div element, which will become the game card
        const gameCard = document.createElement('div');

        // add the class game-card CSS properties to the list
        gameCard.classList.add('game-card');

        // add an id and data attribute so we can scroll to this card from the information of the game on search bar
        const slug = game.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        gameCard.id = `game-${slug}`;
        gameCard.setAttribute('data-name', game.name);


        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        gameCard.innerHTML = `
            <img class="game-img" src="${game.img}" alt="${game.name}" />
            <h2>${game.name}</h2>
            <p>${game.description}</p>
            <p>Backers: ${game.backers.toLocaleString("en-US")}</p>
            <p>Pledged: $${game.pledged.toLocaleString("en-US")} - Goal: $${game.goal.toLocaleString("en-US")}</p>
        `;

        // append the game to the games-container
        gamesContainer.appendChild(gameCard);
    }

}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContribution = GAMES_JSON.reduce((total, game) => {
    return total + game.backers;
}, 0)

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `${totalContribution.toLocaleString("en-US")}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalAmountRaised = GAMES_JSON.reduce((total, game) => {
    return total + game.pledged;    
}, 0)

// set inner HTML using template literal
raisedCard.innerHTML = `$${totalAmountRaised.toLocaleString("en-US")}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = `${GAMES_JSON.length.toLocaleString("en-US")}`;


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    const unFundedGames = GAMES_JSON.filter((game) => {
        return game.pledged < game.goal;
    })

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unFundedGames);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    const fullyFundedGames = GAMES_JSON.filter((game) => {
        return game.pledged >= game.goal;
    })

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fullyFundedGames);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
    
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener('click', filterUnfundedOnly);
fundedBtn.addEventListener('click', filterFundedOnly);
allBtn.addEventListener('click', showAllGames);


/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const totalUnfundedGames = GAMES_JSON.reduce((total, game) => {
    if (game.pledged < game.goal) {
        return total + 1;
    }
    return total;
}, 0);

// create a string that explains the number of unfunded games using the ternary operator
const displayStr = `A total of $${totalAmountRaised.toLocaleString("en-US")} has been raised for ${GAMES_JSON.length.toLocaleString("en-US")} games. Currently, ${totalUnfundedGames.toLocaleString("en-US")} ${totalUnfundedGames === 1 ? 'game remains' : 'games remain'} unfunded. We need your help to fund these amazing games!`;

// create a new DOM element containing the template string and append it to the description container
const displayElements = document.createElement('p');
displayElements.innerText = displayStr;
descriptionContainer.append(displayElements);


/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame, ...others] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const displayFirstGame = document.createElement('p');
displayFirstGame.innerText = firstGame.name;
firstGameContainer.append(displayFirstGame);

// do the same for the runner up item
const displaySecondGame = document.createElement('p');
displaySecondGame.innerText = secondGame.name;
secondGameContainer.append(displaySecondGame);


/************************************************************************************
More customization: Implement a search bar / Autocomplete / Smooth scroll features  */

const searchInput = document.getElementById('search-input');
const suggestionsList = document.getElementById('suggestions');

// clicking the decorative magnifier focuses the input
const searchBtn = document.querySelector('.search-btn');
if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => searchInput.focus());
}

// Clear the input and suggestions on page load/restore so previous text doesn't persist
function resetSearch() {
    if (searchInput) searchInput.value = '';
    clearSuggestions();
}

// Run immediately (script runs at end of body) and when page is shown from bfcache
resetSearch();
window.addEventListener('pageshow', (e) => { resetSearch(); });

function clearSuggestions() {
    suggestionsList.innerHTML = '';
    suggestionsList.style.display = 'none';
}

function showSuggestions(items) {
    clearSuggestions();
    if (!items.length) return;
    suggestionsList.style.display = 'block';
    for (const item of items.slice(0, 6)) {
        const li = document.createElement('li');
        li.textContent = item.name;
        li.tabIndex = 0;
        li.addEventListener('click', () => selectGame(item.name));
        li.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') selectGame(item.name);
        });
        suggestionsList.appendChild(li);
    }
}

function selectGame(name) {
    // clear input and suggestions (Delete the query after he user either presses Enter or clicks on an item in the dropdown suggestions.)
    clearSuggestions();
    if (searchInput) searchInput.value = '';

    // smooth scroll to the card matching the name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const el = document.getElementById(`game-${slug}`);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // add a temporary highlight
        el.style.transition = 'box-shadow 0.3s ease';
        const prev = el.style.boxShadow;
        el.style.boxShadow = '0 0 0 4px rgba(0,120,200,0.25)';
        setTimeout(() => { el.style.boxShadow = prev; }, 1200);
    }
}

searchInput.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) return clearSuggestions();
    const matches = GAMES_JSON.filter(g => g.name.toLowerCase().includes(q));
    showSuggestions(matches);
});

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const q = searchInput.value.trim();
        // regardless of match, clear input and suggestions
        // try exact match first, else first partial match
        const exact = GAMES_JSON.find(g => g.name.toLowerCase() === q.toLowerCase());
        const pick = exact || GAMES_JSON.find(g => g.name.toLowerCase().includes(q.toLowerCase()));
        if (pick) selectGame(pick.name);
        else resetSearch();
    } else if (e.key === 'ArrowDown') {
        // focus first suggestion if present
        const first = suggestionsList.querySelector('li');
        if (first) first.focus();
    }
});

// close suggestions on outside click or Escape
document.addEventListener('click', (e) => {
    if (!e.composedPath().includes(searchInput) && !e.composedPath().includes(suggestionsList)) {
        clearSuggestions();
    }
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') clearSuggestions(); });