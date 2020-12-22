import {
    ADD_SEED,
    DELETE_SEED,
    FETCH_SEED,
    FETCH_SEED_BY_ID,
    FETCH_ALL_FILE,
} from "../actionTypes";
const initialState = {
    allSeeds: [],
    selectedSeed: null,
    allFileImages: [],
    isSuccessAddSeed: false,
    isSuccessDeleteSeed: false,
};
export const seedReducer = (state = {}, action) => {
    switch (action.type) {
        case FETCH_SEED:
            return {
                ...state,
                allSeeds: action.payload,
            };
        case ADD_SEED:
            return {
                ...state,
                isSuccessAddSeed: action.payload,
            };
        case DELETE_SEED:
            return {
                ...state,
                isSuccessDeleteSeed: action.payload,
            };
        case FETCH_SEED_BY_ID:
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
