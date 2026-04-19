import {Moon, Settings, Sun,} from "lucide-react";
import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import logo from "@assets/images/main-logo.png";
import logoWhite from "@assets/images/logo-white.png";
import ToolsAppsModal from "@src/components/layout/toolsAppsModal.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@src/slices/store.ts";
import {changeLayoutMode} from "@src/slices/thunk.ts";
import SettingsModal from "@src/components/layout/settingsModal.tsx";
import {LAYOUT_MODE_TYPES,} from "@constants/layout";
import {changeSettingModalOpen} from "@src/slices/layout/reducer.ts";

import Profile from "@layout/topBar/profile.tsx";


const TopBar: React.FC = () => {
    const {layoutMode, isSettingModalOpen} = useSelector(
        (state: RootState) => state.Layout,
    );
    const dispatch = useDispatch<AppDispatch>();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleCloseModal = () => {
        setOpen(false);
    };
    // call theme modal
    const handleThemeModal = () => {
        dispatch(changeSettingModalOpen(true));
    };
    // change theme
    const handleCloseThemeModal = () => {
        dispatch(changeSettingModalOpen(false));
    };
    // change layout mode
    const handleChangeLayoutMode = (value: LAYOUT_MODE_TYPES) => {
        dispatch(changeLayoutMode(value));
    };

    // layoutMode
    return (
        <React.Fragment>
            <div
                className={`main-topbar group/topbar navbar ${scrolled ? "group-data-[layout=boxed]:top-0 group-data-[layout=semibox]:top-0 nav-sticky" : ""}`}
            >
                <div
                    className="main-topbar-wrapper group-data-[nav-type=pattern]:group-[&.nav-sticky]/topbar:bg-primary-500 group-data-[nav-type=pattern]:group-[&.nav-sticky]/topbar:border-primary-400">
                    <div className="flex items-center w-full ltr:pr-4 rtl:pl-4">
                        {/* Logo */}
                        <div className="navbar-brand">
                            <div className="logos">
                                <Link to="/">
                                    <img
                                        src={logo}
                                        aria-label="Read more about Seminole tax hike"
                                        alt="logo"
                                        className="h-14 group-data-[layout=modern]:hidden inline-block dark:hidden"
                                        height={164}

                                    />
                                    <img
                                        src={logoWhite}
                                        aria-label="Read more about Seminole tax hike"
                                        alt="logoWhite"
                                        className="h-14 hidden dark:inline-block group-data-[layout=modern]:hidden"
                                        height={24}

                                    />
                                </Link>
                            </div>
                        </div>


                        <div className="flex items-center gap-2 ltr:ml-auto rtl:mr-auto">
                            {/* Admin Dashboard */}


                            {/* Settings (Layout modal) */}
                            <button
                                className="hidden topbar-link md:flex"
                                title="topbar-link"
                                type="button"
                                onClick={handleThemeModal}
                            >
                                <Settings className="size-4"></Settings>
                            </button>

                            {/* Light & Dark Modal */}
                            <button
                                className="topbar-link"
                                title="Toggle Layout Mode"
                                onClick={() => {
                                    handleChangeLayoutMode(
                                        layoutMode === LAYOUT_MODE_TYPES.LIGHT
                                            ? LAYOUT_MODE_TYPES.DARK
                                            : LAYOUT_MODE_TYPES.LIGHT,
                                    );
                                }}
                            >
                                {layoutMode === LAYOUT_MODE_TYPES.LIGHT ||
                                layoutMode === LAYOUT_MODE_TYPES.DEFAULT ||
                                layoutMode === LAYOUT_MODE_TYPES.BLACKWHITE ? (
                                    <Moon className="size-4"/>
                                ) : (
                                    <Sun className={`size-4 `}/>
                                )}
                            </button>
                            <Profile/>


                        </div>
                    </div>
                </div>
            </div>
            <ToolsAppsModal open={open} handleCloseModal={handleCloseModal}/>
            <SettingsModal
                open={isSettingModalOpen}
                handleCloseModal={handleCloseThemeModal}
            />
        </React.Fragment>
    );
};

export default TopBar;
