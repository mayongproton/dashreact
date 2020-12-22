import Axios from "axios";
import React, { Component } from "react";
import "./AllMod.css";
import ModList from "./ModList";
import MapList from "./MapList";
import TextureList from "./TextureList";
import SkinList from "./SkinList";
import SeedList from "./SeedList";

class AllMod extends Component {
    constructor() {
        super();
        this.state = {
            allMods: [],
            modTypeSelect: "1",
        };
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };
    render() {
        return (
            <div className="all__mod">
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
                        <ModList />
                    ) : this.state.modTypeSelect === "2" ? (
                        <MapList />
                    ) : this.state.modTypeSelect === "3" ? (
                        <TextureList />
                    ) : this.state.modTypeSelect === "4" ? (
                        <SkinList />
                    ) : (
                        <SeedList />
                    )}
                </div>
            </div>
        );
    }
}
export default AllMod;
