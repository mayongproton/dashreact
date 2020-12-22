import { FETCH_USER, FETCH_USER_ERROR, SIGN_OUT } from "../actionTypes";
const initialState = {
    user: JSON.parse(localStorage.getItem("user")),
    isLoginError: false,
};
export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USER:
            return {
                ...state,
                user: action.payload,
                isLoginError: action.payload.isLoginError,
            };
        case FETCH_USER_ERROR:
            return {
                ...state,
                isLoginError: action.payload,
            };

        case SIGN_OUT:
            return {
                ...state,
                user: action.payload,
            };

        default:
            return state;
    }
};
