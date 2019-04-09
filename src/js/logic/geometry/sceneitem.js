class SceneItem {
    constructor(scene) {
        this.x = 0;
        this.y = 0;

        if(!scene) {
            throw "NO SCENE PASSED TO SCENEITEM";
        }

        this.scene = scene;
    }

    init(scene) {
        this.scene = scene;
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

export default SceneItem;