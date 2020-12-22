import { actionTypes } from "react-redux-firebase";
import { FETCH_CATEGORY, ADD_CATEGORY, DELETE_CATEGORY } from "../actionTypes";

const firebase = require("firebase");
export const fetchCategory = () => async (dispatch) => {
    await firebase
        .firestore()
        .collection("mod_category")
        .onSnapshot((data) => {
            const allCategory = data.docs.map((_doc) => {
                const data = _doc.data();
                data["id"] = _doc.id;
                return data;
            });
            dispatch({
                type: FETCH_CATEGORY,
                payload: allCategory,
            });
        });
};

export const addCategory = (obj) => (dispatch) => {
    const db = firebase.firestore();
    db.collection("mod_category")
        .add({
            categoryname: obj.categoryname,
        })
        .then((res) => {
            dispatch({
                type: ADD_CATEGORY,
                payload: true,
            });
        })
        .catch((err) => {
            dispatch({
                type: ADD_CATEGORY,
                payload: false,
            });
        });
};

export const deleteCategory = (id) => (dispatch) => {
    const db = firebase.firestore();
    db.collection("mod_category")
        .doc(id)
        .delete()
        .then((res) => {
            dispatch({
                type: DELETE_CATEGORY,
                payload: true,
            });
        })
        .catch((err) => {
            dispatch({
                type: DELETE_CATEGORY,
                payload: false,
            });
        });
};
