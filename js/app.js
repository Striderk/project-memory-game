var array = ["diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb"];
var moves,
    timerCount,
    openedCard,
    matchedCard,
    gameStarted,
    deck,
    myTime;

function initGame() {
    moves = 0;
    timerCount = 0;
    openedCard = [];
    matchedCard = [];
    gameStarted = false;
    clearInterval(myTime);
    resetScorePanel();
    shuffleCards();
    addEventListener();
}

function shuffleCards() {
    var shuffledArray = shuffle(array.concat(array));
    deck = document.querySelectorAll(".card");

    //shuffle
    for (var i = 0; i < shuffledArray.length; i++) {
        deck[i].innerHTML = "<i class='fa fa-" + shuffledArray[i] + "'></i>";
        deck[i].style.pointerEvents = "visible";
        flipOverCard(deck[i]);
    }
}

function flipOverCard(card) {
    card.className = "card";
}

function flipMatchCard(card) {
    card.className = "card match";
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

function addEventListener() {
    for (var index = 0; index < deck.length; index++) {
        deck[index].addEventListener("click", openCard);
    }
    document.querySelector(".restart").addEventListener("click", restart);
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
        console.log("not match");
        setTimeout(notMatch, 300);
        //restore point event
        openedCard[0].style.pointerEvents = "visible";
        openedCard[1].style.pointerEvents = "visible";
    }
}

function addMatch() {
    flipMatchCard(openedCard[0]);
    flipMatchCard(openedCard[1]);
    matchedCard = matchedCard.concat(openedCard);
    if (matchedCard.length === 16) {
        //stop the timer
        clearInterval(myTime);
        showWinPanel();
    }
    openedCard = [];
}

function notMatch() {
    flipOverCard(openedCard[0]);
    flipOverCard(openedCard[1]);
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
    myTime = setInterval(function () {
        var now = new Date().getTime();
        var timeUsed = now - startTime;
        var min = Math.floor((timeUsed % (1000 * 60 * 60)) / (1000 * 60));
        var sec = Math.floor((timeUsed % (1000 * 60)) / 1000);
        setStar(min, sec);
        //if sec, min less than 10, add 0 in front make shown result 2 digits
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
    //set score as time consume plus the 5 * moves taken
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

function constructStarsAndMoves() {
    var para = document.querySelector(".win-detail");
    //add the stars moves and time consumed in winning panel.
    para.innerHTML = "With " + moves + " moves, " + getStar() + " starts" + " and time used " + getTimeUsed();
}

function restart() {
    document.querySelector(".win-panel").style.display = "none";
    initGame();
}

function resetScorePanel() {
    document.querySelector(".moves").innerHTML = 0;
    document.querySelector(".timer").innerHTML = "00:00";
    document.querySelector(".stars").innerHTML =
        "<li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li>";
}

(function () {
    initGame();
})();