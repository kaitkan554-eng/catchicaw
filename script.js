const gameArea = document.getElementById("gameArea");
const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");

const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");
const gameContainer = document.getElementById("gameContainer");

const emojis = ["👹", "💩", "🐷", "💃", "👻"];

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
const winGame = new Audio("sounds/finishedgame.mp3");
const winGame1 = new Audio("sounds/wingame2.mp3");
const looseGame = new Audio("sounds/loosegame.mp3");
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
let panicMode = false;

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

    const isEmoji = Math.random() < 0.5;

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

    const startX =
        Math.random() * (gameArea.offsetWidth - size);

    object.style.left = startX + "px";
    object.style.top = "-100px";

    gameArea.appendChild(object);

    let position = -100;

    let wave = Math.random() * 100;

    const fall = setInterval(() => {

        if (!gameRunning) {

            clearInterval(fall);

            if (object.parentNode) {
                object.remove();
            }

            return;
        }

        let speed;

        if (time <= 15) {

            speed = 8 + Math.random() * 3;

            wave += 0.18;

            const zigzag =
                Math.sin(wave) * 50;

            object.style.left =
                (startX + zigzag) + "px";

        } else {

            speed = 3 + Math.random() * 3;
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
    time = 60;

    scoreText.textContent = score;
    timeText.textContent = time;

    gameRunning = true;

    panicMode = false;
    gameArea.classList.remove("panic-mode");

    spawnInterval = setInterval(() => {

        createObject();

    }, time <= 10 ? 250 : 600);

    timerInterval = setInterval(() => {

        time--;

        timeText.textContent = time;

        if (time === 15 && !panicMode) {

            panicMode = true;

            gameArea.classList.add("panic-mode");

            showPanicText();
        }
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

    gameArea.innerHTML = "";

    finalScore.textContent = score;

    // RESET CLASS SEBELUM MENAMBAHKAN YANG BARU
    resultTitle.className = "";

    if (score < 1) {

        looseGame.currentTime = 0;
        looseGame.play();

        resultTitle.textContent = "😑PAYAH! Lo Kalah";
        resultMessage.textContent =
            "Payah kebanyakan tangkap emoji! ";

        resultTitle.classList.add("result-bad");

    } else if (score < 20) {

        winGame1.currentTime = 0;
        winGame1.play();

        resultTitle.textContent = "🙂 Lumayan";
        resultMessage.textContent =
            "Cukup, tapi masih payah. ga bisa lebih tinggi lagi?🤣";

        resultTitle.classList.add("result-normal");

    } else {

        winGame.currentTime = 0;
        winGame.play();

        resultTitle.textContent = "🎉oke deh hebat!";
        resultMessage.textContent =
            "iya deh lo Keren! berhasil menghindari emoji dan menangkap banyak foto.";

        resultTitle.classList.add("result-good");
    }
    gameArea.classList.remove("panic-mode");
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

function showPanicText() {

    const text = document.createElement("div");

    text.className = "panic-text";

    text.innerHTML = "🔥PANIC MODE🔥";

    document.body.appendChild(text);

    setTimeout(() => {

        text.remove();

    }, 2000);
}