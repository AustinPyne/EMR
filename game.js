const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let time = 60;
let gameOver = false;
let paused = false;

// UI elements
const homeScreen = document.getElementById('homeScreen');
const startButton = document.getElementById('startButton');
const gameUI = document.getElementById('gameUI');
const pauseButton = document.getElementById('pauseButton');

// Player
const boat = {
    x: canvas.width/2,
    y: canvas.height-120,
    width: 80,
    height: 50,
    dx: 0,
    speed: 7,
    sprite: new Image()
};
boat.sprite.src = 'assets/boat.png';

// Trash and power-ups
const trashArray = [];
const trashImages = ['assets/trash1.png','assets/trash2.png','assets/trash3.png'].map(src=>{
    const img = new Image(); img.src = src; return img;
});

const powerUps = [];
const powerUpImage = new Image();
powerUpImage.src = 'assets/net.png';

// Sounds
const collectSound = new Audio('assets/collect.mp3');
const powerUpSound = new Audio('assets/powerup.mp3');

// Event listeners
startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', togglePause);
document.addEventListener('keydown', e=>{
    if(e.key==='ArrowRight'||e.key==='d') boat.dx = boat.speed;
    if(e.key==='ArrowLeft'||e.key==='a') boat.dx = -boat.speed;
});
document.addEventListener('keyup', e=>{
    if(e.key==='ArrowRight'||e.key==='d') boat.dx=0;
    if(e.key==='ArrowLeft'||e.key==='a') boat.dx=0;
});

// Game logic
function createTrash() {
    if(paused) return;
    const size = 40+Math.random()*30;
    const img = trashImages[Math.floor(Math.random()*trashImages.length)];
    trashArray.push({x: Math.random()*(canvas.width-size), y:-size, width:size, height:size, speed:2+Math.random()*3, img:img});
}

function createPowerUp() {
    if(paused) return;
    const size = 50;
    powerUps.push({x: Math.random()*(canvas.width-size), y:-size, width:size, height:size, speed:2+Math.random()*2, img: powerUpImage});
}

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(boat.sprite, boat.x, boat.y, boat.width, boat.height);
    trashArray.forEach(t=>ctx.drawImage(t.img, t.x, t.y, t.width, t.height));
    powerUps.forEach(p=>ctx.drawImage(p.img,p.x,p.y,p.width,p.height));
}

function moveObjects() {
    boat.x += boat.dx;
    if(boat.x<0) boat.x=0;
    if(boat.x+boat.width>canvas.width) boat.x=canvas.width-boat.width;

    trashArray.forEach((t,i)=>{
        t.y += t.speed;
        if(t.y>canvas.height) trashArray.splice(i,1);
        if(collide(t, boat)){
            trashArray.splice(i,1);
            score++;
            collectSound.play();
            updateQuest("trash");
            updateScore();
        }
    });

    powerUps.forEach((p,i)=>{
        p.y += p.speed;
        if(p.y>canvas.height) powerUps.splice(i,1);
        if(collide(p, boat)){
            powerUps.splice(i,1);
            score +=5;
            powerUpSound.play();
            updateQuest("powerup");
            updateScore();
        }
    });
}

function collide(a,b){
    return a.x < b.x+b.width && a.x+a.width>b.x && a.y<b.y+b.height && a.y+a.height>b.y;
}

function updateScore(){
    document.getElementById("scoreboard").innerText = `Score: ${score} | Time: ${time}`;
}

function gameLoop(){
    if(!paused){
        draw();
        moveObjects();
    }
    requestAnimationFrame(gameLoop);
}

function startGame(){
    homeScreen.style.display="none";
    gameUI.style.display="block";
    score=0;
    time=60;
    gameOver=false;
    resetQuests();
    updateScore();
    updateQuestUI();
}

function togglePause(){
    paused = !paused;
    pauseButton.innerText = paused ? "Resume" : "Pause";
}

// Timers
setInterval(()=>{
    if(paused || gameOver) return;
    time--;
    updateScore();
    updateQuest("time");
    if(time<=0){
        alert("Game Over! Score: "+score);
        gameOver = true;
    }
},1000);

setInterval(createTrash,1000);
setInterval(createPowerUp,8000);

// Start loop
gameLoop();
