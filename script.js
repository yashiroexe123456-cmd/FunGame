// Sentences organized by difficulty level
const sentences = {
  easy: [
    "practice typing every day to become faster",
    "the quick brown fox jumps over the lazy dog",
    "coding games are fun to learn",
    "typing faster helps your car win",
    "keep practicing to improve your speed",
    "racing is exciting when you type fast",
    "javascript makes games interactive",
    "learning to code opens new opportunities"
  ],
  
  medium: [
    "practice typing every day to become faster, coding games is a fun way to learn javascript",
    "the quick brown fox jumps over the lazy dog, typing faster will help your car win the race",
    "developers need good typing skills to write code efficiently and quickly",
    "racing games become more exciting when you compete against computer opponents",
    "javascript programming requires attention to detail and regular practice",
    "typing accuracy is just as important as speed in this racing game",
    "the cars move forward based on how correctly you type each sentence"
  ],
  
  hard: [
    "advanced typing challenges require precision and speed, especially when racing against artificial intelligence opponents in this exciting game",
    "javascript developers must master async programming, closures, prototypes, and event loops to build complex web applications",
    "the quick brown fox jumps over the lazy dog near the river bank while typing champions race to complete sentences faster than ever before",
    "implementing a level system makes games more engaging by gradually increasing difficulty and rewarding players for their progress",
    "professional programmers often practice touch typing to improve their workflow and reduce errors when writing complex algorithms",
    "the artificial intelligence in this game adapts to your skill level, providing a challenging experience for players of all abilities"
  ]
};

// Game state variables
let currentLevel = "easy";
let sentence = "";
let playerPos = 0;
let aiPos = 0;
let aiTimer = null;
let aiSpeed = 2;
let aiInterval = 120;
let playerSpeed = 10;
const raceLength = 700; // Finish line position in pixels
let gameActive = false;
let wins = 0;
let losses = 0;

// DOM elements
const sentenceEl = document.getElementById("sentence");
const input = document.getElementById("input");
const playerCar = document.getElementById("playerCar");
const aiCar = document.getElementById("aiCar");
const endScreen = document.getElementById("endScreen");
const endMessage = document.getElementById("endMessage");
const levelDisplay = document.getElementById("currentLevel");

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateLevelDisplay();
    gameActive = true;
    newSentence();
    startAI();
});

// Update the level and score display
function updateLevelDisplay() {
    if (levelDisplay) {
        levelDisplay.textContent = `Level: ${currentLevel.toUpperCase()} | Wins: ${wins} | Losses: ${losses}`;
    }
}

// Set game difficulty level
function setLevel(level) {
    currentLevel = level;
    
    // Adjust game parameters based on level
    switch(level) {
        case "easy":
            aiSpeed = 1.5;      // Slow AI
            aiInterval = 150;    // Slower updates
            playerSpeed = 12;    // Faster player progress
            break;
        case "medium":
            aiSpeed = 2.5;       // Medium AI speed
            aiInterval = 100;     // Normal updates
            playerSpeed = 10;     // Normal player speed
            break;
        case "hard":
            aiSpeed = 4;          // Fast AI
            aiInterval = 80;      // Quick updates
            playerSpeed = 8;      // Slower player progress (need more typing)
            break;
    }
    
    updateLevelDisplay();
    restartGame();
}

// Get a random sentence for current level
function newSentence() {
    const levelSentences = sentences[currentLevel];
    sentence = levelSentences[Math.floor(Math.random() * levelSentences.length)];
    sentenceEl.textContent = sentence;
    input.value = "";
}

// Check if player has won
function checkWinCondition() {
    if (playerPos >= raceLength) {
        wins++;
        endScreen.style.display = "block";
        endMessage.textContent = "🎉 YOU WIN! 🎉";
        input.disabled = true;
        gameActive = false;
        clearInterval(aiTimer);
        updateLevelDisplay();
        
        // Automatically advance to next level after winning
        setTimeout(function() {
            if (currentLevel === "easy") {
                setLevel("medium");
                endScreen.style.display = "none"; // Hide win screen
            } else if (currentLevel === "medium") {
                setLevel("hard");
                endScreen.style.display = "none"; // Hide win screen
            } else {
                // On hard level win, show championship message
                endMessage.textContent = "🏆 YOU BEAT ALL LEVELS! 🏆";
                // Add restart button option
                setTimeout(function() {
                    if (confirm("Congratulations! Play again?")) {
                        setLevel("easy");
                        wins = 0;
                        losses = 0;
                        restartGame();
                    }
                }, 2000);
            }
        }, 1500);
    }
}

// Handle typing input
input.addEventListener("input", function() {
    if (!gameActive) return;
    
    let typed = input.value;
    
    // Check if typed text matches the beginning of the sentence
    if (sentence.startsWith(typed)) {
        playerPos += playerSpeed;
        // Prevent car from going past finish line
        playerCar.style.left = Math.min(playerPos, raceLength) + "px";
        checkWinCondition();
    }
    
    // If sentence is completed exactly
    if (typed === sentence) {
        playerPos = raceLength;
        playerCar.style.left = raceLength + "px";
        checkWinCondition();
    }
});

// Start AI opponent movement
function startAI() {
    // Clear any existing timer
    if (aiTimer) {
        clearInterval(aiTimer);
    }
    
    // Create new AI movement interval
    aiTimer = setInterval(function() {
        if (!gameActive) return;
        
        aiPos += aiSpeed;
        // Prevent AI car from going past finish line
        aiCar.style.left = Math.min(aiPos, raceLength) + "px";
        
        // Check if AI wins
        if (aiPos >= raceLength && gameActive) {
            losses++;
            endScreen.style.display = "block";
            endMessage.textContent = "💻 COMPUTER WINS!";
            input.disabled = true;
            gameActive = false;
            clearInterval(aiTimer);
            updateLevelDisplay();
        }
    }, aiInterval);
}

// Restart the current level
function restartGame() {
    // Stop AI timer
    if (aiTimer) {
        clearInterval(aiTimer);
    }
    
    // Reset positions
    playerPos = 0;
    aiPos = 0;
    
    // Reset car positions
    playerCar.style.left = "0px";
    aiCar.style.left = "0px";
    
    // Re-enable input
    input.disabled = false;
    input.value = "";
    
    // Hide end screen
    endScreen.style.display = "none";
    
    // Activate game
    gameActive = true;
    
    // Get new sentence and restart AI
    newSentence();
    startAI();
}

// Make functions available globally for button clicks
window.setLevel = setLevel;
window.restartGame = restartGame;