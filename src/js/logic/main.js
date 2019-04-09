import Vector2d from "~/logic/vector2d.js";

import Box from "~/logic/geometry/box";
import Circle from "~/logic/geometry/circle";
import Player from "~/logic/player";

import {random} from "~/logic/util";

class Scene {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.objects = [];
        this.player = null;
        this.mousex = 0;
        this.mousey = 0;
    }

    getClosestObject(x, y, returnNegative = false, ignoreAdditional = null) {
        let closestObject = null;
        let closestDistance = null;

        for (let object of this.objects) {
            if (object === this.player) {
                continue;
            }
            if (ignoreAdditional !== null && ignoreAdditional === object) {
                continue;
            }
            let distance = object.distanceTo(x, y);
            if ((distance < closestDistance || closestDistance === null) && (distance > 0 || returnNegative)) {
                closestDistance = distance;
                closestObject = object;
            }
        }
        // closestDistance = Math.floor(closestDistance);
        return { closestObject, closestDistance }
    }

    shootRay(x, y, dir, ignoreAdditional = null) {
        let MAX_TRACING_STEPS = 1500;

        for (let i = 0; i < MAX_TRACING_STEPS; i++) {
            let { closestObject, closestDistance } = this.getClosestObject(x, y, true, ignoreAdditional);

            if (closestDistance <= 0.1) {
                if (i == 0) {
                    return null;
                }
                let n = closestObject.getNormal(x, y);

                this.context.strokeStyle = "#FF00FF";
                this.context.beginPath();
                this.context.moveTo(closestObject.x, closestObject.y);
                this.context.lineTo(closestObject.x + 50 * n.x, closestObject.y + 50 * n.y);
                this.context.stroke();



                let r = Vector2d.subtract(dir, Vector2d.multiply(n, Vector2d.dot(dir, n) * 2));


                // this.context.beginPath();
                // this.context.moveTo(x, y);
                // this.context.lineTo(x + 50 * r.x, y + 50 * r.y);
                // this.context.stroke();
                return { x, y, r, bouncedFrom: closestObject };
            }

            if (x > this.canvas.width || x < 0 || y < 0 || y > this.canvas.height) {
                return null;
            }

            this.context.strokeStyle = "#00ff33";
            this.context.beginPath();
            this.context.arc(x, y, closestDistance, 0, 2 * Math.PI);
            this.context.stroke();

            this.context.strokeStyle = "#ff0000";
            this.context.beginPath();
            this.context.moveTo(x, y);
            this.context.lineTo(x + dir.x * closestDistance, y + dir.y * closestDistance);
            this.context.stroke();

            x = x + dir.x * (closestDistance);
            y = y + dir.y * (closestDistance);
        }

        console.log("MAX TRACING REACHED");
        return null;
    }

    updatePlayerRay() {
        let x = this.player.x;
        let y = this.player.y;

        let dx = this.mousex;
        let dy = this.mousey;

        let v = new Vector2d(dx - x, dy - y);
        v = v.normalize();

        let r = this.shootRay(x, y, v);
        let idx = 0;
        while (r !== null && idx < 50) {
            r = this.shootRay(r.x, r.y, r.r, r.bouncedFrom);
            idx++;
        }
    }

    update(dt) {
        for (let object of this.objects) {
            object.update(dt);
        }
    }

    render(context) {
        for (let object of this.objects) {
            context.save();
            object.render(context);
            context.restore();
        }
        context.save();
        this.updatePlayerRay();
        context.restore();
    }

    mouseMove(x, y) {
        this.mousex = x;
        this.mousey = y;
    }

    mouseDown(x, y) {
    }

    keydown(ev) {
        for (let object of this.objects) {
            object.keydown(ev);
        }
    }

    keyup(ev) {
        for (let object of this.objects) {
            object.keyup(ev);
        }
    }

    addItem(item) {
        this.objects.push(item);
        if (item instanceof Player) {
            this.player = item;
        }
    }

    removeItem(item) {
        throw "NOT IMPLEMENTED";
    }
}


class Main {
    constructor(canvas) {
        this.render = this.render.bind(this);

        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');

        this.scene = new Scene(this.canvas, this.context);

        for (let i = 0; i < 30; i++) {
            let x = random(0, this.canvas.width);
            let y = random(0, this.canvas.height);
            if (Math.random() > 0.5) {
                let r = random(5, 40);
                this.scene.addItem(new Circle(this.scene, x, y, r))
            } else {
                let w = random(10, 120);
                let h = random(10, 120);
                this.scene.addItem(new Box(this.scene, x, y, w, h))
            }
        }

        this.scene.addItem(new Player(this.scene, 30, 30, 5));

        this.setupListeners();

        this.render();
    }

    getPositionFromEvent(e) {
        let realCanvasWidth = this.canvas.scrollWidth;
        let realCanvasHeight = this.canvas.scrollHeight;

        let widthRatio = this.canvas.width / realCanvasWidth;
        let heightRatio = this.canvas.height / realCanvasHeight;

        if (e.touches) {
            let bounds = this.canvas.current.getBoundingClientRect();
            let x = e.touches[0].clientX - bounds.left;
            let y = e.touches[0].clientY - bounds.top;
            return { x: x * widthRatio, y: y * heightRatio };
        }
        let x = e.offsetX;
        let y = e.offsetY;
        return { x: x * widthRatio, y: y * heightRatio };
    }


    onMouseMove(ev) {
        let { x, y } = this.getPositionFromEvent(ev);
        this.scene.mouseMove(x, y);
    }

    onMouseDown(ev) {
        let { x, y } = this.getPositionFromEvent(ev);
        this.scene.mouseDown(x, y);
    }

    keydown(ev) {
        this.scene.keydown(ev);
    }

    keyup(ev) {
        this.scene.keyup(ev);
    }

    setupListeners() {
        this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this), { passive: false });
        this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this), { passive: false });
        document.addEventListener("keydown", this.keydown.bind(this), { passive: true });
        document.addEventListener("keyup", this.keyup.bind(this), { passive: true });

    }

    render() {
        window.requestAnimationFrame(this.render);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.scene.update(0.0166666);
        this.scene.render(this.context);
    }
}

export default Main;