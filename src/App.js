import React, { Component } from "react";
import "./App.css";
import Header from "./component/header/Header";
import Sidebar from "./component/sidebar/Sidebar";
import NewMod from "./component/mods/NewMod";
import Category from "./component/category/Category";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AllMod from "./component/mods/AllMod";
import EditMod from "./component/mods/EditMod";
import EditMap from "./component/mods/EditMap";
import EditTexture from "./component/mods/EditTexture";
import EditSkin from "./component/mods/EditSkin";
import EditSeed from "./component/mods/EditSeed";
import Login from "./component/login/Login";
import { connect } from "react-redux";

class App extends Component {
    componentDidMount() {}
    render() {
        return !this.props.user ? (
            <Login />
        ) : (
            <div className="mod__app">
                <div className="header__area">
                    <div className="container">
                        <Header
                        // email={user.email}
                        />
                    </div>
                </div>
                <Router>
                    <Switch>
                        <div className="content__area">
                            <div className="sidebar__area">
                                <Sidebar />
                            </div>

                            <div className="main__wrapper">
                                <Route exact path="/">
                                    <AllMod />
                                </Route>
                                <Route path="/category">
                                    <Category />
                                </Route>
                                <Route path="/addmod">
                                    <NewMod />
                                </Route>
                                <Route path="/editmod/:id">
                                    <EditMod />
                                </Route>
                                <Route path="/editmap/:id">
                                    <EditMap />
                                </Route>
                                <Route path="/edittexture/:id">
                                    <EditTexture />
                                </Route>
                                <Route path="/editskin/:id">
                                    <EditSkin />
                                </Route>
                                <Route path="/editseed/:id">
                                    <EditSeed />
                                </Route>
                                {/* <Route path="">
                            <AllMod />
                        </Route> */}
                            </div>
                        </div>
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default connect(
    (state) => ({
        user: state.user.user,
    }),
    {}
)(App);
