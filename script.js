// ---------------- SENTENCES ----------------
const sentences = {
  easy: [
    "practice typing every day to become faster",
    "the quick brown fox jumps over the lazy dog",
    "coding games are fun to learn"
  ],
  medium: [
    "typing faster will help your car win the race",
    "developers need good typing skills to write code efficiently"
  ],
  hard: [
    "advanced typing challenges require precision and speed against artificial intelligence opponents"
  ]
};

// ---------------- GAME STATE ----------------
let currentLevel = localStorage.getItem("level") || "easy";
let wins = Number(localStorage.getItem("wins")) || 0;
let losses = Number(localStorage.getItem("losses")) || 0;

let sentence = "";
let playerPos = 0;
let aiPos = 0;

let gameActive = true;
let raceStarted = false;

const raceLength = 700;

// ---------------- AUDIO (ONLY WIN/LOSE) ----------------
const winSound = new Audio("sounds/win.mp3");
const loseSound = new Audio("sounds/lose.mp3");

// ---------------- ELEMENTS ----------------
const sentenceEl = document.getElementById("sentence");
const input = document.getElementById("input");
const playerCar = document.getElementById("playerCar");
const aiCar = document.getElementById("aiCar");
const endScreen = document.getElementById("endScreen");
const endMessage = document.getElementById("endMessage");
const levelDisplay = document.getElementById("currentLevel");
const nextLevelContainer = document.getElementById("nextLevelContainer");

// ---------------- LEVEL ORDER ----------------
const levels = ["easy", "medium", "hard"];

// ---------------- SAVE DATA ----------------
function saveData() {
  localStorage.setItem("wins", wins);
  localStorage.setItem("losses", losses);
  localStorage.setItem("level", currentLevel);
}

// ---------------- DISPLAY ----------------
function updateDisplay() {
  levelDisplay.textContent =
    `Level: ${currentLevel.toUpperCase()} | Wins: ${wins} | Losses: ${losses}`;
}

// ---------------- SENTENCE ----------------
function newSentence() {
  const list = sentences[currentLevel];
  sentence = list[Math.floor(Math.random() * list.length)];
  sentenceEl.textContent = sentence;
  input.value = "";
}

// ---------------- WPM ----------------
let startTime = null;

function getWPM() {
  if (!startTime) return 0;
  const minutes = (Date.now() - startTime) / 60000;
  const words = sentence.split(" ").length;
  return Math.round(words / minutes);
}

// ---------------- AI ----------------
let aiInterval;

function startAI() {
  clearInterval(aiInterval);

  aiInterval = setInterval(() => {
    if (!gameActive || !raceStarted) return;

    aiPos += 2 + Math.random() * 3;
    aiCar.style.left = aiPos + "px";

    if (aiPos >= raceLength) {
      loseGame();
    }
  }, 120);
}

// ---------------- WIN / LOSE ----------------
function winGame() {
  gameActive = false;
  wins++;

  const wpm = getWPM();

  winSound.play();

  endScreen.style.display = "block";
  endMessage.textContent = `🎉 YOU WIN! WPM: ${wpm}`;

  showNextLevel();

  saveData();
  updateDisplay();
}

function loseGame() {
  gameActive = false;
  losses++;

  loseSound.play();

  endScreen.style.display = "block";
  endMessage.textContent = "💻 COMPUTER WINS!";

  nextLevelContainer.style.display = "none"; 

  saveData();
  updateDisplay();
}

// ---------------- NEXT LEVEL ----------------
function showNextLevel() {
  if (currentLevel === "hard") return;
  nextLevelContainer.style.display = "block";
}

function goToNextLevel() {
  const index = levels.indexOf(currentLevel);
  if (index < levels.length - 1) {
    currentLevel = levels[index + 1];
  }

  saveData();
  restartGame();
}

window.goToNextLevel = goToNextLevel;

// ---------------- INPUT ----------------
input.addEventListener("input", () => {
  if (!gameActive) return;

  if (!raceStarted) {
    raceStarted = true;
    startTime = Date.now();
    startAI();
  }

  const typed = input.value;

  if (sentence.startsWith(typed)) {
    playerPos += 8;
    playerCar.style.left = playerPos + "px";
  }

  if (typed === sentence) {
    winGame();
  }
});

// ---------------- RESTART ----------------
function restartGame() {
  playerPos = 0;
  aiPos = 0;

  gameActive = true;
  raceStarted = false;

  startTime = null;

  playerCar.style.left = "0px";
  aiCar.style.left = "0px";

  endScreen.style.display = "none";
  nextLevelContainer.style.display = "none";

  newSentence();
  updateDisplay();
}

// ---------------- LEVEL CHANGE ----------------
function setLevel(level) {
  currentLevel = level;
  saveData();
  restartGame();
}


window.setLevel = setLevel;
window.restartGame = restartGame;

// ---------------- INIT ----------------
document.addEventListener("DOMContentLoaded", () => {
  newSentence();
  updateDisplay();
});