import React, { Component, useState } from "react";
import "./Login.css";
import UserIcon from "@material-ui/icons/Person";
import PasswordIcon from "@material-ui/icons/Lock";
import { connect } from "react-redux";

import { fetchUser } from "./../../store/actions/userAction";

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
        };
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.fetchUser(this.state);
    };

    render() {
        return (
            <div className="login">
                <div className="login__form">
                    <h3>Login</h3>
                    {this.props.isLoginError ? (
                        <label className="login__error">
                            Invalid Email or Password
                        </label>
                    ) : null}
                    <div className="input__container">
                        <label>Email</label>
                        <div className="input__icon">
                            <UserIcon />
                            <input
                                name="email"
                                onChange={this.handleChange}
                                value={this.state.email}
                                type="email"
                                placeholder="Enter Email"
                            />
                        </div>
                    </div>
                    <div className="input__container">
                        <label>Password</label>
                        <div className="input__icon">
                            <PasswordIcon />
                            <input
                                name="password"
                                onChange={this.handleChange}
                                value={this.state.password}
                                type="password"
                                placeholder="Enter Password"
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        className="login__button"
                        onClick={this.handleSubmit}
                    >
                        LOGIN
                    </button>
                </div>
            </div>
        );
    }
}

export default connect(
    (state) => ({
        user: state.user.user,
        isLoginError: state.user.isLoginError,
    }),
    { fetchUser }
)(Login);
