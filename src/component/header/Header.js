import React, { Component } from "react";
import "./Header.css";
import Avater from "@material-ui/core/Avatar";
import { connect } from "react-redux";
import { signOut } from "./../../store/actions/userAction";

class Header extends Component {
    signOut = (e) => {
        e.preventDefault();
        this.props.signOut();
    };
    render() {
        return (
            <div className="header">
                <div className="show__loggedinuser">
                    <label>{this.props.user && this.props.user.email}</label>
                    <Avater />
                    <button className="btn secondary" onClick={this.signOut}>
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }
}
export default connect(
    (state) => ({
        user: state.user.user,
    }),
    { signOut }
)(Header);
