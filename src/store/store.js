import { categoryReducer } from "./reducer/categoryReducer";
import { mapReducer } from "./reducer/mapReducer";
import { modReducer } from "./reducer/modReducer";
import { textureReducer } from "./reducer/textureReducer";
import { skinReducer } from "./reducer/skinReducer";
import { seedReducer } from "./reducer/seedReducer";
import { userReducer } from "./reducer/userReducer";

const {
    compose,
    createStore,
    combineReducers,
    applyMiddleware,
} = require("redux");
const { default: thunk } = require("redux-thunk");

const initialState = {};
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    combineReducers({
        allCategory: categoryReducer,
        allMods: modReducer,
        allMaps: mapReducer,
        allTextures: textureReducer,
        allSkins: skinReducer,
        allSeeds: seedReducer,
        user: userReducer,
    }),
    initialState,
    composeEnhancer(applyMiddleware(thunk))
);
export default store;
