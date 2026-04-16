import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    DARK_MODE_CLASS,
    DATA_COLORS,
    LAYOUT_CONTENT_WIDTH,
    LAYOUT_MODE_TYPES,
    LAYOUT_TYPES,
    MODERN_NAVIGATION,
} from "@src/components/constants/layout";

export interface LayoutItemsState {
    layoutType:
        | LAYOUT_TYPES.HORIZONTAL
        | LAYOUT_TYPES.VERTICAL
        | LAYOUT_TYPES.MODERN
        | LAYOUT_TYPES.BOXED
        | LAYOUT_TYPES.SEMIBOX;
    layoutWidth: LAYOUT_CONTENT_WIDTH.DEFAULT | LAYOUT_CONTENT_WIDTH.FLUID;
    layoutMode:
        | LAYOUT_MODE_TYPES.LIGHT
        | LAYOUT_MODE_TYPES.DARK
        | LAYOUT_MODE_TYPES.DEFAULT
        | LAYOUT_MODE_TYPES.BLACKWHITE;
    layoutDataColor:
        | DATA_COLORS.DEFAULT
        | DATA_COLORS.GREEN
        | DATA_COLORS.VIOLET
        | DATA_COLORS.ORANGE
        | DATA_COLORS.TEAL
        | DATA_COLORS.FUCHSIA
        | DATA_COLORS.LIME
        | DATA_COLORS.AMBER;
    layoutNavigation:
        | MODERN_NAVIGATION.DEFAULT
        | MODERN_NAVIGATION.FLOATING
        | MODERN_NAVIGATION.BOXED
        | MODERN_NAVIGATION.PATTERN;
    layoutDarkModeClass:
        | DARK_MODE_CLASS.DEFAULT
        | DARK_MODE_CLASS.ZINC
        | DARK_MODE_CLASS.STONE
        | DARK_MODE_CLASS.NEUTRAL
        | DARK_MODE_CLASS.GRAY;
    isSettingModalOpen: boolean;
}

export const initialState: LayoutItemsState = {
    layoutType: LAYOUT_TYPES.VERTICAL,
    layoutWidth: LAYOUT_CONTENT_WIDTH.DEFAULT,
    layoutMode: LAYOUT_MODE_TYPES.LIGHT,
    layoutDataColor: DATA_COLORS.DEFAULT,
    layoutNavigation: MODERN_NAVIGATION.DEFAULT,
    layoutDarkModeClass: DARK_MODE_CLASS.DEFAULT,
    isSettingModalOpen: false,
};

const LayoutSlice = createSlice({
    name: "layoutdata",
    initialState,
    reducers: {
        changeLayoutAction(state: any, action: PayloadAction<LAYOUT_TYPES>) {
            state.layoutType = action.payload;
        },
        changeLayoutWidthAction(
            state: any,
            action: PayloadAction<LAYOUT_CONTENT_WIDTH>,
        ) {
            state.layoutWidth = action.payload;
        },
        changeLayoutModeAction(
            state: any,
            action: PayloadAction<LAYOUT_MODE_TYPES>,
        ) {
            state.layoutMode = action.payload;
        },
        changeLayoutDataColorAction(
            state: any,
            action: PayloadAction<DATA_COLORS>,
        ) {
            state.layoutDataColor = action.payload;
        },
        changeLayoutModalNavigationAction(
            state: any,
            action: PayloadAction<MODERN_NAVIGATION>,
        ) {
            state.layoutNavigation = action.payload;
        },
        changeLayoutDarkModeClass(
            state: any,
            action: PayloadAction<DARK_MODE_CLASS>,
        ) {
            state.layoutDarkModeClass = action.payload;
        },
        changeSettingModalOpen(state: any, action: PayloadAction<boolean>) {
            state.isSettingModalOpen = action.payload;
        },
    },
});

export const {
    changeLayoutAction,
    changeLayoutWidthAction,
    changeLayoutModeAction,
    changeLayoutDataColorAction,
    changeLayoutModalNavigationAction,
    changeLayoutDarkModeClass,
    changeSettingModalOpen,
} = LayoutSlice.actions;

export default LayoutSlice.reducer;
