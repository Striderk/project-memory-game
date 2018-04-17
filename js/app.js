/*
 * Create a list that holds all of your cards
 */
var array = ["diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb"];
var moves = 0;
var timerCount = 0;
var openedCard = [];
var matchedCard = [];
var gameStarted = false;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
var shuffledArray = shuffle(array.concat(array));
var deck = document.querySelectorAll(".card");

//shuffle
for (var i = 0; i < shuffledArray.length; i++) {
    // deck[i].classList.remove("match");
    // deck[i].classList.add("open", "show");
    deck[i].innerHTML = "<i class='fa fa-" + shuffledArray[i] + "'></i>";
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
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

//  deck.forEach(card => {
//     return card.addEventListener("click", openCard(card));
//  });

for (var index = 0; index < deck.length; index++) {
    deck[index].addEventListener("click", openCard);
}

function openCard() {
    var classList = this.classList;

    classList.add("show", "open");
    openedCard.push(this);
    //disable clicked card
    this.style.pointerEvents = "none";
    if (!gameStarted) {
        setTimer();
        gameStarted = true;
    }
    if (openedCard.length === 2) {
        moves++;
        setMoves();
        checkMatch();
    }
}

function checkMatch() {
    if (openedCard[0].innerHTML === openedCard[1].innerHTML) {
        console.log("match");
        addMatch();
    } else {
        //restore point event
        console.log("not match");
        setTimeout(notMatch, 300);
        openedCard[0].style.pointerEvents = "visible";
        openedCard[1].style.pointerEvents = "visible";
    }
}

function addMatch() {
    openedCard[0].className = "card match";
    openedCard[1].className = "card match";
    matchedCard = matchedCard.concat(openedCard);
    if (matchedCard.length === 16) {
        showWinPanel();
    }
    openedCard = [];
}

function notMatch() {
    openedCard[0].className = "card";
    openedCard[1].className = "card";
    openedCard = [];
}

function showWinPanel() {
    document.querySelector(".win-panel").style.display = "block";
    constructStartAndMoves();
}

function setMoves() {
    document.querySelector(".moves").innerHTML = moves;
}

function setTimer() {
    var startTime = new Date().getTime();
    var myVar = setInterval(function () {
        var now = new Date().getTime();
        var timeUsed = now - startTime;
        var min = Math.floor((timeUsed % (1000 * 60 * 60)) / (1000 * 60));
        var sec = Math.floor((timeUsed % (1000 * 60)) / 1000);
        setStar(min, sec);
        if (sec < 10) {
            sec = "0" + sec;
        }
        if (min < 10) {
            min = "0" + min;
        }
        var showTime = min + ":" + sec;
        document.querySelector(".timer").innerHTML = showTime;
    }, 1000);
}

function setStar(min, sec) {
    var starList = document.querySelector(".stars").getElementsByTagName("li");
    var timeConsumed = min * 60 + sec;
    var removeStarScore = timeConsumed + moves * 5;
    if (starList.length > 1) {
        if (removeStarScore > 60 && starList.length > 2) {
            starList[2].remove();
        } else if (removeStarScore > 120) {
            starList[1].remove();
        }
    }
}

function getTimeUsed() {
    return document.querySelector(".timer").innerHTML;
}

function getStar() {
    return document.querySelector(".stars").getElementsByTagName("li").length;
}

function constructStartAndMoves() {
    var para = document.createElement("p");
    var node = document.createTextNode("With " + moves + " moves, " + getStar() +" starts" + " and time used " + getTimeUsed());
    para.appendChild(node);
    document.querySelector(".panel-content").appendChild(para);
}

function restart() {
    document.querySelector(".win-panel").style.display = "none";
}