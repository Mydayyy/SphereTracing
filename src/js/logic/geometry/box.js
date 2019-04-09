import SceneItem from "~/logic/geometry/sceneitem";
import Vector2d from "~/logic/vector2d.js";

class Box extends SceneItem {
    constructor(scene, x, y, width, height) {
        super(scene);
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
    }
}

export default Box;