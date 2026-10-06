const playerImg = new Image();
const test = new Image();
const blockImg = new Image();
const bgImage = new Image();
const hudImg = new Image();
const shovelImg = new Image();
const placeholder = new Image();
const arrowImg = new Image();

const bgParaFactor = 0.5;

playerImg.src = 'declan.png'
test.src = 'judeAndMagdalene.jpg'
blockImg.src = 'blocks.svg'
bgImage.src = 'backgroundLoop.svg'
hudImg.src = 'hud-outline.svg'
shovelImg.src = 'shovel.png'
placeholder.src = 'placeholder.png'
arrowImg.src = 'arrow.png'

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
        this.armorMultiplier = 1;
        this.damageMultiplier = 1;
        this.rotationAngle = 0;
    };
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
    }
    draw(ctx) {
        // ctx.fillStyle = this.color;
        // ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
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
