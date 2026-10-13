import { damagedImg, player, dealDamageToPlayer, randomNumber, canvas, basicArmor } from "./javascript.js"; 

const playerImg = new Image();
const test = new Image();
const blockImg = new Image();
const bgImage = new Image();
const hudImg = new Image();
const shovelImg = new Image();
const placeholder = new Image();
const arrowImg = new Image();
const birdImg = new Image();
const mysteryBox = new Image();
// const basicArmor = new Image();
// const damagedImg = new Image();


const bgParaFactor = 0.5;

playerImg.src = 'assets/declan.png'
test.src = 'assets/judeAndMagdalene.jpg'
blockImg.src = 'assets/blocks.svg'
bgImage.src = 'assets/backgroundLoop.svg'
hudImg.src = 'assets/hud-outline.svg'
shovelImg.src = 'assets/shovel.png'
placeholder.src = 'assets/placeholder.png'
arrowImg.src = 'assets/arrow.png'
birdImg.src = 'assets/bird.png'
mysteryBox.src = 'assets/mysteryBox.png'
// basicArmor.src = "assets/helmet.png"
// damagedImg.src = 'assets/damage.png'


export class playerClass {
    constructor(x, y, size, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.jumpHeight = -10;
        this.velocityY = 0;
        this.gravity = 0.65;
        this.isOnGround = false;
        this.facing = 'right';
        this.currentItem = NaN;
        this.currentItemObject = NaN;
        this.armorMultiplier = 1;
        this.damageMultiplier = 1;
        this.rotationAngle = 0;
        this.currentDescription = null;

        this.isAttacking = false;
        this.attackProgress = 0;
        this.attackSpeed = 0.1;
        this.attackRange = 100;
        this.attackCooldown = 0;
        this.attackCooldownTime = 0;

        this.hasArmor = false;
        this.currentArmor = null;

        this.score = 0;
    };
    attack() {
        if (!this.isAttacking) {
            this.isAttacking = true;
            this.attackProgress = 0;
        }
    }
    updateAttack() {
        this.attackCooldown++;
        if (this.isAttacking) {
            this.attackProgress += this.attackSpeed;
            this.rotationAngle = Math.sin(this.attackProgress * Math.PI) * (Math.PI / 2);
            
            if (this.attackProgress >= 1) {
                // console.log(`Attack Cooldown: ${ this.attackCooldown }`)
                this.isAttacking = false;
                this.attackProgress = 0;
                this.rotationAngle = 0;
            }
        }
    }
    draw(ctx) {
        ctx.save();
        if (this.facing === 'left') {
            ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
            ctx.scale(-1, 1);
            ctx.drawImage(playerImg, -this.size / 2, -this.size / 2, this.size, this.size);
        //     if (this.currentItem) {
        //         ctx.drawImage(this.currentItem, this.size / 2, - 5, 20, 20,)
        //     }
        } else {
            ctx.drawImage(playerImg, this.x, this.y, this.size, this.size);
            // if (this.currentItem) {
            //     ctx.drawImage(this.currentItem, this.x + this.size, this.y + this.size / 2 - 5, 20, 20,)
            // }
        }
        ctx.restore()
        if (this.hasArmor) {
            ctx.save();
            const armorSizeSpacer = 10
            ctx.drawImage(this.currentArmor, this.x - (armorSizeSpacer / 2), this.y - (armorSizeSpacer - 3), this.size + armorSizeSpacer, this.size + armorSizeSpacer);
            ctx.restore();
        }
        if (this.currentItem) {
            ctx.save();
            const itemW = 20;
            const itemH = 20;

            let itemPivotX = this.facing === 'left' ? this.x - 5 : this.x + this.size + 5;
            let itemPivotY = this.y + this.size / 2;

            ctx.translate(itemPivotX, itemPivotY);

            // ctx.rotate(this.facing === 'left' ? -this.rotationAngle : this.rotationAngle)
            // let itemAngle = this.facing === 'left' ? -this.rotationAngle : this.rotationAngle;

            // ctx.rotate(itemAngle)
            if (this.facing === 'left') {
                ctx.scale(-1, 1);
            }
            ctx.rotate(this.rotationAngle)

            ctx.drawImage(this.currentItem, -itemW / 2, -itemH / 2, itemW, itemH);
            ctx.restore()
        }
        // ctx.fillRect(this.x + 50, this.y, this.size, this.size)
    }
}

export class flyingEnemy{
    constructor(x, y, width, height, speed, image) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.image = image;

        this.targetX = x;
        this.targetY = y;
        this.moveAmountX = 0;
        this.moveAmountY = 0;
        this.jumpHeight = -10;

        this.timer = 0;
        this.cooldown = 60;
        this.jumpTimer = 0;
        this.randomTimer = 0;
        this.attackTimer = 0;

        this.velocityY = this.jumpHeight;
        this.distance = 0;
        this.isAtMinimum = true;
        this.gravity = 0.65;
        this.intervals = 20;
        this.isAttacking = false;
        this.isOnGround = false;
    }
    jump() {
        if (this.isAtMinimum) {
            this.velocityY += this.jumpHeight;
            this.isAtMinimum = false;
        }
    }
    update() {
        // console.log('Flying Enemy Update')
        this.timer++;
        this.jumpTimer++;
        this.randomTimer++;
        this.attackTimer++;
        if (this.cooldown > 0) {
            this.cooldown--;
        }
        if (this.timer >= this.intervals) {
            this.targetX = player.x + (player.size / 2) - (this.width / 2);
            this.targetY = player.y + (player.size / 2) - (this.height / 2);
            this.timer = 0;
        }
        if (this.jumpTimer >= 5) {
            this.jump();
            this.jumpTimer = 0;
        }
        if (!this.isAttacking) {
            this.isAtMinimum = false;
            const skyLevelEnemy = canvas.height - 200;
            this.velocityY += this.gravity;
            this.y += this.velocityY;

            if (this.y > skyLevelEnemy) {
                this.y = skyLevelEnemy;
                this.velocityY = 0;
                this.isAtMinimum = true;
            }
        }
        this.isOnGround = false;

        const groundLevelEnemy = canvas.height - (player.height + 7);
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        if (this.y > groundLevelEnemy) {
            this.y = groundLevelEnemy;
            this.velocityY = 0;
            this.isOnGround = true;
        }

        if (this.isOnGround) {
            console.log('Is on ground')
            this.jump()
        }

        let distanceX = this.targetX - this.x;
        let distanceY = this.targetY - this.y;

        let distance = Math.hypot(distanceX, distanceY);
        this.distance = distance;

        if (distance <= 25) {
            console.log(`Damaged Player`)
            dealDamageToPlayer(25);
            this.isAttacking = false;
        }

        if (distance !== 0) {
            let moveY = (distanceY / distance) * (this.speed * 1.5);
            let moveX = (distanceX / distance) * (this.speed * 1.5);
            
            this.moveAmountX = moveX;
            this.moveAmountY = moveY;

            this.x += moveX
            this.y += moveY  
        }

        const randomChosenAttackNumber = randomNumber(150, 500)
        if (this.attackTimer >= randomChosenAttackNumber) {
            this.isAttacking = true;
            console.log(`Distance: ${ this.distance }`)
            // console.log(`: ${ this.distance }`)

            this.attackTimer = 0;
        }
    }
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        // ctx.font = '16px sans-serif';
        // ctx.fillStyle = 'black';
        // ctx.fillText(`Distance: ${ this.distance }`, (this.x + this.width / 2) - 40, this.y - 10);
    }
}

export class Obstacle{
    constructor (x, y, width, height, speed, image, color = "#b51212") {
        this.x = x;
        this.y = y;
        this.width = width,
        this.height = height,
        // this.size = ;
        this.speed = speed;
        this.color = color;
        this.image = image;
        this.health = 2;
    }
    draw(ctx) {
        // ctx.fillStyle = this.color;
        // ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        if (this.health !== 2) {
            ctx.drawImage(damagedImg, this.x, this.y, this.width, this.height)
        }
    }
    collidesWith(player) {
        return(
            player.x + player.size > this.x &&
            player.x < this.x + this.width &&
            player.y + player.size > this.y &&
            player.y < this.y + this.height
        );
    }
    collidesWithOther(other) {
        return(
            other.x + other.width > this.x &&
            other.x < this.x + this.width &&
            other.y + other.height > this.y &&
            other.y < this.y + this.height
        );
    }
    containsPoint(px, py) {
        // if (!this.visible) return false;
        return (
            px >= this.x &&
            px <= this.x + this.width &&
            py >= this.y &&
            py <= this.y + this.height
        );
    }
}

export class GhostObstacle{
    constructor (x, y, width, height, speed, image, color = "#b51212") {
        this.x = x;
        this.y = y;
        this.width = width,
        this.height = height,
        // this.size = ;
        this.speed = speed;
        this.color = color;
        this.image = image;
        this.health = 2;
    }
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        if (this.health !== 2) {
            ctx.drawImage(damagedImg, this.x, this.y, this.width, this.height)
        }
    }
    collidesWith(player) {
        return(
            player.x + player.size > this.x &&
            player.x < this.x + this.width &&
            player.y + player.size > this.y &&
            player.y < this.y + this.height
        );
    }
    collidesWithOther(other) {
        return(
            other.x + other.width > this.x &&
            other.x < this.x + this.width &&
            other.y + other.height > this.y &&
            other.y < this.y + this.height
        );
    }
    containsPoint(px, py) {
        return (
            px >= this.x &&
            px <= this.x + this.width &&
            py >= this.y &&
            py <= this.y + this.height
        );
    }
}

export class inventorySlot {
    constructor(x, y, width, height, item, color = "#504d4d") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.item = item;
        this.color = color;
        this.visible = false;
    };
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
            if (this.item && this.item.complete && this.item.naturalWidth !== 0) {
                ctx.drawImage(this.item, itemX, itemY, itemWidth, itemHeight);
            }
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
