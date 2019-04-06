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

    getClosestObject(x, y) {
        let closestObject = null;
        let closestDistance = null;

        for(let object of this.objects) {
            if(object === this.player) {
                continue;
            }
            let distance = object.distanceTo(x, y);
            if((distance < closestDistance || closestDistance === null) && distance > 0) {
                closestDistance = distance;
                closestObject = object;
            }
        }

        return {closestObject, closestDistance}
    }

    updatePlayerRay() {
        let MAX_TRACING_STEPS = 100;

        let startx = this.player.x;
        let starty = this.player.y;

        for(let i = 0; i < MAX_TRACING_STEPS; i++) {
            
        }
        this.context.beginPath();
        this.context.moveTo(this.player.x, this.player.y);
        this.context.lineTo(this.mousex, this.mousey);
        this.context.stroke();
    } 

    updatePlayerCircle() {
        let {closestObject, closestDistance} = this.getClosestObject(this.player.x, this.player.y);

        if(closestDistance === null) {
            return;
        }

        this.context.beginPath();
        this.context.arc(this.player.x, this.player.y, closestDistance, 0, 2 * Math.PI);
        this.context.strokeStyle = "#00FF00";
        this.context.stroke();

        console.log(closestDistance);
    }

    update(dt) {
        for (let object of this.objects) {
            object.update(dt);
        }
    }

    render(context) {
        context.save();
        this.updatePlayerCircle();
        context.restore();
        context.save();
        this.updatePlayerRay();
        context.restore();
        for (let object of this.objects) {
            context.save();
            object.render(context);
            context.restore();
        }
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
        this.scene.addItem(new Circle(400, 50, 15))
        this.scene.addItem(new Circle(400, 400, 60))
        this.scene.addItem(new Circle(300, 300, 30));
        this.scene.addItem(new Circle(50, 500, 60));
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