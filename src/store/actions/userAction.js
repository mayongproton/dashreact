import { FETCH_USER, FETCH_USER_ERROR, SIGN_OUT } from "../actionTypes";

const firebase = require("firebase");
export const fetchUser = (obj) => async (dispatch) => {
    await firebase
        .firestore()
        .collection("mod_login")
        .where("email", "==", obj.email)
        .where("password", "==", obj.password)
        .onSnapshot((data) => {
            const allUser = data.docs.map((_doc) => {
                const data = _doc.data();
                data["isLoginError"] = false;
                return data;
            });
            if (allUser && allUser.length > 0) {
                localStorage.setItem("user", JSON.stringify(allUser[0]));
                dispatch({
                    type: FETCH_USER,
                    payload: allUser[0],
                });
            } else {
                dispatch({
                    type: FETCH_USER_ERROR,
                    payload: true,
                });
            }
        });
};

export const signOut = () => (dispatch) => {
    localStorage.removeItem("user");
    dispatch({
        type: SIGN_OUT,
        payload: null,
    });
};
