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

/** @description - Create card obj to handle card actions.
  * @param {array} isOpened - List opened cards to match.
  * @param {integer} matched - Counts the opened cards.
  * @param {function} open - Function to open cards.
  * @param {function} check - Function to check if cards are matched or not.
  */
const card = {
    'isOpened': [],
    'matched' : 0,
    'open'    : function(e) {
        // Check if the target is a card and game is running.
        if (e.target.nodeName === 'LI' && e.target.className === 'card' && game.isActive) {
            // Store clicked card in a variable.
            let picked = e.target;
            // Check how many cards are opened.
            let opened = card.isOpened.length;
            switch (opened) {
                case 0:
                    // Display card.
                    picked.classList.add('open', 'show');
                    // Store picked card.
                    card.isOpened.push(picked);
                    break;
                case 1:
                    // Display card.
                    picked.classList.add('open', 'show');
                    // Store newCard so that only two cards are opened.
                    card.isOpened.push(picked);
                    card.check(picked, card.isOpened[0]);
                    break;
            }
        } else if (!game.isActive) {
            game.start();
            console.log('Game started');
        }
    },
    'check'   : function(newCard, oldCard) {
        // Check if cards are the same.
        if (newCard.children[0].className === oldCard.children[0].className) {
            // Match the cards.
            newCard.classList.add('match');
            oldCard.classList.add('match');
            // Increase matched cards.
            card.matched += 2;
            // Clear opened cards.
            card.isOpened = [];
            // Increase player moves.
            // player.moves++;

            // Check if player has opened all cards.
            // if (card.matched === deck.children.length) {
            //     setTimeout(game.end, 500);
            // }
        } else {
            // Add unMatch class.
            newCard.classList.add('unMatched');
            oldCard.classList.add('unMatched');
            setTimeout(function() {
                // Hide cards.
                newCard.classList.remove('open', 'show', 'unMatched');
                oldCard.classList.remove('open', 'show', 'unMatched');
                // Clear opened cards.
                card.isOpened = [];
                // Increase player moves.
                // player.moves++;
            }, 700);
        }
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
deck.addEventListener('click', card.open);
