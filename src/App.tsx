import "simplebar-react/dist/simplebar.min.css";
import "@assets/css/tailwind.css";
import "@assets/css/icons.css";
import "@assets/css/fonts/fonts.css";

import React, {useEffect} from "react";
import {getPreviousStorageData} from "./slices/layout/utils"; // Adjust the path if needed
import store, {AppDispatch} from "./slices/store.ts";

import {
    changeDarkModeClass,
    changeDataColor,
    changeLayout,
    changeLayoutContentWidth,
    changeLayoutMode,
    changeModernNavigation,
} from "./slices/thunk";
import { initializeAuth } from "@src/slices/auth/thunk.ts";

import Routing from "./routes";
import {initialState} from "./slices/layout/reducer";

function App() {
    useEffect(() => {
        const htmlElement = document.documentElement;
        htmlElement.classList.add("scroll-smooth", "group");
        return () => {
            htmlElement.classList.remove("scroll-smooth", "group");
        };
    }, []);

    useEffect(() => {
        const dispatch = store.dispatch as AppDispatch;
        dispatch(initializeAuth());
    }, []);

    useEffect(() => {
        const dispatch = store.dispatch as AppDispatch; // Use AppDispatch

        dispatch(
            changeLayoutMode(
                getPreviousStorageData("data-layout-mode") ?? initialState.layoutMode,
            ),
        );
        dispatch(
            changeLayoutContentWidth(
                getPreviousStorageData("data-layout-content-width") ??
                initialState.layoutWidth,
            ),
        );
        dispatch(
            changeLayout(
                getPreviousStorageData("data-layout-type") ?? initialState.layoutType,
            ),
        );
        dispatch(
            changeDataColor(
                getPreviousStorageData("data-theme-color") ??
                initialState.layoutDataColor,
            ),
        );
        dispatch(
            changeDarkModeClass(
                getPreviousStorageData("data-theme-dark-class") ??
                initialState.layoutDarkModeClass,
            ),
        );
        dispatch(
            changeModernNavigation(
                getPreviousStorageData("data-theme-nav-type") ??
                initialState.layoutNavigation,
            ),
        );
    }, []);

    return (
        <React.Fragment>
            <Routing/>
        </React.Fragment>
    );
}

export default App;
