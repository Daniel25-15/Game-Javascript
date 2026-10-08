import { buildMapOne, } from './maps.js';
import { playerClass, Obstacle, inventorySlot, GhostObstacle, } from './classes.js';


export const canvas = document.getElementById('game');
export const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const playerImg = new Image();
const test = new Image();
const blockImg = new Image();
const bgImage = new Image();
const hudImg = new Image();
const shovelImg = new Image();
const placeholder = new Image();
const arrowImg = new Image();
const axImg = new Image();
const crateImg = new Image();
const enemyImg = new Image();
const bowImg = new Image();
const potatoImg = new Image();
const spearImg = new Image();
const secondEnemyImg = new Image();
export const damagedImg = new Image();

const bgParaFactor = 0.5;

playerImg.src = 'assets/declan.png'
test.src = 'assets/judeAndMagdalene.jpg'
blockImg.src = 'assets/blocks.svg'
bgImage.src = 'assets/backgroundLoop.svg'
hudImg.src = 'assets/hud-outline.svg'
shovelImg.src = 'assets/shovel.png'
placeholder.src = 'assets/placeholder.png'
arrowImg.src = 'assets/arrow.png'
axImg.src = 'assets/ax.png'
crateImg.src = 'assets/crate.png'
enemyImg.src = 'assets/enemy.png'
damagedImg.src = 'assets/damage.png'
bowImg.src = 'assets/bow.png'
potatoImg.src = 'assets/potato.png'
spearImg.src = 'assets/spear.png'
secondEnemyImg.src = 'assets/secondEnemy.png'

// let player = {
//     x: 100,
//     y: 180,
//     size: 30,
//     speed: 10,
//     jumpHeight: -10,
//     velocityY: 0,
//     gravity: 0.65,
//     isOnGround: false,
//     facing: 'right',
//     currentItem: NaN,
// };


let healthAmount = 100;

class hudItem {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    };
    draw(ctx) {
        ctx.drawImage(hudImg, this.x, this.y, this.width, this.height);
        ctx.font = '48px sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText(`Health ${ healthAmount }`, this.x + 20, this.y + 60);
    }
}

function dealDamageToPlayer(damageAmount) {
    healthAmount -= damageAmount / player.armorMultiplier;
}

export function randomNumber(minimum, maximuum) {
    return Math.floor(Math.random() * (maximuum - minimum + 1)) + minimum;
}

const player = new playerClass(350, 180, 30, 10)

let cameraX = 0;

function drawBackground() {
    if (!bgImage.complete) return;
    
    const bgWidth = canvas.width * 1.5;
    const bgHeight = canvas.height * 1;

    let offsetX = ((cameraX * bgParaFactor) % bgWidth + bgWidth) % bgWidth;
    
    if (offsetX < 0) {
        offsetX += bgWidth;
    }

    // console.log('Player X:', player.x, 'Offset X:', offsetX);

    ctx.drawImage(bgImage, -offsetX, 0, bgWidth, bgHeight);
    ctx.drawImage(bgImage, -offsetX + bgWidth, 0, bgWidth, bgHeight);

    ctx.drawImage(bgImage, -offsetX - bgWidth, 0, bgWidth, bgHeight);
}




// function checkCollisionsEnemyFirst() {
//     return enemies.some(enemy => 
//         obstacles.some(obstacle => obstacle.collidesWith(enemy))
//     )
// }

class enemyBasic {
    constructor(x, y, width, height, health, speed, image) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.health = health;
        this.speed = speed;
        this.gravity = 0.65;
        this.velocityY = 0;
        this.isOnGround = false;
        this.jumpHeight = -10;
        this.image = image;

        this.targetX = x;
        this.targetY = y;
        this.moveAmountX = 0;
        this.moveAmountY = 0;

        this.timer = 0;
        this.intervals = 20;
        this.cooldown = 120;
        this.secondCooldown = 60;
        this.jumpTimer = 0;
        this.jumpTimerIntervals = 120;

    }
    checkCollisionsEnemyFirst() { 
        return obstacles.some(obstacle => obstacle.collidesWithOther(this))
    }
    jump() {
        if (this.isOnGround) {
            this.velocityY = this.jumpHeight;
            this.isOnGround = false;
        }
    }
    collidesWithOther(other) {
        return(
            other.x + other.width > this.x &&
            other.x < this.x + this.width &&
            other.y + other.height > this.y &&
            other.y < this.y + this.height
        );
    }
    update() {
        this.timer++;
        this.jumpTimer++;
        if (this.cooldown > 0) {
            this.cooldown--;
        }
        if (this.secondCooldown > 0) {
            this.secondCooldown--;
        }
        if (this.image.src === enemyImg.src) {
            if (this.timer >= this.intervals) {
                this.targetX = player.x + (player.size / 2) - (this.width / 2);
                this.targetY = player.y + (player.size / 2) - (this.height / 2);
                this.timer = 0;
            }

            if (this.jumpTimer > this.jumpTimerIntervals) {
                this.jumpTimer = this.jumpTimerIntervals + 1
            }

            if (this.jumpTimer >= this.jumpTimerIntervals) {
                if (player.y < this.y) {
                    this.jump()
                    this.jumpTimer = 0;
                }
            }



            if (isOverLaping(this.x, this.y, 50, 50)) {
                console.log('stuck')
                this.x += 1
            }

            let distanceX = this.targetX - this.x;
            let distanceY = this.targetY - this.y;

            let distance = Math.hypot(distanceX, distanceY);

            if (distance > 5) {
                let moveX = (distanceX / distance) * this.speed;
                let moveY = (distanceY / distance) * this.speed;
                
                this.moveAmountX = moveX;
                this.moveAmountY = moveY;

                this.x += moveX

                if (this.checkCollisionsEnemyFirst()) {
                    this.x -= moveX
                }            
            }
            if (distance <= 25) {
                if (this.cooldown <= 0) {
                    dealDamageToPlayer(10);
                    this.cooldown = 40;
                }
            }
        }
        if (this.image.src === secondEnemyImg.src) {
            // console.log(`Current Enemy Type: ${ this.image.src }`)
            if (this.timer >= this.intervals) {
                this.targetX = player.x + (player.size / 2) - (this.width / 2);
                this.targetY = player.y + (player.size / 2) - (this.height / 2);
                this.timer = 0;
            }

            let distanceX = this.targetX - this.x;
            let distanceY = this.targetY - this.y;

            let distance = Math.hypot(distanceX, distanceY);

            if (distance > 5) {
                let moveX = (distanceX / distance) * this.speed;
                let moveY = (distanceY / distance) * this.speed;
                
                this.moveAmountX = moveX;
                this.moveAmountY = moveY;

                this.x += moveX

                if (this.checkCollisionsEnemyFirst()) {
                    this.x -= moveX
                }            
            }
            if (distance <= 50) {
                if (this.secondCooldown <= 0) {
                    dealDamageToPlayer(25);
                    this.secondCooldown = 60;
                }
            }
        }
    };

    draw(ctx) {
        // ctx.drawImage(test, this.x, this.y, this.width, this.height);
        // ctx.fillStyle = 'red';
        // ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        ctx.font = '16px sans-serif';
        ctx.fillStyle = 'white';
        // ctx.fillText(`Health ${ this.health }`, this.x - this.width / 4, this.y - 10);
        if (this.health >= 300) {
            ctx.fillStyle = '#ef08b2'
            ctx.fillText(`██████`, (this.x + this.width / 2) - 40, this.y - 10);
        }
        if (this.health >= 125 && this.health < 300) {
            ctx.fillStyle = '#3a3939'
            ctx.fillText(`██████`, (this.x + this.width / 2) - 40, this.y - 10);
        }
        if (this.health >= 100 && this.health < 125) {
            ctx.fillStyle = 'green'
            ctx.fillText(`█████`, (this.x + this.width / 2) - 40, this.y - 10);
        }
        if (this.health >= 75 && this.health < 100) {
            ctx.fillStyle = 'yellow'
            ctx.fillText(`████ `, (this.x + this.width / 2) - 40, this.y - 10);
        }
        if (this.health >= 50 && this.health < 75) {
            ctx.fillStyle = 'orange'
            ctx.fillText(`███  `, (this.x + this.width / 2) - 40, this.y - 10);
        }
        if (this.health >= 25 && this.health < 50) {
            ctx.fillStyle = 'red'
            ctx.fillText(`██   `, (this.x + this.width / 2) - 40, this.y - 10);
        }
        if (this.health >= 0 && this.health < 25) {
            ctx.fillStyle = '#820707'
            ctx.fillText(`█   `, (this.x + this.width / 2) - 40, this.y - 10);
        }
        
        // ctx.fillText(`Jump Delay ${ this.jumpTimer }`, this.x - this.width / 4, this.y - 30);
    }
}

// █

window.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    currentMouseX = event.clientX - rect.left;
    currentMouseY = event.clientY - rect.top;

})

function drawProjectile(ctx, img, x, y, width, height, angle) {
    const projectileDX = currentMouseX - x;
    const projectileDY = currentMouseY - y;

    const projectileAngle = Math.atan2(projectileDY, projectileDX)

    ctx.save()
    // ctx.translate(x + width / 2, y + height / 2);
    ctx.translate(x, y)
    ctx.rotate(angle + Math.PI / 2);
    ctx.drawImage(img, -width / 2, -height / 2, width, height);
    ctx.restore();
}

class projectile {
    constructor(x, y, mouseX, mouseY, image, speed = 8) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.secondX = mouseX;
        this.secondY = mouseY;
        this.speed = speed;
        this.image = image;

        let dx = mouseX - this.x;
        let dy = mouseY - this.y;

        this.angle = Math.atan2(dy, dx);

        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;

    };
    collidesWithOther(other) {
        return(
            other.x + other.width > this.x &&
            other.x < this.x + this.width &&
            other.y + other.height > this.y &&
            other.y < this.y + this.height
        );
    };
    update() {
        // let angle = Math.atan(this.secondY - this.y, this.secondX - this.x);
        // drawProjectile(ctx, test, this.x, this.y, 100, 100, angle);
        this.x += this.vx;
        this.y += this.vy;
    };
    draw(ctx) {
        // ctx.save();
        // ctx.translate(this.x, this.y);
        // ctx.rotate(-90)
        drawProjectile(ctx, this.image, this.x, this.y, this.width, this.height, this.angle);
        
        // ctx.restore();
    };  
}

const playerHealth = new hudItem(50, 0, 300, 90)

// const newEnemy = new enemyBasic(100, canvas.height - 50, 50, 50, 100, 0.05)

let keys = {};

window.addEventListener('keydown', e => keys[e.key] = true)
window.addEventListener('keyup', e => keys[e.key] = false)

export let obstacles = []
export let ghostObstacles = []

// ghostObstacles.push(new GhostObstacle(0, canvas.height - 50, 50, 50, 4, blockImg))

let enemies = [
    // new enemyBasic(100, canvas.height - 50, 50, 50, 100, 5, enemyImg)
]

export function spawnEnemy(x, width, height, health, speed, image, y) {
    if (image === enemyImg) {
        enemies.push(new enemyBasic(x, canvas.height - (100 + height), width, height, health, speed, image))
    } else {
        if (image.src === secondEnemyImg.src) {
            console.log('Spawned Second enemy')
            enemies.push(new enemyBasic(x, canvas.height - y, width, height, health, speed, image))
        }
    } 
}

let numberOfEnemies = 3
let enemyHealth = 100
let currentWave = 0;

function summonWaves(x) {
    currentWave++;
    numberOfEnemies++;
    if (currentWave % 5 === 0) {
        enemyHealth += 25;
    }
    if (currentWave === 5) addItemToInventory(spearImg)
    for (let ee = 0; ee < numberOfEnemies; ee++) {
        spawnEnemy(x + (ee * 100), 50, 50, enemyHealth, 5, enemyImg, canvas.height - 150);
    }
    
}


// spawnEnemy(200, 100, 100, 350, 5, secondEnemyImg);
// spawnEnemy(150, 100, 100, 350, 5, secondEnemyImg);


const projectiles = [];

let allInventorySlots = []

const startInventoryX = 50;
const startInventoryY = 100;
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



function attackFromPlayer(damageAmount, range) {
    const attackLeft = player.x - range;
    const attackRight = (player.x + player.size) + range;
    for (let enemy of enemies) {
        const enemyLeft = enemy.x;
        const enemyRight = enemy.x + enemy.width;
        let attackRange = enemyRight >= attackLeft && enemyLeft <= attackRight;
        if (attackRange) {
            enemy.health -= (damageAmount * player.damageMultiplier)
        }
    }
}

function forClickedInventorySlot(itemImage) {
    for (let slot of allInventorySlots) {
        slot.item = itemImage;
    }
}

function addItemToInventory(itemImage) {
    const emptySlot = allInventorySlots.find(slot => !slot.item);
    if (emptySlot) {
        emptySlot.item = itemImage;
        return true;
    }
    return false;
}

function checkCollisionsFirst() {
    return obstacles.some(obstacle => obstacle.collidesWith(player));
}

let relativeX = 0
let relativeY = 0

function jump() {
    if (player.isOnGround) {
        player.velocityY = player.jumpHeight;
        player.isOnGround = false;
    }
}

function moveRight() {
    player.facing = 'right';
    const moveAmount = player.speed;

    cameraX += moveAmount;
    relativeX += moveAmount;
    // console.log(`Relative X: ${ relativeX }`)

    for (let obstacle of obstacles) {
        obstacle.x -= moveAmount
    }
    for (let enemy of enemies) {
        enemy.x -= moveAmount
    }
    for (let ghost of ghostObstacles) {
        ghost.x -= moveAmount
    }
    if (checkCollisionsFirst()) {
        for (let obstacle of obstacles) {
            obstacle.x += moveAmount;
        }
        for (let enemy of enemies) {
            enemy.x += moveAmount
        }
        for (let ghost of ghostObstacles) {
            ghost.x += moveAmount
        }
        cameraX -= moveAmount
    }
}
function moveLeft() {
    player.facing = 'left';
    const moveAmount = player.speed;

    cameraX -= moveAmount;
    relativeX -= moveAmount;
    // console.log(`Relative X: ${ relativeX }`)

    for (let obstacle of obstacles) {
        obstacle.x += moveAmount
    }
    for (let enemy of enemies) {
        enemy.x += moveAmount
    }
    for (let ghost of ghostObstacles) {
        ghost.x += moveAmount
    }
    if (checkCollisionsFirst()) {
        for (let obstacle of obstacles) { 
            obstacle.x -= moveAmount;
        }
        for (let ghost of ghostObstacles) {
            ghost.x -= moveAmount
        }
    for (let enemy of enemies) {
        enemy.x -= moveAmount
    }
        cameraX += moveAmount;
    }
}

function buildObstacleAtPlayer() {
    if (player.isOnGround) {
        const slotWithBlock = allInventorySlots.find(s => s.item === blockImg);
        if (!slotWithBlock) return;
        // const offset = player.facing === 'left' ? -50 : player.width + 10;
        let offset
        if (player.facing === 'left') {
            offset = -40
        } else {
            offset = (player.x - player.size) - 270
        }
        const buildObstacleX = player.x + offset;
        const buildObstacleY = canvas.height - 50;

        if (isOverLaping(buildObstacleX, buildObstacleY, 50, 50)) {
            console.log('No space')
            return;
        }
        addObstacle(buildObstacleX, buildObstacleY, 50, 50, 4, blockImg)
        slotWithBlock.item = false;
    }
}

// dealDamageToPlayer(10)

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
                if (slot.item === blockImg) {
                    if (player.isOnGround){
                        let offset
                        if (player.facing === 'left') {
                            offset = -40
                        } else {
                            offset = (player.x + player.size) - 75
                        }
                        const buildObstacleX = player.x + offset;
                        const buildObstacleY = canvas.height - 50;
                        if (isOverLaping(buildObstacleX, buildObstacleY, 50, 50)) return true;
                        buildObstacleAtPlayer()
                        // slot.item = false
                        return true;
                    }
                    return true;
                }
                if (slot.item === shovelImg) {
                    console.log('shovel')
                    player.currentItem = shovelImg;
                    player.damageMultiplier = 1.5;
                    player.attackRange = 100;
                    return true;
                } 
                if (slot.item === axImg) {
                    player.currentItem = axImg;
                    player.damageMultiplier = 1.75;
                    player.attackRange = 85;
                    return true;
                } 
                if (slot.item === potatoImg) {
                    if (healthAmount === 100 || healthAmount >= 100) {
                        return true;
                    }
                    if (healthAmount <= 90) {
                        healthAmount += 10;
                    } else {
                        healthAmount = 100
                    }
                }
                if (slot.item === bowImg) {
                    player.currentItem = bowImg;
                    return true;
                }
                if (slot.item === spearImg) {
                    player.currentItem = spearImg;
                    player.damageMultiplier = 2;
                    player.attackRange = 150;
                    return true;
                }
                slot.item = false
                return true;
                
            }
            // slot.item = playerImg;
            player.currentItem = null;
            return true;
        }
    }
    return false;
}

summonWaves(relativeX + 800)


let lootpool = [potatoImg, blockImg]

function checkObstaclesClicked(mouseX, mouseY) {
    if (player.currentItem === shovelImg || player.currentItem === axImg) {
        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = obstacles[i]
            // console.log(`Obstacle Health: ${ obstacle.health }`)
            if (obstacle.containsPoint(mouseX, mouseY)) {
                console.log('Block Clicked');
                if (obstacle.health > 0) {
                    obstacle.health -= 1
                }
                if (obstacle.health <= 0) {
                    if (obstacle.image.src !== blockImg.src || obstacle.image.src !== crateImg.src) console.log(`Obstacle Image Exception: ${ obstacle.image }`)
                    if (obstacle.image.src === blockImg.src) {
                        const addedItem = addItemToInventory(blockImg);
                        if (addedItem) {
                            obstacles.splice(i, 1);
                            return true;
                        } else {
                            return false;
                        }
                    }
                    if (obstacle.image.src === crateImg.src) {
                        const randomLootPoolIndex = Math.floor(Math.random() * lootpool.length);
                        const chosenLootPool = lootpool[randomLootPoolIndex];
                        const addedItem = addItemToInventory(chosenLootPool);
                        if (addedItem) {
                            obstacles.splice(i, 1);
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        if (obstacle.image.src !== blockImg.src || obstacle.image.src !== crateImg.src) console.log(`Obstacle Image Exception: ${ obstacle.image }`)
                        console.log(`Obstacle Image Exception: ${ obstacle.image }`)
                        obstacles.splice(i, 1);
                    }
                }
            }
        }
    }
    return false;
}

addItemToInventory(shovelImg)
addItemToInventory(axImg)
addItemToInventory(bowImg)
addItemToInventory(blockImg)
addItemToInventory(blockImg)
addItemToInventory(potatoImg)
// dealDamageToPlayer(5)

function clearInventory() {
    for (let slot of allInventorySlots) {
        if (slot.item !== shovelImg || slot.item !== axImg) {
            slot.item = null
        }
    }
    const hasStarterItem = allInventorySlots.some(slot => slot.item === shovelImg);
    const hasStarterItemSecond = allInventorySlots.some(slot => slot.item === axImg);
        if (hasStarterItem && hasStarterItemSecond) {
            console.log('Has Shovel');
            return;
        }
    addItemToInventory(shovelImg)
    addItemToInventory(axImg)
}
function playerDeath() {
    clearInventory();
    healthAmount = 100;
    enemies = [];
    enemyHealth = 100;
    currentWave = 0;
    numberOfEnemies = 3;
    player.currentItem = false;
    obstacles = []
    buildMapOne()
}

buildMapOne()

window.addEventListener('keydown', e => {
    if ((e.key === 'g' || e.key == 'G') && !e.repeat) {
    }
});


function isOverLaping(newX, newY, width, height) {
    return obstacles.some(obstacle => {
        return (
            newX < obstacle.x + obstacle.width &&
            newX + width > obstacle.x &&
            newY < obstacle.y + obstacle.height &&
            newY + height > obstacle.y
        );
    });
}

export function addObstacle(obstacleX, obstacleY, width = 50, height = 50, speed, image, ghost = false,) {
    const gridSize = 50;
    const gridX = Math.floor(obstacleX / gridSize) * gridSize;
    const gridY = Math.floor(obstacleY / gridSize) * gridSize;

    if (isOverLaping(gridX, gridY, width, height)) {
        console.log('Grid slot taken')
        return false;
    }
    // if (ghost) {
    //     obstacles.push(new GhostObstacle(gridX, gridY, width, height, speed, image))
    // }

    obstacles.push(new Obstacle(gridX, gridY, width, height, speed, image))
    return true;
}

// obstacles.push(new Obstacle(350, canvas.height - 50, 50, 50, 4, crateImg))

// function buildMap(mapNumber) {
//     if (mapNumber === 'mapDefault') {
//         // console.log('imported file')
//         addObstacle(150, canvas.height - 50, 50, 75, 4)
//     }
// }
// buildMap('mapDefault')
function clearMap() {
    while (obstacles.length > 0) {
        obstacles.pop()
    }
}
// clearMap()


window.addEventListener('keydown', e => {
    if ((e.key === 'q' || e.key == 'Q') && !e.repeat) {
        buildObstacleAtPlayer()
    }
});


window.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    if (checkInventorySlotsClicked(mouseX, mouseY)) return;
    if (checkObstaclesClicked(mouseX, mouseY)) return;
    if (player.currentItem === bowImg) {
        projectiles.push(new projectile(player.x + player.size, player.y + player.size - 5, mouseX, mouseY, arrowImg,8));
    } else if (player.currentItem === blockImg) {
        buildObstacleAtPlayer();
        player.currentItem = false;
    } else if (player.currentItem === potatoImg) {

    } else {
        // console.log(`Attack Range: ${ player.attackRange }`)
        attackFromPlayer(10, player.attackRange)
        player.attack()
    }
})

window.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        jump()
    };
})

window.addEventListener('keydown', (event) => {
    if (event.key === '1') {
        const slot = allInventorySlots[0];
        if (slot && slot.item) {
            player.currentItem = slot.item;
        } else {
            player.currentItem = false;
        }
    }
    if (event.key === '2') {
        const slot = allInventorySlots[1];
        if (slot && slot.item) {
            player.currentItem = slot.item;
        } else {
            player.currentItem = false;
        }
    }
    if (event.key === '3') {
        const slot = allInventorySlots[2];
        if (slot && slot.item) {
            player.currentItem = slot.item;
        } else {
            player.currentItem = false;
        }
    }
    if (event.key === '4') {
        const slot = allInventorySlots[3];
        if (slot && slot.item) {
            player.currentItem = slot.item;
        } else {
            player.currentItem = false;
        }
    }
})

let currentMouseX = 0;
let currentMouseY = 0;



// window.addEventListener('keydown', (event) => {
//     if ((event.key === 'r' || event.key === 'R') && !event.repeat) {
//     projectiles.push(new projectile(player.x, player.y, currentMouseX, currentMouseY, 8));
//     }
// })

window.addEventListener('keydown', e => {
    if ((e.key === 'e' || e.key == 'E') && !e.repeat) {
        const explinationTitle = document.getElementById('explinations')
        explinationTitle.textContent = ' '
        toggleInventory(playerImg)
    }
});

function update() {
    if (keys['ArrowRight'] || keys['d']) moveRight();
    if (keys['ArrowLeft'] || keys['a']) moveLeft();
    if (keys['ArrowUp'] || keys['w']) jump();

    player.x = Math.max(0, Math.min(canvas.width - player.size, player.x))

    player.y = Math.max(0, Math.min(canvas.height - player.size, player.y))

    player.velocityY += player.gravity;
    player.y += player.velocityY;

    const groundLevel = canvas.height - player.size;
    
    
    for (let enemy of enemies) {
        enemy.isOnGround = false;
        
        const groundLevelEnemy = canvas.height - enemy.height;
        enemy.velocityY += enemy.gravity;
        enemy.y += enemy.velocityY;

        if (enemy.y > groundLevelEnemy) {
            enemy.y = groundLevelEnemy;
            enemy.velocityY = 0;
            enemy.isOnGround = true;
        }
    }

    enemies = enemies.filter(enemy => enemy.health > 0);

    if (healthAmount > 100) {
        healthAmount = 100
    }

    if (player.y > groundLevel) {
        player.y = groundLevel;
        player.velocityY = 0;
        player.isOnGround = true;
    }

    if (healthAmount <= 0) {
        playerDeath()
    }

    if (!player.currentItem) {
        player.attackRange = 100
    }

    player.updateAttack()

    for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        if (!p) continue;
        const hitEnemy = enemies.find(enemy => p.collidesWithOther(enemy));
        if (hitEnemy) {
            projectiles.splice(i, 1);
            hitEnemy.health -= 10;
        }
    }

    if (enemies.length <= 0) {
        summonWaves(relativeX + 500)
    }

    for (let enemy of enemies) {
        const otherEnemy = enemies.find(enemyOver => 
            enemy !== enemyOver && enemy.collidesWithOther(enemyOver)
        );
        if (otherEnemy) {
            const pushBack = Math.max(1, Math.abs(enemy.moveAmountX));
            if (enemy.x < otherEnemy.x) {
                enemy.x -= pushBack;
            } else {
                enemy.x += pushBack;
            }
        }
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
        for (let enemy of enemies) {
            if (obstacle.collidesWithOther(enemy)) {
                const overlapEnemyX = (enemy.x + enemy.width / 2) - (obstacle.x + obstacle.width / 2);
                const overlapEnemyY = (enemy.y + enemy.height / 2) - (obstacle.y + obstacle.height / 2);

                const minOverlapEnemyX = (enemy.width + obstacle.width) / 2 - Math.abs(overlapEnemyX);
                const minOverlapEnemyY = (enemy.height + obstacle.height) / 2 - Math.abs(overlapEnemyY);

                if (minOverlapEnemyX < minOverlapEnemyY) {
                    if (overlapEnemyX > 0) {
                        enemy.x = obstacle.x + obstacle.width;
                    } else {
                        enemy.x = obstacle.x - enemy.width;
                    }
                } else {
                    if (overlapEnemyY < 0) {
                        enemy.y = obstacle.y - enemy.height;
                        enemy.velocityY = 0;
                        enemy.isOnGround = true;
                    } else {
                        enemy.y = obstacle.y + obstacle.height;
                        if (enemy.velocityY < 0) {
                            enemy.velocityY = 0;
                        }
                    }
                }
            }
        }
    }
    for (let enemy of enemies) {
        enemy.update()
    }
}

function draw() {
    drawBackground();

    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let ghost of ghostObstacles) {
        ghost.draw(ctx)
    }

    obstacles.forEach(obstacle => obstacle.draw(ctx));



    // ghostObstacles.forEach(ghost => ghost.draw(ctx));

    allInventorySlots.forEach(inventorySlot => inventorySlot.draw(ctx))

    playerHealth.draw(ctx)

    for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        p.update();
        p.draw(ctx);
        
        if (
            p.x < -p.width ||
            p.x > canvas.width + p.width ||
            p.y < -p.height ||
            p.y > canvas.height + p.height
        ) {
            projectiles.splice(i, 1)
        }
    }

    enemies.forEach(enemy => enemy.draw(ctx))
    // newEnemy.draw(ctx)
    player.draw(ctx)
}

function gameLoop() {
    update();
    draw();
    
    requestAnimationFrame(gameLoop);
}

gameLoop()