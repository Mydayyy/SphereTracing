import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Main from "~/logic/main.js";

// import "./Canvas.scss";

class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.main = null;
    }

    componentDidMount() {
        let canvas = document.querySelector("canvas");
        this.main = new Main(canvas);
    }

    render() {
        return (
            <div>
               <canvas width={900} height={900}></canvas>
            </div>
        );
    }
}

Canvas.defaultProps = {
};

Canvas.propTypes = {
};

export default Canvas;