import SceneItem from "~/logic/geometry/sceneitem";
import Vector2d from "~/logic/vector2d.js";

class Circle extends SceneItem {
    constructor(scene, x, y, r) {
        super(scene);
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

export default Circle;