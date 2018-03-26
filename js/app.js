/*
 * Store the game's deck in a variable.
 */

const deck = document.querySelector('.deck');

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/** @description - Create game obj in order to handle the game.
  * @param {boolean} isActive - Checks if game is running.
  * @param {boolean} isPaused - Check if game is paused.
  * @param {function} start - Start the game by shuffling the deck.
  */
const game = {
    'isActive': false,
    'isPaused': false,
    'start'   : function() {
        // Store the list of cards.
        let cards = Array.from(deck.children);
        // Shuffle the cards.
        cards = shuffle(cards);
        for (let card of cards) {
            // Remove any previous data that the card had.
            card.classList.remove('show', 'open', 'match');
            deck.appendChild(card);
        }
        // Start the game.
        game.isActive = true;
        // TODO: Create timer.
    }
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/*
 * Add DOMContentLoaded event to document for a fresh start.
 */
// document.addEventListener('DOMContentLoaded', newGame);
