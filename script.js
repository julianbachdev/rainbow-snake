"use strict";

/////////////////////////////////////////////////////
// Variables
/////////////////////////////////////////////////////

const display = document.querySelector(".display");
const snake1 = document.getElementById("snake1");
const food = document.getElementById("food");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");
const pauseBtn = document.getElementById("pause");
const speedBtns = document.querySelector(".speed");
const counter = document.getElementById("countdown");
//
const colorBlue = "rgb(0, 0, 255)";
const colorRed = "rgb(255, 0, 0)";
const width = Number.parseInt(getComputedStyle(display).width);
const height = Number.parseInt(getComputedStyle(display).height);
const center = [gridPlacement(width / 2), gridPlacement(height / 2)];
//
let runSnakeGame;
let runSnake = true;
let speed = 190;
let direction = "right";
let snakeLength = 1;
let snakePos = [[center[0], center[1]]];
let foodPos = [];
let currentColor;
let highscore = 0;
let start = false;
//

function isSafari() {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes("safari") && !userAgent.includes("chrome");
}

if (isSafari())
  alert("Safari browser does not support this game, instead use Google Chrome");
/////////////////////////////////////////////////////
// Event Listeners
/////////////////////////////////////////////////////

// Select speed
/////////////////////////////////////////////////////
speedBtns.addEventListener("click", (e) => {
  var currentBtn = Number(e.target.getAttribute("value"));
  if (currentBtn === 140 || currentBtn === 100 || currentBtn === 80) {
    resetSpeedBtnColors();
    e.target.style.color = colorRed;
    speed = currentBtn;
  }
});

// Start game
/////////////////////////////////////////////////////
startBtn.addEventListener("click", () => {
  if (runSnake) {
    if (start === true) return;
    startGame();
    start = true;
  }
});

// Control snake direction
/////////////////////////////////////////////////////
document.addEventListener("keydown", (k) => {
  directionControl(k);
});

// Pause game
/////////////////////////////////////////////////////
pauseBtn.addEventListener("click", () => {
  clearTimeout(runSnakeGame);
  runSnake = true;
});

// Reset game
/////////////////////////////////////////////////////
resetBtn.addEventListener("click", () => {
  resetGame();
});

/////////////////////////////////////////////////////
// Functions
/////////////////////////////////////////////////////

// Settings when starting game
function startSettings() {
  food.style.backgroundColor = randomColor();
  snake1.style.backgroundColor = randomColor();
  snake1.style.top = snakePos[0][0] + "px";
  snake1.style.left = snakePos[0][1] + "px";
  runSnake = false;
}

// Count down & start game
/////////////////////////////////////////////////////
function startGame() {
  if (isSafari()) return;
  startBtn.style.color = colorRed;
  counter.textContent = 3;
  var i = 2;
  var count = setInterval(() => {
    counter.textContent = i;
    if (i === 0) {
      clearTimeout(count);
      counter.textContent = "";
      runSnakeGame = setInterval(gamePlay, speed);
      startSettings();
      generateFood();
    }
    i--;
  }, 900);
}

// Keyboard direction control
function directionControl(k) {
  if (direction === "left" || direction === "right") {
    if (k.key === "ArrowUp" || k.key === "w") {
      direction = "up";
    }
    if (k.key === "ArrowDown" || k.key === "s") {
      direction = "down";
    }
  }
  if (direction === "up" || direction === "down") {
    if (k.key === "ArrowLeft" || k.key === "a") {
      direction = "left";
    }
    if (k.key === "ArrowRight" || k.key === "d") {
      direction = "right";
    }
  }
}

// Game play
/////////////////////////////////////////////////////
function gamePlay() {
  // Current position
  var topPos = Number.parseFloat(getComputedStyle(snake1).top);
  var leftPos = Number.parseFloat(getComputedStyle(snake1).left);

  // Check if snake crashed against borders
  if (
    topPos > width - 20 ||
    topPos < 0 ||
    leftPos > height - 20 ||
    leftPos < 0
  ) {
    for (var i = 1; i <= snakeLength; i++) {
      document.getElementById("snake" + i).style.backgroundColor = colorRed;
    }
    clearTimeout(runSnakeGame);
    runSnake = true;
    return;
  } else {
    // Move snake
    if (direction === "up") snake1.style.top = (topPos -= 20) + "px";
    if (direction === "down") snake1.style.top = (topPos += 20) + "px";
    if (direction === "left") snake1.style.left = (leftPos -= 20) + "px";
    if (direction === "right") snake1.style.left = (leftPos += 20) + "px";
  }

  // Track snake positions according to snake length
  snakePos.unshift([topPos, leftPos]);
  if (snakePos.length > snakeLength) {
    snakePos.pop();
  }

  // Assign tracked positions to snake body elements
  for (var i = 0; i < snakeLength; i++) {
    var snakeEl = document.getElementById("snake" + (i + 1));
    snakeEl.style.top = snakePos[i][0] + "px";
    snakeEl.style.left = snakePos[i][1] + "px";
  }

  // Check if snake crashes into itself
  if (snakeLength > 2) {
    for (var i = 1; i < snakeLength; i++) {
      if (topPos === snakePos[i][0] && leftPos === snakePos[i][1]) {
        for (var j = 2; j <= snakeLength; j++) {
          document.getElementById("snake" + j).style.backgroundColor = colorRed;
        }
        snake1.style.backgroundColor = colorRed;
        clearTimeout(runSnakeGame);
        runSnake = true;
      }
    }
  }

  // Feed snake & generate food
  if (topPos === foodPos[0] && leftPos === foodPos[1]) {
    snakeLength++;
    var html =
      '<div class="snake" id="snake' +
      snakeLength +
      '" style="background-color: ' +
      currentColor +
      "; top: " +
      topPos +
      "px; left: " +
      leftPos +
      'px"></div>';

    food.insertAdjacentHTML("beforebegin", html);
    generateFood();
  }
}

// Generate food
/////////////////////////////////////////////////////
function generateFood() {
  console.log(snakePos);
  foodPos = [];
  for (var i = 0; i < 2; i++) {
    if (foodPos.length === 0) {
      foodPos.push(
        Number(Math.floor(Math.random() * ((width - 20) / 10)) + "0")
      );
    } else {
      foodPos.push(
        Number(Math.floor(Math.random() * ((height - 20) / 10)) + "0")
      );
    }
    foodPos[i] = gridPlacement(foodPos[i]);
  }
  food.style.top = foodPos[0] + "px";
  food.style.left = foodPos[1] + "px";
  currentColor = randomColor();
  food.style.backgroundColor = currentColor;
}

// Random Color
/////////////////////////////////////////////////////
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomColor() {
  return (
    "rgb(" +
    randomInt(0, 255) +
    ", " +
    randomInt(0, 255) +
    ", " +
    randomInt(0, 255) +
    ")"
  );
}

// Force number onto grid of 20s
/////////////////////////////////////////////////////
function gridPlacement(value) {
  return value % 20 === 0 ? value : (value -= 10);
}

// Reset speed button colors
/////////////////////////////////////////////////////
function resetSpeedBtnColors() {
  for (var i = 0; i < speedBtns.children.length; i++) {
    speedBtns.children[i].style.color = "rgb(0, 0, 255)";
  }
}

// Reset game
/////////////////////////////////////////////////////
function resetGame() {
  clearTimeout(runSnakeGame);
  for (var i = 2; i <= snakeLength; i++) {
    var snakeEl = document.getElementById("snake" + i);
    if (snakeEl) snakeEl.remove();
  }
  runSnakeGame = null;
  runSnake = true;
  speed = 150;
  direction = "right";
  snakeLength = 1;
  snakePos = [[center[0], center[1]]];
  foodPos = [];
  currentColor = null;
  start = false;

  snake1.style.backgroundColor = "unset";
  food.style.backgroundColor = "unset";
  startBtn.style.color = colorBlue;
  resetSpeedBtnColors();
}
