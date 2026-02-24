// store.ts (or store.js if you're not using TypeScript)

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import layoutReducer from "./layout/reducer";
import authReducer from "./auth/reducer";
import profileReducer from "./profile/reducer";


// Combine your reducers
const rootReducer = combineReducers({
  Layout: layoutReducer,
  auth: authReducer,
  profile: profileReducer,
});

// Create a reducer to handle hydration (if needed)
const store = (
  state: ReturnType<typeof rootReducer> | undefined,
  action: any,
) => {
  // If you're using hydration (like with SSR), handle it here
  // Remove the HYDRATE part if not using SSR
  if (action.type === "HYDRATE") {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
    return nextState;
  }
  return rootReducer(state, action);
};

// Configure the Redux store
export const makeStore = () =>
  configureStore({
    reducer: store,
    // Optional: Add middleware here if needed
  });

const redux_store = makeStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof redux_store.getState>;
export type AppDispatch = typeof redux_store.dispatch;

export default redux_store;
