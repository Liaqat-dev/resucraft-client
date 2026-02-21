import React from "react";
import {Modal} from "../custom/modal/modal";
import {X} from "lucide-react";
import {useDispatch, useSelector} from "react-redux";

import {
    DARK_MODE_CLASS,
    DATA_COLORS,
    LAYOUT_MODE_TYPES,
    LAYOUT_TYPES,
    SIDEBAR_COLOR,
} from "@src/components/constants/layout";
import {changeDarkModeClass, changeDataColor, changeLayoutMode, changeSidebarColor,} from "@src/slices/thunk";

const SettingsModal = ({open, handleCloseModal}: any) => {
    const dispatch = useDispatch<any>();
    const {
        layoutMode,
        layoutType,
        layoutDarkModeClass,
        layoutSidebarColor,
        layoutDataColor,
    } = useSelector((state: any) => state.Layout);

    const handleThemeLayout = (value: LAYOUT_MODE_TYPES) => {
        dispatch(changeLayoutMode(value));
    };


    const handleThemeSideColorChange = (value: SIDEBAR_COLOR) => {
        dispatch(changeSidebarColor(value));
    };

    const handleThemeColor = (value: DATA_COLORS) => {
        dispatch(changeDataColor(value));
    };


    const handleDarkModeClass = (value: DARK_MODE_CLASS) => {
        dispatch(changeDarkModeClass(value));
    };


    return (
        <React.Fragment>
            <Modal
                isOpen={open}
                onClose={handleCloseModal}
                position="modal-center"
                title="Customize Theme"
                id="toolsAppsModal"
                size="modal-lg"
                contentClass="model-content"
                footerClass="flex items-center justify-end gap-2"
                content={
                    <>
                        <div>
                            {/* </template> */}
                            <h6 className="my-4">Layout Mode:</h6>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-space">
                                <div className="flex-col gap-0 input-radio-group">
                                    <input
                                        id="lightMode"
                                        name="layoutMode"
                                        type="radio"
                                        className="hidden input-radio peer"
                                        value={layoutMode}
                                        onChange={() => handleThemeLayout(LAYOUT_MODE_TYPES.LIGHT)}
                                        checked={layoutMode === LAYOUT_MODE_TYPES.LIGHT}
                                    />
                                    <label
                                        htmlFor="lightMode"
                                        className="block w-full mb-3 overflow-hidden cursor-pointer card h-28 peer-checked:border-primary-500"
                                    >
                    <span className="block h-full">
                      <span className="flex gap-1 px-4 py-1.5 bg-gray-200/50 dark:bg-dark-800/50">
                        <span className="inline-block bg-red-500 rounded-full size-1.5"></span>
                        <span className="inline-block bg-green-500 rounded-full size-1.5"></span>
                        <span className="inline-block rounded-full bg-yellow-500 size-1.5"></span>
                      </span>
                      <span className="grid h-[calc(100%_-_8px)] grid-cols-12">
                        <span className="h-[calc(100%_-_8px)] col-span-2 bg-gray-50 dark:bg-dark-850"></span>
                        <span className="h-[calc(100%_-_8px)] col-span-10 p-1.5 inline-block">
                          <span className="block w-1/3 h-1.5 bg-gray-100 rounded-md dark:bg-dark-850"></span>
                          <span className="block w-1/2 h-1.5 mt-1 bg-gray-100 rounded-md dark:bg-dark-850"></span>
                          <span className="block w-full h-1.5 mt-1 bg-gray-100 rounded-md dark:bg-dark-850"></span>
                          <span className="block w-1/3 h-1.5 mt-1 bg-gray-100 rounded-md dark:bg-dark-850"></span>
                          <span className="block w-2/3 h-1.5 mt-1 bg-gray-100 rounded-md dark:bg-dark-850"></span>
                        </span>
                      </span>
                    </span>
                                    </label>
                                    <label
                                        htmlFor="lightMode"
                                        className="cursor-pointer form-label"
                                    >
                                        Light
                                    </label>
                                </div>
                                <div className="flex-col gap-0 input-radio-group">
                                    <input
                                        id="darkMode"
                                        name="layoutMode"
                                        type="radio"
                                        className="hidden input-radio peer"
                                        value={layoutMode}
                                        onChange={() => handleThemeLayout(LAYOUT_MODE_TYPES.DARK)}
                                        checked={layoutMode === LAYOUT_MODE_TYPES.DARK}
                                    />
                                    <label
                                        htmlFor="darkMode"
                                        className="block w-full mb-3 overflow-hidden cursor-pointer border-dark-700 bg-dark-950 card h-28 peer-checked:border-primary-500"
                                    >
                    <span className="block h-full">
                      <span className="flex gap-1 px-4 py-1.5 bg-dark-700/50">
                        <span className="inline-block bg-red-500 rounded-full size-1.5"></span>
                        <span className="inline-block bg-green-500 rounded-full size-1.5"></span>
                        <span className="inline-block rounded-full bg-yellow-500 size-1.5"></span>
                      </span>
                      <span className="grid h-[calc(100%_-_8px)] grid-cols-12">
                        <span className="h-[calc(100%_-_8px)] col-span-2 bg-dark-900 dark:bg-dark-850"></span>
                        <span className="h-[calc(100%_-_8px)] col-span-10 p-1.5 inline-block">
                          <span className="block w-1/3 h-1.5 bg-dark-900 dark:bg-dark-850 rounded-md"></span>
                          <span className="block w-1/2 h-1.5 mt-1 bg-dark-900 dark:bg-dark-850 rounded-md"></span>
                          <span className="block w-full h-1.5 mt-1 bg-dark-900 dark:bg-dark-850 rounded-md"></span>
                          <span className="block w-1/3 h-1.5 mt-1 bg-dark-900 dark:bg-dark-850 rounded-md"></span>
                          <span className="block w-2/3 h-1.5 mt-1 bg-dark-900 dark:bg-dark-850 rounded-md"></span>
                        </span>
                      </span>
                    </span>
                                    </label>
                                    <label
                                        htmlFor="darkMode"
                                        className="cursor-pointer form-label"
                                    >
                                        Dark
                                    </label>
                                </div>
                                <div className="flex-col gap-0 input-radio-group">
                                    <input
                                        id="autoMode"
                                        name="layoutMode"
                                        type="radio"
                                        className="hidden input-radio peer"
                                        value={layoutMode}
                                        onChange={() =>
                                            handleThemeLayout(LAYOUT_MODE_TYPES.DEFAULT)
                                        }
                                        checked={layoutMode === LAYOUT_MODE_TYPES.DEFAULT}
                                    />
                                    <label
                                        htmlFor="autoMode"
                                        className="relative block w-full mb-3 overflow-hidden cursor-pointer card h-28 peer-checked:border-primary-500 before:absolute before:bg-gray-950 before:w-1/2 before:inset-y-0 before:right-0"
                                    >
                    <span className="relative block h-full">
                      <span className="flex gap-1 px-4 py-1.5 bg-gray-200/50 dark:bg-dark-800/50">
                        <span className="inline-block bg-red-500 rounded-full size-1.5"></span>
                        <span className="inline-block bg-green-500 rounded-full size-1.5"></span>
                        <span className="inline-block rounded-full bg-yellow-500 size-1.5"></span>
                      </span>
                      <span className="grid h-[calc(100%_-_8px)] grid-cols-12">
                        <span className="h-[calc(100%_-_8px)] col-span-2 bg-gray-50 dark:bg-dark-850"></span>
                        <span className="h-[calc(100%_-_8px)] col-span-10 p-1.5 inline-block">
                          <span className="block w-1/3 h-1.5 bg-gray-100/50 dark:bg-dark-850 rounded-md"></span>
                          <span className="block w-1/2 h-1.5 mt-1 bg-gray-100/50 dark:bg-dark-850 rounded-md"></span>
                          <span className="block w-full h-1.5 mt-1 bg-gray-100/50 dark:bg-dark-850 rounded-md"></span>
                          <span className="block w-1/3 h-1.5 mt-1 bg-gray-100/50 dark:bg-dark-850 rounded-md"></span>
                          <span className="block w-2/3 h-1.5 mt-1 bg-gray-100/50 dark:bg-dark-850 rounded-md"></span>
                        </span>
                      </span>
                    </span>
                                    </label>
                                    <label
                                        htmlFor="autoMode"
                                        className="cursor-pointer form-label"
                                    >
                                        Default System
                                    </label>
                                </div>
                                <div className="flex-col gap-0 input-radio-group">
                                    <input
                                        id="blackWhiteMode"
                                        name="layoutMode"
                                        type="radio"
                                        className="hidden input-radio peer"
                                        value={layoutMode}
                                        onChange={() =>
                                            handleThemeLayout(LAYOUT_MODE_TYPES.BLACKWHITE)
                                        }
                                        checked={layoutMode === LAYOUT_MODE_TYPES.BLACKWHITE}
                                    />
                                    <label
                                        htmlFor="blackWhiteMode"
                                        className="block w-full mb-3 overflow-hidden cursor-pointer card h-28 peer-checked:border-primary-500 grayscale"
                                    >
                    <span className="block h-full">
                      <span className="flex gap-1 px-4 py-1.5 bg-gray-200/50 dark:bg-dark-800/50">
                        <span className="inline-block bg-red-500 rounded-full size-1.5"></span>
                        <span className="inline-block bg-green-500 rounded-full size-1.5"></span>
                        <span className="inline-block rounded-full bg-yellow-500 size-1.5"></span>
                      </span>
                      <span className="grid h-[calc(100%_-_8px)] grid-cols-12">
                        <span className="h-[calc(100%_-_8px)] col-span-2 bg-gray-50 dark:bg-dark-850"></span>
                        <span className="h-[calc(100%_-_8px)] col-span-10 p-1.5 inline-block">
                          <span className="block w-1/3 h-1.5 bg-gray-100 rounded-md dark:bg-dark-850"></span>
                          <span className="block w-1/2 h-1.5 mt-1 bg-gray-100 rounded-md dark:bg-dark-850"></span>
                          <span className="block w-full h-1.5 mt-1 bg-gray-100 rounded-md dark:bg-dark-850"></span>
                          <span className="block w-1/3 h-1.5 mt-1 bg-gray-100 rounded-md dark:bg-dark-850"></span>
                          <span className="block w-2/3 h-1.5 mt-1 bg-gray-100 rounded-md dark:bg-dark-850"></span>
                        </span>
                      </span>
                    </span>
                                    </label>
                                    <label
                                        htmlFor="blackWhiteMode"
                                        className="cursor-pointer form-label"
                                    >
                                        Black & White
                                    </label>
                                </div>
                            </div>

                            {layoutMode === LAYOUT_MODE_TYPES.DARK && (
                                <div>
                                    <h6 className="my-4 darkModeColors">Dark Mode Colors:</h6>
                                    <div className="flex flex-wrap items-center gap-3 darkModeColors">
                                        <div className="input-radio-group">
                                            <input
                                                id="noneColors"
                                                name="darkModeColors"
                                                type="radio"
                                                className="hidden input-radio peer"
                                                value={layoutDarkModeClass}
                                                onChange={() =>
                                                    handleDarkModeClass(DARK_MODE_CLASS.DEFAULT)
                                                }
                                                checked={
                                                    layoutDarkModeClass === DARK_MODE_CLASS.DEFAULT
                                                }
                                            />
                                            <label
                                                htmlFor="noneColors"
                                                className="flex items-center justify-center border border-gray-200 rounded-full dark:border-dark-800 input-radio-label size-10 peer-checked:ring-1 peer-checked:ring-offset-2 dark:peer-checked:ring-offset-dark-900 peer-checked:ring-primary-400"
                                            >
                                                <X className="size-4"/>
                                            </label>
                                        </div>
                                        <div className="input-radio-group">
                                            <input
                                                id="zincColors"
                                                name="darkModeColors"
                                                type="radio"
                                                className="hidden input-radio peer"
                                                value={layoutDarkModeClass}
                                                onChange={() =>
                                                    handleDarkModeClass(DARK_MODE_CLASS.ZINC)
                                                }
                                                checked={layoutDarkModeClass === DARK_MODE_CLASS.ZINC}
                                            />
                                            <label
                                                htmlFor="zincColors"
                                                className="rounded-full bg-zinc-950 input-radio-label size-10 peer-checked:ring-1 peer-checked:ring-offset-2 dark:peer-checked:ring-offset-dark-900 peer-checked:ring-primary-400"
                                            ></label>
                                        </div>
                                        <div
                                            className="input-radio-group"
                                            onClick={() => handleDarkModeClass(DARK_MODE_CLASS.STONE)}
                                        >
                                            <input
                                                id="stoneColors"
                                                name="darkModeColors"
                                                type="radio"
                                                className="hidden input-radio peer"
                                                value={layoutDarkModeClass}
                                                onChange={() =>
                                                    handleDarkModeClass(DARK_MODE_CLASS.STONE)
                                                }
                                                checked={layoutDarkModeClass === DARK_MODE_CLASS.STONE}
                                            />
                                            <label
                                                htmlFor="stoneColors"
                                                className="rounded-full bg-stone-950 input-radio-label size-10 peer-checked:ring-1 peer-checked:ring-offset-2 dark:peer-checked:ring-offset-dark-900 peer-checked:ring-primary-400"
                                            ></label>
                                        </div>
                                        <div
                                            className="input-radio-group"
                                            onClick={() =>
                                                handleDarkModeClass(DARK_MODE_CLASS.NEUTRAL)
                                            }
                                        >
                                            <input
                                                id="neutralColors"
                                                name="darkModeColors"
                                                type="radio"
                                                className="hidden input-radio peer"
                                                value={layoutDarkModeClass}
                                                onChange={() =>
                                                    handleDarkModeClass(DARK_MODE_CLASS.NEUTRAL)
                                                }
                                                checked={
                                                    layoutDarkModeClass === DARK_MODE_CLASS.NEUTRAL
                                                }
                                            />
                                            <label
                                                htmlFor="neutralColors"
                                                className="rounded-full bg-neutral-950 input-radio-label size-10 peer-checked:ring-1 peer-checked:ring-offset-2 dark:peer-checked:ring-offset-dark-900 peer-checked:ring-primary-400"
                                            ></label>
                                        </div>
                                        <div className="input-radio-group">
                                            <input
                                                id="defaultColors"
                                                name="darkModeColors"
                                                type="radio"
                                                className="hidden input-radio peer"
                                                value={layoutDarkModeClass}
                                                onChange={() =>
                                                    handleDarkModeClass(DARK_MODE_CLASS.GRAY)
                                                }
                                                checked={layoutDarkModeClass === DARK_MODE_CLASS.GRAY}
                                            />
                                            <label
                                                htmlFor="defaultColors"
                                                className="rounded-full bg-gray-950 input-radio-label size-10 peer-checked:ring-1 peer-checked:ring-offset-2 dark:peer-checked:ring-offset-dark-900 peer-checked:ring-primary-400"
                                            ></label>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {layoutType !== LAYOUT_TYPES.HORIZONTAL && (
                                <div>
                                    <h6 className="my-4">Sidebar Asset Colors:</h6>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="input-radio-group">
                                            <input
                                                id="lightSidebarColors"
                                                name="sidebarColors"
                                                type="radio"
                                                className="hidden input-radio peer"
                                                value={layoutSidebarColor}
                                                onChange={() =>
                                                    handleThemeSideColorChange(SIDEBAR_COLOR.LIGHT)
                                                }
                                                checked={layoutSidebarColor === SIDEBAR_COLOR.LIGHT}
                                            />
                                            <label
                                                htmlFor="lightSidebarColors"
                                                className="bg-gray-100 rounded-full input-radio-label size-10 peer-checked:ring-1 peer-checked:ring-offset-2 dark:peer-checked:ring-offset-dark-900 peer-checked:ring-primary-400"
                                            ></label>
                                        </div>

                                        <div className="input-radio-group">
                                            <input
                                                id="darkSidebarColors"
                                                name="sidebarColors"
                                                type="radio"
                                                className="hidden input-radio peer"
                                                value={layoutSidebarColor}
                                                onChange={() =>
                                                    handleThemeSideColorChange(SIDEBAR_COLOR.DARK)
                                                }
                                                checked={layoutSidebarColor === SIDEBAR_COLOR.DARK}
                                            />
                                            <label
                                                htmlFor="darkSidebarColors"
                                                className="bg-gray-800 rounded-full input-radio-label size-10 peer-checked:ring-1 peer-checked:ring-offset-2 dark:peer-checked:ring-offset-dark-900 peer-checked:ring-primary-400"
                                            ></label>
                                        </div>

                                        <div className="input-radio-group">
                                            <input
                                                id="brandSidebarColors"
                                                name="sidebarColors"
                                                type="radio"
                                                className="hidden input-radio peer"
                                                value={layoutSidebarColor}
                                                onChange={() =>
                                                    handleThemeSideColorChange(SIDEBAR_COLOR.BRAND)
                                                }
                                                checked={layoutSidebarColor === SIDEBAR_COLOR.BRAND}
                                            />
                                            <label
                                                htmlFor="brandSidebarColors"
                                                className="rounded-full bg-primary-900 input-radio-label size-10 peer-checked:ring-1 peer-checked:ring-offset-2 dark:peer-checked:ring-offset-dark-900 peer-checked:ring-primary-400"
                                            ></label>
                                        </div>

                                        <div className="input-radio-group">
                                            <input
                                                id="purpleSidebarColors"
                                                name="sidebarColors"
                                                type="radio"
                                                className="hidden input-radio peer"
                                                value={layoutSidebarColor}
                                                onChange={() =>
                                                    handleThemeSideColorChange(SIDEBAR_COLOR.PURPLE)
                                                }
                                                checked={layoutSidebarColor === SIDEBAR_COLOR.PURPLE}
                                            />
                                            <label
                                                htmlFor="purpleSidebarColors"
                                                className="rounded-full bg-purple-950 input-radio-label size-10 peer-checked:ring-1 peer-checked:ring-offset-2 dark:peer-checked:ring-offset-dark-900 peer-checked:ring-primary-400"
                                            ></label>
                                        </div>

                                        <div className="input-radio-group">
                                            <input
                                                id="skySidebarColors"
                                                name="sidebarColors"
                                                type="radio"
                                                className="hidden input-radio peer"
                                                value={layoutSidebarColor}
                                                onChange={() =>
                                                    handleThemeSideColorChange(SIDEBAR_COLOR.SKY)
                                                }
                                                checked={layoutSidebarColor === SIDEBAR_COLOR.SKY}
                                            />
                                            <label
                                                htmlFor="skySidebarColors"
                                                className="rounded-full bg-sky-950 input-radio-label size-10 peer-checked:ring-1 peer-checked:ring-offset-2 dark:peer-checked:ring-offset-dark-900 peer-checked:ring-primary-400"
                                            ></label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <h6 className="my-4">Primary Asset Colors:</h6>
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="input-radio-group">
                                    <input
                                        id="defaultPrimaryColors"
                                        name="primaryColors"
                                        type="radio"
                                        className="hidden input-radio peer"
                                        value={layoutDataColor}
                                        onChange={() => handleThemeColor(DATA_COLORS.DEFAULT)}
                                        checked={layoutDataColor === DATA_COLORS.DEFAULT}
                                    />
                                    <label
                                        htmlFor="defaultPrimaryColors"
                                        className="rounded-full bg-[#358ffc] input-radio-label size-10 peer-checked:ring-1 peer-checked:ring-offset-2 dark:peer-checked:ring-offset-dark-900 peer-checked:ring-primary-400"
                                    ></label>
                                </div>
                                <div className="input-radio-group">
                                    <input
                                        id="greenPrimaryColors"
                                        name="primaryColors"
                                        type="radio"
                                        className="hidden input-radio peer"
                                        value={layoutDataColor}
                                        onChange={() => handleThemeColor(DATA_COLORS.GREEN)}
                                        checked={layoutDataColor === DATA_COLORS.GREEN}
                                    />
                                    <label
                                        htmlFor="greenPrimaryColors"
                                        className="bg-[#1acd81] rounded-full input-radio-label size-10 peer-checked:ring-1 peer-checked:ring-offset-2 dark:peer-checked:ring-offset-dark-900 peer-checked:ring-primary-400"
                                    ></label>
                                </div>
                                <div className="input-radio-group">
                                    <input
                                        id="violetPrimaryColors"
                                        name="primaryColors"
                                        type="radio"
                                        className="hidden input-radio peer"
                                        value={layoutDataColor}
                                        onChange={() => handleThemeColor(DATA_COLORS.VIOLET)}
                                        checked={layoutDataColor === DATA_COLORS.VIOLET}
                                    />
                                    <label
                                        htmlFor="violetPrimaryColors"
                                        className="rounded-full bg-violet-500 input-radio-label size-10 peer-checked:ring-1 peer-checked:ring-offset-2 dark:peer-checked:ring-offset-dark-900 peer-checked:ring-primary-400"
                                    ></label>
                                </div>
                                <div className="input-radio-group">
                                    <input
                                        id="orangePrimaryColors"
                                        name="primaryColors"
                                        type="radio"
                                        className="hidden input-radio peer"
                                        value={layoutDataColor}
                                        onChange={() => handleThemeColor(DATA_COLORS.ORANGE)}
                                        checked={layoutDataColor === DATA_COLORS.ORANGE}
                                    />
                                    <label
                                        htmlFor="orangePrimaryColors"
                                        className="rounded-full bg-[#f04b1f] input-radio-label size-10 peer-checked:ring-1 peer-checked:ring-offset-2 dark:peer-checked:ring-offset-dark-900 peer-checked:ring-primary-400"
                                    ></label>
                                </div>
                                <div className="input-radio-group">
                                    <input
                                        id="tealPrimaryColors"
                                        name="primaryColors"
                                        type="radio"
                                        className="hidden input-radio peer"
                                        value={layoutDataColor}
                                        onChange={() => handleThemeColor(DATA_COLORS.TEAL)}
                                        checked={layoutDataColor === DATA_COLORS.TEAL}
                                    />
                                    <label
                                        htmlFor="tealPrimaryColors"
                                        className="bg-teal-500 rounded-full input-radio-label size-10 peer-checked:ring-1 peer-checked:ring-offset-2 dark:peer-checked:ring-offset-dark-900 peer-checked:ring-primary-400"
                                    ></label>
                                </div>
                                <div className="input-radio-group">
                                    <input
                                        id="fuchsiaPrimaryColors"
                                        name="primaryColors"
                                        type="radio"
                                        className="hidden input-radio peer"
                                        value={layoutDataColor}
                                        onChange={() => handleThemeColor(DATA_COLORS.FUCHSIA)}
                                        checked={layoutDataColor === DATA_COLORS.FUCHSIA}
                                    />
                                    <label
                                        htmlFor="fuchsiaPrimaryColors"
                                        className="rounded-full bg-fuchsia-500 input-radio-label size-10 peer-checked:ring-1 peer-checked:ring-offset-2 dark:peer-checked:ring-offset-dark-900 peer-checked:ring-primary-400"
                                    ></label>
                                </div>
                                <div className="input-radio-group">
                                    <input
                                        id="limePrimaryColors"
                                        name="primaryColors"
                                        type="radio"
                                        className="hidden input-radio peer"
                                        value={layoutDataColor}
                                        onChange={() => handleThemeColor(DATA_COLORS.LIME)}
                                        checked={layoutDataColor === DATA_COLORS.LIME}
                                    />
                                    <label
                                        htmlFor="limePrimaryColors"
                                        className="rounded-full bg-lime-500 input-radio-label size-10 peer-checked:ring-1 peer-checked:ring-offset-2 dark:peer-checked:ring-offset-dark-900 peer-checked:ring-primary-400"
                                    ></label>
                                </div>
                                <div className="input-radio-group">
                                    <input
                                        id="amberPrimaryColors"
                                        name="primaryColors"
                                        type="radio"
                                        className="hidden input-radio peer"
                                        value={layoutDataColor}
                                        onChange={() => handleThemeColor(DATA_COLORS.AMBER)}
                                        checked={layoutDataColor === DATA_COLORS.AMBER}
                                    />
                                    <label
                                        htmlFor="amberPrimaryColors"
                                        className="rounded-full bg-amber-500 input-radio-label size-10 peer-checked:ring-1 peer-checked:ring-offset-2 dark:peer-checked:ring-offset-dark-900 peer-checked:ring-primary-400"
                                    ></label>
                                </div>
                            </div>
                        </div>
                    </>
                }
            />
        </React.Fragment>
    );
};

export default SettingsModal;
