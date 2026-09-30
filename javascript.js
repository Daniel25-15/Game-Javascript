const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const playerImg = new Image();
const test = new Image();


playerImg.src = 'declan.png'
test.src = 'judeAndMagdalene.jpg'

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
    constructor (x, y, width, height, speed, color = "#b51212") {
        this.x = x;
        this.y = y;
        this.width = width,
        this.height = height,
        // this.size = ;
        this.speed = speed;
        this.color = color;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    collidesWith(player) {
        return(
            player.x + player.size > this.x &&
            player.x < this.x + this.width &&
            player.y + player.size > this.y &&
            player.y < this.y + this.height
        );
    }
}

class inventorySlot {
    constructor(x, y, width, height, item, color = "#504d4d") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.item = item;
        this.color = color;
        this.visible = true;
    }
    draw(ctx) {
        if (this.visible) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        } else {
            return;
        }
        if (this.item) {
            const paddingMultiplier = 0.7
            const itemWidth = this.width * paddingMultiplier
            const itemHeight = this.height * paddingMultiplier

            const itemX = this.x + (this.width - itemWidth) / 2;
            const itemY = this.y + (this.height - itemHeight) / 2;

            ctx.drawImage(this.item, itemX, itemY, itemWidth, itemHeight);
        }
    }
    containsPoint(px, py) {
        if (!this.visible) return false;
        return (
            px >= this.x &&
            px <= this.x + this.width &&
            py >= this.y &&
            py <= this.y + this.height
        );
    }
}

let keys = {};

window.addEventListener('keydown', e => keys[e.key] = true)
window.addEventListener('keyup', e => keys[e.key] = false)

let obstacles = [
    new Obstacle(400, canvas.height - 50, 50, 50, 4),
    new Obstacle(300, canvas.height - 50, 50, 50, 4),
    new Obstacle(200, canvas.height - 90, 50, 50, 4),
    new Obstacle(100, canvas.height - 50, 50, 50, 4),
]

let allInventorySlots = []

const startInventoryX = 50;
const startInventoryY = 50;
const inventoryPadding = 10;

const inventorySlotsAmount = 30;
const itemsPerRow = 10;

for (let i = 0; i < inventorySlotsAmount; i ++) {
    const column = i % itemsPerRow;
    const row = Math.floor(i / itemsPerRow);

    const x = startInventoryX + column * (50 + inventoryPadding);
    const y = startInventoryY + row * (50 + inventoryPadding);

    allInventorySlots.push(new inventorySlot(x, y, 50, 50, null))
}

// allInventorySlots.push(new inventorySlot(150, 250, 50, 50, true))

function forClickedInventorySlot(){
    slot.item = itemImage;
}

function addItemToInventory(itemImage) {
    for (let slot of allInventorySlots) {
        if (!slot.item) {
            forClickedInventorySlot()
            return true;
        }
    }
    return false;
}

function checkCollisionsFirst() {
    return obstacles.some(obstacle => obstacle.collidesWith(player));
}

function jump() {
    if (player.isOnGround) {
        player.velocityY = player.jumpHeight;
        player.isOnGround = false;
    }
}
function moveRight() {
    player.facing = 'right';
    const moveAmount = player.speed;

    for (let obstacle of obstacles) {
        obstacle.x -= moveAmount
    }
    if (checkCollisionsFirst()) {
        for (let obstacle of obstacles) {
            obstacle.x += moveAmount;
        }
    }
}
function moveLeft() {
    player.facing = 'left';
    const moveAmount = player.speed;

    for (let obstacle of obstacles) {
        obstacle.x += moveAmount
    }
    if (checkCollisionsFirst()) {
        for (let obstacle of obstacles) {
            obstacle.x -= moveAmount;
        }
    }
}

function toggleInventory() {
    for (let slot of allInventorySlots) {
        slot.visible = !slot.visible;
    }
}

function checkInventorySlotsClicked(mouseX, mouseY) {
    for (let slot of allInventorySlots) {
        if (slot.containsPoint(mouseX, mouseY)) {
            if (slot.item) {
                if (slot.item === playerImg) {
                    console.log('player image');
                }
                slot.item = false
                return true;
            }
            slot.item = playerImg;
            return true;
        }
    }
    return false;
}

window.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    if (checkInventorySlotsClicked(mouseX, mouseY)) return;
    jump()
    
})

window.addEventListener('keydown', e => {
    if ((e.key === 'e' || e.key == 'I') && !e.repeat) {
        toggleInventory(playerImg)
    }
});

function update() {
    if (keys['ArrowRight'] || keys['d']) moveRight();
    if (keys['ArrowLeft'] || keys['a']) moveLeft();
    if (keys['ArrowUp'] || keys['w']) jump();
    // if (keys['f']) toggleInventory;

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
            const overlapX = (player.x + player.size / 2) - (obstacle.x + obstacle.width / 2);
            const overlapY = (player.y + player.size / 2) - (obstacle.y + obstacle.height / 2);

            const minOverlapX = (player.size + obstacle.width) / 2 - Math.abs(overlapX);
            const minOverlapY = (player.size + obstacle.height) / 2 - Math.abs(overlapY);

            if (minOverlapX < minOverlapY) {
                if (overlapX > 0) {
                    player.x = obstacle.x + obstacle.width;
                } else {
                    player.x = obstacle.x - player.size;
                }
            } else {
                if (overlapY > 0) {
                    player.y = obstacle.y + obstacle.height;
                    player.velocityY = 0;
                } else {
                    player.y = obstacle.y - player.size;
                    player.velocityY = 0;
                    player.isOnGround = true;
                }
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    obstacles.forEach(obstacle => obstacle.draw(ctx))

    allInventorySlots.forEach(inventorySlot => inventorySlot.draw(ctx))


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