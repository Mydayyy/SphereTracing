import React from "react";
import ReactDOM from "react-dom";
import {hot} from "react-hot-loader";

import {Route, Switch, Redirect} from "react-router-dom";

import Canvas from "~/components/Canvas/Canvas.jsx";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div id="app">
                <Canvas/>
            </div>
        );
    }
}

export default App;
