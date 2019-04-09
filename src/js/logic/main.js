import Vector2d from "~/logic/vector2d.js";
import Vector from "./vector2d";

function random(from, to) {
    to++;
    return Math.floor(from + (Math.random() * (to - from)));
}
window.random = random;
window.Vector2d = Vector2d;

class SceneItem {
    constructor() {
        this.x = 0;
        this.y = 0;
    }

    update(dt) {
    }

    render(context) {
        console.log("Empty render");
    }

    distanceTo(x, y) {
        throw "DISTANCE FUNCTION NOT IMPLEMENTED";
    }

    getNormal(x, y) {
        throw "GET NORMAL FUNCTION NOT IMPLEMENTED";
    }

    mouseMove(x, y) {
    }

    mouseDown(x, y) {
    }

    keydown(ev) {

    }

    keyup(ev) {

    }
}

class Circle extends SceneItem {
    constructor(x, y, r) {
        super();
        this.x = x;
        this.y = y;
        this.r = r;
    }
    render(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        context.fill();
    }

    distanceTo(x, y) {
        return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2)) - this.r;
    }

    getNormal(x, y) {
        let center = new Vector2d(this.x, this.y);
        let target = new Vector2d(x, y);
        let n = Vector2d.subtract(target, center);
        return n.normalize();
    }
}

class Box extends SceneItem {
    constructor(x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    render(context) {
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.fill();
    }

    distanceTo(x, y) {
        x += 0 - (this.x + this.width / 2);
        y += 0 - (this.y + this.height / 2);
        let b = new Vector2d(this.width / 2, this.height / 2);
        let p = new Vector2d(x, y);
        let d = Vector2d.abs(p).subtract(b);
        return Vector2d.max(d, new Vector2d()).length() + Math.min(Math.max(d.x, d.y), 0.0);
    }

    getNormal(x, y) {
        // let p = new Vector2d(x, y);
        // let left = new Vector2d(this.x, this.y + this.height / 2);
        // let top = new Vector2d(this.x + this.width / 2, this.y);
        // let right = new Vector2d(this.x + this.width, this.y + this.height / 2);
        // let bottom = new Vector2d(this.x + this.width / 2, this.y + this.height);

        // let dleft = Math.abs(Vector2d.distance(left, p));
        // let dtop = Math.abs(Vector2d.distance(top, p));
        // let dright = Math.abs(Vector2d.distance(right, p));
        // let dbottom = Math.abs(Vector2d.distance(bottom, p));

        // let sleft = {n: new Vector2d(-1, 0), val: dleft};
        // let stop = {n: new Vector2d(0, -1), val: dtop};
        // let sright = {n: new Vector2d(1, 0), val: dright};
        // let sbottom = {n: new Vector2d(0, 1), val: dbottom};

        // let arr =  [sleft, stop, sright, sbottom];

        // let n = arr.reduce(function(obj1, obj2){ 
        //     return (obj1.val < obj2.val) ? obj1: obj2;        
        //   }).n;

        //   console.log(n);

        if (y <= this.y) {
            return new Vector2d(0, -1);
        }

        if (y >= this.y + this.height) {
            return new Vector2d(0, 1);
        }

        if (x < this.x) {
            return new Vector2d(-1, 0);
        }

        if (x > this.x) {
            return new Vector2d(1, 0);
        }

        throw "OMG";

        // let center = new Vector2d(this.x, this.y);
        // let target = new Vector2d(x, y);
        // let n = Vector2d.subtract(target, center);
        // return n.normalize();
    }
}

class Player extends Circle {
    constructor(x, y, r) {
        super(x, y, r);
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
                this.scene.addItem(new Circle(x, y, r))
            } else {
                let w = random(10, 120);
                let h = random(10, 120);
                this.scene.addItem(new Box(x, y, w, h))
            }
        }

        this.scene.addItem(new Player(30, 30, 5));

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