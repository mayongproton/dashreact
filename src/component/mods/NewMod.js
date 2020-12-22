import Axios from "axios";
import React, { Component } from "react";
import Mod from "./Mod";
import Map from "./Map";
import Skin from "./Skin";
import Seed from "./Seed";
import "./NewMod.css";
import Texture from "./Texture";

class NewMod extends Component {
    constructor() {
        super();
        this.state = {
            modTypeSelect: "1",
        };
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };
    submitHandle = (e) => {
        e.preventDefault();
        const obj = {
            category: this.state.category,
        };
        Axios.post("", obj).then((res) => console.log());
    };

    render() {
        return (
            <div className="new__mod">
                <div className="mod__selection">
                    <label>Select Data Type:</label>
                    <select name="modTypeSelect" onChange={this.handleChange}>
                        <option value="1">Mods</option>
                        <option value="2">Maps</option>
                        <option value="3">Textures</option>
                        <option value="4">Skins</option>
                        <option value="5">Seed</option>
                    </select>
                </div>

                <div className="mod__container">
                    {this.state.modTypeSelect === "1" ? (
                        <Mod />
                    ) : this.state.modTypeSelect === "2" ? (
                        <Map />
                    ) : this.state.modTypeSelect === "3" ? (
                        <Texture />
                    ) : this.state.modTypeSelect === "4" ? (
                        <Skin />
                    ) : (
                        <Seed />
                    )}
                </div>
            </div>
        );
    }
}
export default NewMod;
