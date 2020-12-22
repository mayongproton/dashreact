import React, { Component } from "react";
import "./Loader.css";
import spinner from "./../../../src/s1.gif";

class Loader extends Component {
    render() {
        return (
            <div className="loader">
                <img src={spinner} alt="loader" />
            </div>
        );
    }
}
export default Loader;
