import {
    ADD_TEXTURE,
    DELETE_TEXTURE,
    FETCH_TEXTURE,
    FETCH_TEXTURE_BY_ID,
    FETCH_ALL_FILE,
} from "../actionTypes";
const initialState = {
    allTextures: [],
    selectedTexture: null,
    allFileImages: [],
    isSuccessAddTexture: false,
    isSuccessDeleteTexture: false,
};
export const textureReducer = (state = {}, action) => {
    switch (action.type) {
        case FETCH_TEXTURE:
            return {
                ...state,
                allTextures: action.payload,
            };
        case ADD_TEXTURE:
            return {
                ...state,
                isSuccessAddTexture: action.payload,
            };
        case DELETE_TEXTURE:
            return {
                ...state,
                isSuccessDeleteTexture: action.payload,
            };
        case FETCH_TEXTURE_BY_ID:
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
