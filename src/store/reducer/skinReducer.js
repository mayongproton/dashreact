import {
    ADD_SKIN,
    DELETE_SKIN,
    FETCH_SKIN,
    FETCH_SKIN_BY_ID,
    FETCH_ALL_FILE,
} from "../actionTypes";
const initialState = {
    allSkins: [],
    selectedSkin: null,
    allFileImages: [],
    isSuccessAddSkin: false,
    isSuccessDeleteSkin: false,
};
export const skinReducer = (state = {}, action) => {
    switch (action.type) {
        case FETCH_SKIN:
            return {
                ...state,
                allSkins: action.payload,
            };
        case ADD_SKIN:
            return {
                ...state,
                isSuccessAddSkin: action.payload,
            };
        case DELETE_SKIN:
            return {
                ...state,
                isSuccessDeleteSkin: action.payload,
            };
        case FETCH_SKIN_BY_ID:
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
