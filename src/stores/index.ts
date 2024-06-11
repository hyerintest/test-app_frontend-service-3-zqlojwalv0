import { combineReducers } from "redux";
import accountReducer from "./account/reducer";
import progressReducer from "./progress/reducer";

const rootReducer = combineReducers({ accountReducer, progressReducer });

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
