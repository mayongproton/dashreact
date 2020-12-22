import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/store";
const firebase = require("firebase");
require("firebase/firestore");

firebase.initializeApp({
    apiKey: "AIzaSyD2YY85HwIn81Eb9POAERcKLEENwbP8IfM",
    authDomain: "aiomcpe.firebaseapp.com",
    projectId: "aiomcpe",
    storageBucket: "aiomcpe.appspot.com",
    messagingSenderId: "1045307076984",
    appId: "1:1045307076984:web:3c36fa0cfca1f7f645d88d",
    measurementId: "G-RZMJ4WYB0G"

});
ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);
