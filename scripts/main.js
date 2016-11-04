var canvas;
var canvasContext;

var currentCursorPositionX;
var currentCursorPositionY;

var gameRender;

var gameAttempts;

var beerX;
var beerY;
var beerSpeed;
var beerCounter;

window.onload = function() {
  startGame();
  resetBeer();

  document.addEventListener('mousemove', function(e) {
    currentCursorPositionX = e.pageX;
    currentCursorPositionY = e.pageY;
  });

  gameRender = setInterval(function() {
    drawUzhva();
    drawBeer();
  }, 1000 / FRAMES_RATE);

}

//*********************************
//       CONSTANTS FOR GAME
//*********************************
const IMG_PATH_UZHVA = './images/Uzhva.png';
const IMG_PATH_BEER = './images/beer.png';
const SOUND_PATH_SUCCESS = './sounds/woohoo.mp3';
const SOUND_PATH_WARNING = './sounds/doh.wav';
const SOUND_PATH_GAME_OVER = './sounds/moe.wav';
const FRAMES_RATE = 30;

//*********************************
//       SYSTEM FUNCTIONS
//*********************************
function startGame() {
  canvas = document.getElementById('ujor');
  canvasContext = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  beerSpeed = 10;
  beerCounter = 0;
  gameAttempts = 1;
}

function clearScreen() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
}

function gameOver() {
  clearInterval(gameRender);

  setTimeout(function() {
    clearScreen();
    playAudio(SOUND_PATH_GAME_OVER);

    canvasContext.fillStyle = 'white';
    canvasContext.font = "16px Georgia";
    canvasContext.fillText(beerCounter + ' - bottles of Beer... Maan - you are drunk!', 415, 415);
  }, 1000 / FRAMES_RATE);
}

function getRandomWidth() {
  return Math.floor(Math.random() * (canvas.width - 1)) + 0;
}

//*********************************
//       GAME FUNCTIONS
//*********************************
function drawUzhva() {
  var uzhva = new Image();
  uzhva.src = IMG_PATH_UZHVA;

  uzhva.onload = function() {
    clearScreen();
    canvasContext.drawImage(uzhva, currentCursorPositionX - 100, currentCursorPositionY - 150);
  }
}

function isUzhvaNearBottle() {
  return currentCursorPositionY > (beerY - 10) && currentCursorPositionY < (beerY + 10) && currentCursorPositionX > (beerX - 50) && currentCursorPositionX < (beerX + 50);
}

function drawBeer() {
  var beer = new Image();
  beer.src = IMG_PATH_BEER;
  moveBeer();

  if (beerY + 125 >= canvas.height) {
    if (gameAttempts !== 0) {
      playAudio(SOUND_PATH_WARNING);
      resetBeer();
      beerSpeed = beerSpeed / 2;
      gameAttempts--;
    } else {
      gameOver();
    }
  };

  beer.onload = function() {
    canvasContext.drawImage(beer, beerX, beerY);

    if (isUzhvaNearBottle()) {
      playAudio(SOUND_PATH_SUCCESS);
      resetBeer();
      beerSpeed++;
      beerCounter++;
    }
  }
}

function moveBeer() {
  beerY += beerSpeed
}

function resetBeer() {
  beerX = getRandomWidth();
  beerY = 0;
}

function playAudio(name) {
  var audio = new Audio();
  audio.src = name;

  audio.play();
}
