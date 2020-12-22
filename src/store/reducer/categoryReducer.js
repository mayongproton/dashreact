import {
    ADD_CATEGORY,
    DELETE_CATEGORY,
    FETCH_CATEGORY,
} from "./../../store/actionTypes";
const initialState = {
    allCategory: [],
    isSuccessAddCategory: false,
    isSuccessDeleteCategory: false,
};
export const categoryReducer = (state = {}, action) => {
    switch (action.type) {
        case FETCH_CATEGORY:
            return {
                ...state,
                allCategory: action.payload,
            };
        case ADD_CATEGORY:
            return {
                ...state,
                isSuccessAddCategory: action.payload,
            };
        case DELETE_CATEGORY:
            return {
                ...state,
                isSuccessDeleteCategory: action.payload,
            };
        default:
            return state;
    }
};
