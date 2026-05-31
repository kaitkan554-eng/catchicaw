const gameArea = document.getElementById("gameArea");
const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");

const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");
const gameContainer = document.getElementById("gameContainer");

const emojis = ["😂", "😍", "🥳", "😎", "🔥"];

const photos = [
    "images/emojiica1.png",
    "images/emojiica2.png",
    "images/emojiica3.png",
    "images/emojiica4.png",
    "images/emojiica5.png",
    "images/emojiica6.png",
    "images/emojiica7.png"
];

// SOUND
const clickBubble = new Audio("sounds/clickbubble.mp3");
const clickEmoji = new Audio("sounds/clickemoji.mp3");
const finishedGame = new Audio("sounds/finishedgame.mp3");
const bgm = new Audio("sounds/dj-kicau-mania.mp3");

const gameOverModal =
    document.getElementById("gameOverModal");

const finalScore =
    document.getElementById("finalScore");

const playAgainBtn =
    document.getElementById("playAgainBtn");

const homeBtn =
    document.getElementById("homeBtn");

const resultTitle =
    document.getElementById("resultTitle");

const resultMessage =
    document.getElementById("resultMessage");
bgm.loop = true;
bgm.volume = 0.3;

let score = 0;
let time = 30;
let gameRunning = false;

let spawnInterval = null;
let timerInterval = null;

// ==========================
// START GAME
// ==========================

startBtn.addEventListener("click", () => {

    startScreen.style.display = "none";
    gameContainer.style.display = "block";

    bgm.currentTime = 0;
    bgm.play();

    startGame();
});

// ==========================
// CREATE OBJECT
// ==========================

function createObject() {

    if (!gameRunning) return;

    const isEmoji = Math.random() < 0.7;

    let object;

    if (isEmoji) {

        object = document.createElement("div");
        object.classList.add("emoji");

        object.innerText =
            emojis[Math.floor(Math.random() * emojis.length)];

    } else {

        object = document.createElement("img");
        object.classList.add("photo");

        object.src =
            photos[Math.floor(Math.random() * photos.length)];
    }

    const size = 80;

    object.style.left =
        Math.random() * (gameArea.offsetWidth - size) + "px";

    object.style.top = "-100px";

    gameArea.appendChild(object);

    let position = -100;
    const speed = 3 + Math.random() * 4;

    const fall = setInterval(() => {

        if (!gameRunning) {

            clearInterval(fall);

            if (object.parentNode) {
                object.remove();
            }

            return;
        }

        position += speed;
        object.style.top = position + "px";

        if (position > gameArea.offsetHeight) {

            clearInterval(fall);

            if (object.parentNode) {
                object.remove();
            }
        }

    }, 20);

    object.addEventListener("click", () => {

        if (!gameRunning) return;

        if (isEmoji) {

            score -= 1;

            clickEmoji.cloneNode().play();

        } else {

            score += 1;

            clickBubble.cloneNode().play();
        }

        scoreText.textContent = score;

        clearInterval(fall);

        if (object.parentNode) {
            object.remove();
        }
    });
}

// ==========================
// START GAME LOGIC
// ==========================

function startGame() {

    clearInterval(spawnInterval);
    clearInterval(timerInterval);

    gameArea.innerHTML = "";

    score = 0;
    time = 30;

    scoreText.textContent = score;
    timeText.textContent = time;

    gameRunning = true;

    spawnInterval = setInterval(() => {

        createObject();

    }, 600);

    timerInterval = setInterval(() => {

        time--;

        timeText.textContent = time;

        if (time <= 0) {

            endGame();

        }

    }, 1000);
}

// ==========================
// END GAME
// ==========================
function endGame() {

    gameRunning = false;

    clearInterval(spawnInterval);
    clearInterval(timerInterval);

    bgm.pause();
    bgm.currentTime = 0;

    finishedGame.currentTime = 0;
    finishedGame.play();

    gameArea.innerHTML = "";

    finalScore.textContent = score;

    // RESET CLASS SEBELUM MENAMBAHKAN YANG BARU
    resultTitle.className = "";

    if (score < 1) {

        resultTitle.textContent = "😭 Yah Kalah";
        resultMessage.textContent =
            "Kamu terlalu banyak menangkap emoji. Coba lagi ya!";

        resultTitle.classList.add("result-bad");

    } else if (score < 10) {

        resultTitle.textContent = "🙂 Lumayan";
        resultMessage.textContent =
            "Sudah cukup bagus, tapi masih bisa lebih tinggi.";

        resultTitle.classList.add("result-normal");

    } else {

        resultTitle.textContent = "🎉 Hebat!";
        resultMessage.textContent =
            "Keren! Kamu berhasil menghindari emoji dan menangkap banyak foto.";

        resultTitle.classList.add("result-good");
    }

    gameOverModal.classList.add("show");
}

playAgainBtn.addEventListener("click", () => {

    gameOverModal.classList.remove("show");

    bgm.currentTime = 0;
    bgm.play();

    startGame();
});

homeBtn.addEventListener("click", () => {

    gameOverModal.classList.remove("show");

    startScreen.style.display = "flex";
    gameContainer.style.display = "none";
});