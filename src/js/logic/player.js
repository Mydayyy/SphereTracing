import Circle from "~/logic/geometry/circle";

class Player extends Circle {
    constructor(scene, x, y, r) {
        super(scene, x, y, r);
        this.speed = 60;
        this.right = this.left = this.right = this.up = false;
        this.mouseX = 0;
        this.mouseY = 0;
    }

    render(context) {
        context.fillStyle = "#0000FF";
        super.render(context);
    }

    update(dt) {
        if (this.up) {
            this.y -= this.speed * dt;
        }
        if (this.down) {
            this.y += this.speed * dt;
        }
        if (this.left) {
            this.x -= this.speed * dt;
        }
        if (this.right) {
            this.x += this.speed * dt;
        }
    }

    mouseMove(x, y) {
        this.mouseX = x;
        this.mouseY = y;
    }

    keydown(ev) {
        if (ev.key === "d") {
            this.right = true;
        }
        if (ev.key === "a") {
            this.left = true;
        }
        if (ev.key === "w") {
            this.up = true;
        }
        if (ev.key === "s") {
            this.down = true;
        }
    }

    keyup(ev) {
        if (ev.key === "d") {
            this.right = false;
        }
        if (ev.key === "a") {
            this.left = false;
        }
        if (ev.key === "w") {
            this.up = false;
        }
        if (ev.key === "s") {
            this.down = false;
        }
    }
}

export default Player;