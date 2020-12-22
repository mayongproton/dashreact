import {
    ADD_MAP,
    DELETE_MAP,
    FETCH_MAP,
    FETCH_MAP_BY_ID,
    FETCH_ALL_FILE,
} from "../actionTypes";
const initialState = {
    allMaps: [],
    selectedMap: null,
    allFileImages: [],
    isSuccessAddMap: false,
    isSuccessDeleteMap: false,
};
export const mapReducer = (state = {}, action) => {
    switch (action.type) {
        case FETCH_MAP:
            return {
                ...state,
                allMaps: action.payload,
            };
        case ADD_MAP:
            return {
                ...state,
                isSuccessAddMap: action.payload,
            };
        case DELETE_MAP:
            return {
                ...state,
                isSuccessDeleteMap: action.payload,
            };
        case FETCH_MAP_BY_ID:
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
