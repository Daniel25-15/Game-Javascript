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

class Obstacle{
    constructor (x, y, size, speed, color = "#b51212") {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.color = color;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size)
    }
    collidesWith(player) {
        return(
            player.x + player.size > this.x &&
            player.x < this.x + this.size &&
            player.y + player.size > this.y &&
            player.y < this.x + this.y &&
            player.y < this.y + this.size
        );
    }
}

let keys = {};

window.addEventListener('keydown', e => keys[e.key] = true)
window.addEventListener('keyup', e => keys[e.key] = false)

let obstacles = [
    new Obstacle(400, canvas.height - 50, 50, 4),
    new Obstacle(300, canvas.height - 50, 50, 4),
]

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
    if (keys['ArrowUp'] || keys['w']) jump(); player.facing = 'up';
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
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        if (obstacle.collidesWith(player)) {
            const overlapX = (player.x + player.size / 2) - (obstacle.x + obstacle.size / 2);
            const overlapY = (player.y + player.size / 2) - (obstacle.y + obstacle.size / 2);

            const minOverlapX = (player.size + obstacle.size) / 2 - Math.abs(overlapX);
            const minOverlapY = (player.size + obstacle.size) / 2 - Math.abs(overlapY);

            if (minOverlapX < minOverlapY) {
                if (overlapX > 0) {
                    player.x = obstacle.x + obstacle.size;
                } else {
                    player.x = obstacle.x - player.size;
                }
            } else {
                if (overlapY > 0) {
                    player.y = obstacle.y + size;
                    player.velocityY = 0;
                } else {
                    player.y = obstacle.y - player.size;
                    player.velocityY = 0;
                    player.isOnGround = true;
                }
            }
        }
        if (obstacle.x + obstacle.size < 0) {
            obstacles.splice(i, 1);
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    obstacles.forEach(obstacle => obstacle.draw(ctx))

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