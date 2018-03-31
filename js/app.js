// Store the game's deck.
const deck = document.querySelector('.deck');

// Store stars board.
const stars = document.querySelector('.stars');
// Store displayed time.
const displayedMin = document.querySelector('.minutes');
const displayedSec = document.querySelector('.seconds');
// Store restart button.
const restartBtn = document.querySelector('.restart');

// Store idle button container.
const actionButton = document.querySelector('.btn_container');

// Store score-board contents.
const scoreBoard = document.querySelector('.score-board');
const playerName = document.querySelector('#playerName');
const stats = document.querySelectorAll('.stats .stats_rating');
// Store buttons.
const playAgain = document.querySelector('#playAgain');
const close = document.querySelector('#close');

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
  * @param {number} timer - Store the game's timer.
  * @param {function} start - Start the game by shuffling the deck.
  * @param {function} end - End the game by showing a score-board.
  * @param {function} restart - Restart the game by reseting everything.
  * @param {object} time - Create a time obj to handle the timer.
  */

const game = {
    'isActive': false,
    'timer'   : 0,
    'start'   : function() {
        // Hide idle button and remove event listener.
        actionButton.classList.add('hide');
        actionButton.removeEventListener('click', game.start);

        // Store the list of cards.
        let cards = Array.from(deck.children);
        // Shuffle the cards.
        cards = shuffle(cards);
        for (let card of cards) {
            // Remove any previous data that the card had.
            card.classList.remove('show', 'open', 'match', 'unMatched');
            deck.appendChild(card);
        }

        // Start the game.
        game.isActive = true;
        // Start the timer.
        game.timer = setTimeout(game.time.start, 1000);
    },
    'end'     : function() {
        if (game.isActive) {
            // Stops the game.
            game.isActive = false;
            // Stop the timer.
            clearTimeout(game.timer);

            // Show player's name in the scoreboard.
            if (player.name !== 'player') {
                playerName.textContent = player.name;
            }

            // Set star rating.
            stats[0].firstElementChild.innerHTML = `<ul>${stars.innerHTML}</ul>`;
            // Set time.
            stats[1].firstElementChild.textContent = `${displayedMin.textContent} : ${displayedSec.textContent}`;
            // Set move.
            stats[2].firstElementChild.textContent = player.moves;

            // Display the score-board.
            scoreBoard.classList.add('show');
        }
    },
    'restart' : function() {
        // Hide score-board.
        scoreBoard.classList.remove('show');

        // Reset matched cards.
        card.matched = 0;
        card.isOpened = [];

        // Reset player's score (moves and stars).
        player.resetScore();

        // Reset game's time.
        game.time.reset();
        clearTimeout(game.timer);

        // Restart the game.
        game.start();
    },
    'idle'    : function() {
        if (!game.isActive) {
            // Store the list of cards.
            let cards = Array.from(deck.children);
            // Shuffle the cards.
            cards = shuffle(cards);
            for (let card of cards) {
                // Show cards randomly.
                if (Math.random() > 0.85) {
                    card.classList.add('show', 'open', 'unMatched');
                } else if (Math.random() < 0.16) {
                    card.classList.add('show', 'open', 'match');
                } else if (Math.random() > 0.48) {
                    card.classList.add('show', 'open');
                    card.classList.remove('match', 'unMatched');
                } else {
                    card.classList.remove('show', 'open', 'match', 'unMatched');
                }

                // Display the card.
                deck.appendChild(card);
            }

            //Set timer to play every 3 seconds.
            game.timer = setTimeout(game.idle, 3000);
        }
    },
    'time'    : {
        'minutes': 0,
        'seconds': 0,
        'start'  : function() {
            if (game.isActive) {
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

                // Set the timer to loop.
                game.timer = setTimeout(game.time.start, 1000);
            }
        },
        'display' : function(element, time) {
            // Display 0 infront of the time.
            element.textContent = time < 10 ? `0${time}` : time;
        },
        'reset'   : function() {
            // Set game's time to 0.
            game.time.minutes = 0;
            game.time.seconds = 0;

            // Display the time in the document.
            game.time.display(displayedMin, game.time.minutes);
            game.time.display(displayedSec, game.time.seconds);
        }
    }
}

/** @description - Create card obj to handle card actions.
  * @param {array} isOpened - List opened cards to match.
  * @param {number} matched - Counts the opened cards.
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
                    // Display first card.
                    picked.classList.add('open', 'show');
                    // Store first picked card.
                    card.isOpened.push(picked);
                    break;
                case 1:
                    // Display second card.
                    picked.classList.add('open', 'show');
                    // Store second card so that only two cards are opened.
                    card.isOpened.push(picked);
                    // Check if the first card is tha same with the second.
                    card.check(picked, card.isOpened[0]);
                    break;
            }
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
            if (card.matched === deck.children.length) {
                setTimeout(game.end, 200);
            }
        } else {
            // Change player's score.
            player.score();

            // Add unMatched class.
            newCard.classList.add('unMatched');
            oldCard.classList.add('unMatched');

            // Wait for the animation to end before hiding.
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
  * @param {number} moves - Count player's moves.
  * @param {number} stars - Count player's stars.
  * @param {function} score - Change players score based on the actions.
  * @param {function} resetScore - Reset player's score (moves and stars).
  */
const player = {
    'name' : 'player',
    'moves': 0,
    'stars': 3,
    'score': function() {
        // Increase player moves and display them.
        player.moves++;
        document.querySelector('.moves').textContent = player.moves;

        // Store stars children in order to display new score.
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
    },
    'resetScore': function() {
        // Reset player's moves and display them.
        player.moves = 0;
        document.querySelector('.moves').textContent = player.moves;

        // Reset player's stars and display them.
        player.stars = 0;
        for (star of stars.children) {
            star.children[0].className = 'fa fa-star';
        }
    }
}

// Set up the event listener for a card. If a card is clicked.
deck.addEventListener('click', card.open);

// Start the game by pressing the play button.
actionButton.addEventListener('click', game.start);

// Restart button event.
restartBtn.addEventListener('click', game.restart);
playAgain.addEventListener('click', game.restart);

// Close score-board window.
close.addEventListener('click', function() {
    scoreBoard.classList.remove('show');

    // Show idle button and add event listener.
    actionButton.classList.remove('hide');
    actionButton.addEventListener('click', game.restart);
});

// Set up game in idle mode when loaded.
document.addEventListener('DOMContentLoaded', game.idle);
