// Pixel Pirate: Treasure Hunt
// The # symbols are walls, P is the pirate's starting spot,
// E is the exit, and T is the treasure chest.

const mazes = [
  [
    "#########",
    "#P..#...#",
    "#.#.#.#E#",
    "#.#...#.#",
    "#.###.#.#",
    "#.....#.#",
    "###.###.#",
    "#.......#",
    "#########"
  ],
  [
    "###########",
    "#P#.......#",
    "#.#.#####.#",
    "#...#...#.#",
    "###.#.#.#.#",
    "#...#.#...#",
    "#.###.###.#",
    "#.....#...#",
    "#.#####.#E#",
    "#.........#",
    "###########"
  ],
  [
    "###########",
    "#P....#...#",
    "#####.#.#.#",
    "#.....#.#.#",
    "#.#####.#.#",
    "#.#.....#.#",
    "#.#.#####.#",
    "#.#.......#",
    "#.#######.#",
    "#........T#",
    "###########"
  ]
];

const startScreen = document.getElementById("start-screen");
const playScreen = document.getElementById("play-screen");
const winScreen = document.getElementById("win-screen");
const mazeElement = document.getElementById("maze");
const levelLabel = document.getElementById("level-label");
const statusMessage = document.getElementById("status-message");
const gameMessage = document.getElementById("game-message");
const startButton = document.getElementById("start-button");
const replayButton = document.getElementById("replay-button");

// These variables keep track of the current game.
let currentLevel = 0;
let playerRow = 1;
let playerCol = 1;
let gameActive = false;

// Start a new game from Level 1.
function startGame() {
  currentLevel = 0;
  startScreen.hidden = true;
  winScreen.hidden = true;
  playScreen.hidden = false;
  gameActive = true;
  loadLevel();
}

// Set up the current maze and place the pirate at P.
function loadLevel() {
  const maze = mazes[currentLevel];

  for (let row = 0; row < maze.length; row++) {
    const startCol = maze[row].indexOf("P");
    if (startCol !== -1) {
      playerRow = row;
      playerCol = startCol;
    }
  }

  levelLabel.textContent = "LEVEL " + (currentLevel + 1) + " OF 3";
  statusMessage.textContent = currentLevel === 2 ? "Find the treasure!" : "Find the exit!";
  gameMessage.textContent = currentLevel === 2
    ? "The treasure is close, matey!"
    : "Find the exit, matey!";

  drawMaze();
}

// Draw every maze square on the page.
function drawMaze() {
  const maze = mazes[currentLevel];
  mazeElement.innerHTML = "";
  mazeElement.style.gridTemplateColumns = "repeat(" + maze[0].length + ", 1fr)";

  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[row].length; col++) {
      const tile = document.createElement("div");
      const tileType = maze[row][col];

      tile.classList.add("tile");

      if (tileType === "#") {
        tile.classList.add("wall");
      } else {
        tile.classList.add("path");
      }

      // Add a visual for the exit or treasure.
      if (tileType === "E") {
        tile.classList.add("exit");
        tile.textContent = "🚪";
      } else if (tileType === "T") {
        tile.classList.add("treasure");
        tile.textContent = "🧰";
      }

      // Draw the pirate at the current position.
      if (row === playerRow && col === playerCol) {
        tile.classList.add("player");
        tile.textContent = "🏴‍☠️";
      }

      mazeElement.appendChild(tile);
    }
  }
}

// Move the pirate one square, unless there is a wall.
function movePlayer(rowChange, colChange) {
  if (!gameActive) return;

  const maze = mazes[currentLevel];
  const nextRow = playerRow + rowChange;
  const nextCol = playerCol + colChange;

  // Stop if the next square is outside the maze.
  if (
    nextRow < 0 ||
    nextRow >= maze.length ||
    nextCol < 0 ||
    nextCol >= maze[0].length
  ) {
    return;
  }

  const nextTile = maze[nextRow][nextCol];

  // Wooden walls block the pirate.
  if (nextTile === "#") {
    gameMessage.textContent = "Thud! That's a wooden wall.";
    return;
  }

  playerRow = nextRow;
  playerCol = nextCol;

  // Reaching the exit advances the player, except on the final level.
  if (nextTile === "E") {
    currentLevel++;
    if (currentLevel >= 3) {
      showWinScreen();
      return;
    }
    loadLevel();
    return;
  }

  // The treasure only ends the game on Level 3.
  if (nextTile === "T" && currentLevel === 2) {
    showWinScreen();
    return;
  }

  gameMessage.textContent = "Keep going, matey!";
  drawMaze();
}

// Show the final winning screen.
function showWinScreen() {
  gameActive = false;
  playScreen.hidden = true;
  winScreen.hidden = false;
}

// Listen for the arrow keys.
document.addEventListener("keydown", function(event) {
  if (!gameActive) return;

  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
    event.preventDefault();
  }

  if (event.key === "ArrowUp") {
    movePlayer(-1, 0);
  } else if (event.key === "ArrowDown") {
    movePlayer(1, 0);
  } else if (event.key === "ArrowLeft") {
    movePlayer(0, -1);
  } else if (event.key === "ArrowRight") {
    movePlayer(0, 1);
  }
});

// Button events.
startButton.addEventListener("click", startGame);
replayButton.addEventListener("click", startGame);
