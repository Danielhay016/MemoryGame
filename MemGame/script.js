/*
Daniel Hay 209042720
Noya Ossi 318638053
*/
$(document).ready(function() {
    // Variable Declarations
    let playerName;          // Stores the name of the player
    let numOfCards;          // Stores the total number of cards
    let totalPairs;          // Stores the number of pairs of cards
    let cardsArray;          // An array to store the values of the cards
    let openedCards;         // An array to store the opened cards during the game
    let gameStarted;         // A boolean variable indicating whether the game has started or not
    let gameFinished;        // A boolean variable indicating whether the game has finished or not
    let timerInterval;       // Stores the timer
  
    $('#startForm').on('submit', function(event) {
      event.preventDefault();
  
      playerName = $('#name').val();                     // Get the player's name from the input field
      totalPairs = parseInt($('#cards').val());          // Get the number of pairs of cards from the input field
      numOfCards = totalPairs * 2;                       // Calculate the total number of cards
      cardsArray = [];                                   // Initialize the array to store card values
      openedCards = [];                                  // Initialize the array to store opened cards
      gameStarted = false;                               // Set the gameStarted flag to false
      gameFinished = false;                              // Set the gameFinished flag to false
      clearInterval(timerInterval);                      // Clear any existing timer interval
  
      $('#playerName').text(playerName);                 // Set the player's name in the game UI
      $('#gameArea').show();                             // Show the game area
      $('#gameEnd').hide();                              // Hide the game end section
      $('#cardGrid').empty();                            // Clear any existing cards from the grid
  
      for (let i = 1; i <= totalPairs; i++) {
        cardsArray.push(i);                            // Push the value of the card (i) twice to the cardsArray
        cardsArray.push(i);
      }
      shuffleArray(cardsArray);                          // Shuffle the cardsArray to randomize card positions
  
      for (let i = 0; i < numOfCards; i++) {
        let card = $('<div class="card"></div>');       //Create a new card element
        card.attr('data-value', cardsArray[i]);         // Set the card's value as an attribute
        card.on('click', cardClick);                    // Attach the cardClick function to the click event
        let cardValue = $('<span class="card-value"></span>');  // Create a span element for card value
        card.append(cardValue);                         // Append the card value to the card element
        $('#cardGrid').append(card);                    // Append the card to the cardGrid
      }
  
      startTimer();                                      // Start the game timer
    });
  
    $('#playAgainBtn').on('click', function() {
      $('#startForm')[0].reset();                        // Reset the start form
      $('#gameEnd').hide();                              // Hide the game end section
      $('#startForm').show();                            // Show the start form
    });
  
    function cardClick() {
      if (!gameStarted) {
        gameStarted = true; // Set the gameStarted flag to true on first card click
      }
  
      if (gameFinished) {
        return; // Exit the function if the game has already finished
      }
  
      let card = $(this); // Get the clicked card
      let cardValue = card.attr('data-value'); // Get the value of the clicked card
  
      if (
        openedCards.length < 2 &&
        !card.hasClass('opened') &&
        !card.hasClass('hidden')
      ) {
        card.addClass('opened'); // Add 'opened' class to the clicked card
        card.find('.card-value').text(cardValue); // Set the card value inside the card element
        openedCards.push(card); // Add the clicked card to the openedCards array
  
        if (openedCards.length === 2) {
          let card1Value = openedCards[0].attr('data-value'); // Get the value of the first opened card
          let card2Value = openedCards[1].attr('data-value'); // Get the value of the second opened card
  
          if (card1Value === card2Value) {
            // If the values of the two opened cards match
            openedCards.forEach(function(card) {
              card.addClass('matched');
            }); // Add 'matched' class to both cards
            openedCards = []; // Clear the openedCards array
            checkVictory(); // Check if all cards have been matched
          } else {
            setTimeout(function() {
              openedCards[0]
                .removeClass('opened')
                .find('.card-value')
                .text(''); // Close the first opened card
              openedCards[1]
                .removeClass('opened')
                .find('.card-value')
                .text(''); // Close the second opened card
              openedCards = []; // Clear the openedCards array
            }, 500); // Delay for 0.5 seconds (half a second)
          }
        }
      }
    }
  
    function checkVictory() {
      let matchedPairs = $('.card.matched').length / 2; // Count the number of matched pairs
  
      if (matchedPairs === totalPairs) {
        gameFinished = true; // Set the gameFinished flag to true
        clearInterval(timerInterval); // Stop the game timer
        showGameEnd(true); // Show the game end screen with win message
      }
    }
  
    function startTimer() {
      let startTime = new Date().getTime();                  
      timerInterval = setInterval(function() {
        let currentTime = new Date().getTime();             
        let elapsedTime = Math.floor((currentTime - startTime) / 1000);  // Calculate elapsed time in seconds
        $('#timer').text('Time: ' + elapsedTime);          // Update the timer display
      }, 1000);                                            // Update the timer every second (1000 milliseconds)
    }
  
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));    // Generate a random index between 0 and i
        let temp = array[i];                            // Swap the current element with the randomly selected element
        array[i] = array[j];
        array[j] = temp;
      }
    }
  
    function showGameEnd(isWin) {
      let gameTime = $('#timer').text();                   // Get the total time from the timer
      let gameEndText = isWin ? 'Congratulations! You won!' : 'Game Over!';
      // Determine the game end message based on win or lose condition
  
      $('#gameEndText').text(gameEndText);                 // Set the game end message on the screen 
      $('#gameTime').text(gameTime);                       // Set the total time on the screen 
      $('#gameEnd').show();                                // Show the game end section
      $('#gameArea').hide();                               // Hide the game area
    }
  });
  