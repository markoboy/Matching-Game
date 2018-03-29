/*
 * Store the game's deck in a variable.
 */

const deck = document.querySelector('.deck');
// Store stars board.
const stars = document.querySelector('.stars');
// Store displayed time.
const displayedMin = document.querySelector('.minutes');
const displayedSec = document.querySelector('.seconds');

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
  * @param {object} time - Create a time obj to handle the timer.
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
        // Start the timer.
        setTimeout(game.time.start, 1000);
    },
    'time'    : {
        'minutes': 0,
        'seconds': 0,
        'start'  : function() {
            // Increase seconds and display it.
            game.time.seconds++;
            game.time.display(displayedSec, game.time.seconds);
            // Check if it is needs to increase the minutes.
            switch (game.time.seconds) {
                case 60:
                    game.time.seconds = 0;
                    game.time.display(displayedSec, game.time.seconds);
                    game.time.minutes++;
                    game.time.display(displayedMin, game.time.minutes);
                    break;
            }
            setTimeout(game.time.start, 1000);
        },
        'display' : function(element, time) {
            // Display 0 infront of the time.
            element.textContent = time < 10 ? `0${time}` : time;
        }
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
        }
    },
    'check'   : function(newCard, oldCard) {
        // Check if cards are the same.
        if (newCard.children[0].className === oldCard.children[0].className) {
            // Change player's score.
            player.score();
            // Match the cards.
            newCard.classList.add('match');
            oldCard.classList.add('match');
            // Increase matched cards.
            card.matched += 2;
            // Clear opened cards.
            card.isOpened = [];

            // Check if player has opened all cards.
            // if (card.matched === deck.children.length) {
            //     setTimeout(game.end, 500);
            // }
        } else {
            // Change player's score.
            player.score();
            // Add unMatch class.
            newCard.classList.add('unMatched');
            oldCard.classList.add('unMatched');
            setTimeout(function() {
                // Hide cards.
                newCard.classList.remove('open', 'show', 'unMatched');
                oldCard.classList.remove('open', 'show', 'unMatched');
                // Clear opened cards.
                card.isOpened = [];
            }, 700);
        }
    }
}

/** @description - Create player obj to handle player actions.
  * @param {string} name - Player's name for scoreboard.
  * @param {integer} moves - Count player's moves.
  * @param {integer} stars - Count player's stars.
  * @param {function} score - Change players score based on the actions.
  */
const player = {
    'name' : 'player',
    'moves': 0,
    'stars': 3,
    'score': function() {
        // Increase player moves.
        player.moves++;
        document.querySelector('.moves').textContent = player.moves;
        // Store stars children.
        let star = stars.children;
        // Set stars score based on moves.
        switch (player.moves) {
            case 15:
                player.stars--;
                // Empty last star.
                star[2].children[0].className = 'fa fa-star-o';
                break;
            case 21:
                player.stars--;
                // Empty second star.
                star[1].children[0].className = 'fa fa-star-o';
                break;
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
