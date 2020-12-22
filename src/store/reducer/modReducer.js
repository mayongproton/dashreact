import {
    ADD_MOD,
    DELETE_MOD,
    FETCH_MOD,
    FETCH_MOD_BY_ID,
    FETCH_ALL_FILE,
} from "../actionTypes";
const initialState = {
    allMods: [],
    selectedMod: null,
    allFileImages: [],
    isSuccessAddMod: false,
    isSuccessDeleteMod: false,
};
export const modReducer = (state = {}, action) => {
    switch (action.type) {
        case FETCH_MOD:
            return {
                ...state,
                allMods: action.payload,
            };
        case ADD_MOD:
            return {
                ...state,
                isSuccessAddMod: action.payload,
            };
        case DELETE_MOD:
            return {
                ...state,
                isSuccessDeleteMod: action.payload,
            };
        case FETCH_MOD_BY_ID:
            return {
                ...state,
                selectedMod: action.payload,
            };
        case FETCH_ALL_FILE:
            return {
                ...state,
                allFileImages: action.payload,
            };
        default:
            return state;
    }
};
