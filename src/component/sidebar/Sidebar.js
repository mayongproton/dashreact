import React, { Component } from "react";
import "./Sidebar.css";
import CategoryIcon from "@material-ui/icons/Category";
import AddIcon from "@material-ui/icons/Add";
import ListIcon from "@material-ui/icons/List";
import { withRouter } from "react-router";

class Sidebar extends Component {
    nextPath(path) {
        this.props.history.push(path);
    }
    render() {
        return (
            <div className="sidebar">
                <div className="sidebar__menu">
                    <ul className="menu">
                        <li
                            className="menu__item"
                            onClick={() => this.nextPath("")}
                        >
                            <ListIcon />
                            <span>Mod List</span>
                        </li>
                        <li
                            className="menu__item"
                            onClick={() => this.nextPath("/category")}
                        >
                            <CategoryIcon />
                            <span>Add Category</span>
                        </li>
                        <li
                            className="menu__item"
                            onClick={() => this.nextPath("/addmod")}
                        >
                            <AddIcon />
                            <span>Add Mod</span>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
export default withRouter(Sidebar);
