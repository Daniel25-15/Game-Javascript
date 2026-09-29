const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const playerImg = new Image();

playerImg.src = 'declan.png'

let player = {
    x: 50,
    y: 180,
    size: 30,
    speed: 10,
    jumpHeight: -10,
    velocityY: 0,
    gravity: 0.6,
    isOnGround: false,
    facing: 'right',
};

let obsticle = {
    x:100,
    y:100,
    size: 50,
    speed: 10,
    velocityY: 0,
    gravity: 0.6,
    isOnGround: false,
    facing: 'right',
}

let keys = {};

window.addEventListener('keydown', e => keys[e.key] = true)
window.addEventListener('keyup', e => keys[e.key] = false)

// let isOnGround = false

// async function jump() {
//     if (!isOnGround) return;
//     isOnGround = false;
//     player.y -= player.jumpHeight;
//     await delay(25);
//     player.y += player.jumpHeight;
//     // player.y -= 

//     isOnGround = false;
//     requestAnimationFrame(jump)
// }

function jump() {
    if (player.isOnGround) {
        player.velocityY = player.jumpHeight;
        player.isOnGround = false;
    }
}

window.addEventListener('click', jump)

function update() {
    if (keys['ArrowRight'] || keys['d']) player.x += player.speed; player.facing = 'right';
    if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed; player.facing = 'left';
    if (keys['ArrowUp'] || keys['w']) jump; player.facing = 'up';
    if (keys['ArrowDown'] || keys['s']) player.y += player.speed; player.facing = 'down'

    player.x = Math.max(0, Math.min(canvas.width - player.size, player.x))

    player.y = Math.max(0, Math.min(canvas.height - player.size, player.y))

    player.velocityY += player.gravity;
    player.y += player.velocityY;

    const groundLevel = canvas.height - player.size;

    if (player.y > groundLevel) {
        player.y = groundLevel;
        player.velocityY = 0;
        player.isOnGround = true;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ctx.strokeStyle = '#666';
    // ctx.beginPath();
    // ctx.moveTo(0, canvas.height);
    // ctx.lineTo(canvas.width, canvas.height);
    // ctx.stroke();

    // ctx.fillStyle = '#00ffcc';
    // ctx.drawImage(playerImg, player.x, player.y, player.size, player.size);

    ctx.save();

    if (player.facing === 'left') {
        ctx.translate(player.x + player.size / 2, player.y + player.size / 2);
        ctx.scale(-1, 1);
        ctx.drawImage(playerImg, -player.size / 2, -player.size / 2, player.size, player.size);
    } else {
        ctx.drawImage(playerImg, player.x, player.y, player.size, player.size);
    }
    ctx.restore();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop()