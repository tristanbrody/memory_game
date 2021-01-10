const cardsFlippedArr = [];
const matchedCardsArr = [];
let cardsFlipped = 0;
let totalSeconds = 0;
let matches = 0;
let gameRunning = true;
let preventFlip = false;
let previousCardFlipped;


//declare DOM elements
const gameContainer = document.getElementById("game");
const minutesLabel = document.querySelector("#minutes");
const secondsLabel = document.querySelector("#seconds");
const resetButton = document.querySelector("#reset-button");
const topContainerText = document.querySelector(".top-container-text-before-completion");
let highScore = document.querySelector("#high-score");

//set interval for game timer
let intervalId = setInterval(updateGameTime, 1000);

//check for previous high score from local storage
highScore.append(` ${checkLocalStorage()}`);

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    const newDiv = document.createElement("div");
    newDiv.classList.add(color);
    newDiv.addEventListener("click", handleCardClick);
    newDiv.setAttribute("boardDiv", true);
    gameContainer.append(newDiv);
  }
}

function handleCardClick(event) {
  if(cardsFlipped<2 && !preventFlip && matches<5 &&
    !(matchedCardsArr.includes(event.target)) &&
   ((event.target.style.backgroundColor==="")||
   (event.target.style.backgroundColor==="white"))
    )
    {
  previousCardFlipped = event.target;
  event.target.style.backgroundColor = event.target.className;
  cardsFlipped = addCardToArr(cardsFlipped, event.target, cardsFlippedArr);
  if(checkForMatch(cardsFlippedArr)){
      matches++;
      matchedCardsArr.push(event.target, previousCardFlipped);
      cardsFlipped = 0;
      cardsFlippedArr.length = 0;
      if(matches===5){
        wonGame();
        if((totalSeconds<parseInt(checkLocalStorage()))||
          (checkLocalStorage()==="")
          ){
          addToLocalStorage(totalSeconds);
          highScore.innerText = ` ${totalSeconds}`;
        }

      }
    } else if(cardsFlipped===2 && 
      (cardsFlippedArr[0].style.backgroundColor!=cardsFlippedArr[1].style.backgroundColor) &&
      (!matchedCardsArr.includes(event.target))
      )
      {
      preventFlip = true;
      setTimeout(flipCards, 1000, preventFlip);
      cardsFlipped = 0;
    }
  
  }
}

createDivsForColors(shuffledColors);
function checkForMatch(cardsFlippedArr) {
  if(cardsFlipped===2) {
    if(cardsFlippedArr[0].style.backgroundColor===cardsFlippedArr[1].style.backgroundColor)
      return true;
    } else return false;
}

function addCardToArr(cardsFlipped, card, cardsFlippedArr){
  if(cardsFlipped<=1) {
    cardsFlippedArr.push(card);
    cardsFlipped++;
  }
    else if
      (cardsFlippedArr[0].offsetHeight!=card.offsetHeight ||
      cardsFlippedArr[0].offsetWidth!=card.offsetWidth ||
      cardsFlippedArr[0].offsetLeft!=card.offsetLeft ||
      cardsFlippedArr[0].offsetTop!=card.offsetTop
      )
    {
    cardsFlippedArr.push(card);
    cardsFlipped++;
  }
  return cardsFlipped;
}

function flipCards() {
  cardsFlippedArr[0].style.backgroundColor = 'white';
  cardsFlippedArr[1].style.backgroundColor = 'white';
  cardsFlippedArr.length = 0;
  return cardsFlippedArr, preventFlip=false;
}  

function updateGameTime(){
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
  let valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

const resetFunc = function resetGame() {
  matchedCardsArr.length = 0;
  preventFlip = false;
  matches = 0;
  cardsFlipped = 0
  totalSeconds = 0;
  cardsFlippedArr.length = 0;
  removeCurrentDivs();
  let shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
  
  if(!gameRunning) {
    topContainerText.classList.toggle("top-container-text");
  };
    clearInterval(intervalId);
  intervalId = setInterval(updateGameTime, 1000);
  gameRunning = true;
}

resetButton.addEventListener('click', resetFunc);

function removeCurrentDivs() {
  const allColorDivs = document.querySelectorAll('div');
  for(let div of allColorDivs) {
    if(div.getAttribute("boardDiv")){
      div.remove();
    }
  }
}

function checkLocalStorage() { 
if(localStorage.highScore != undefined) {
  return localStorage.highScore;
} return "";
}
function addToLocalStorage(highScore) {
return localStorage.setItem("highScore", highScore);
}

function wonGame() {
  gameRunning = false;
  clearInterval(intervalId);
  topContainerText.classList.remove(".top-container-text-before-completion");
  topContainerText.classList.add("top-container-text");
}