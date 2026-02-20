import {BellRing, Moon, PanelRightOpen, Search, Settings, ShoppingBag, Sun,} from "lucide-react";
import {Link} from "react-router-dom";
import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import logo from "@assets/images/main-logo.png";
import logoWhite from "@assets/images/logo-white.png";
import ToolsAppsModal from "@src/components/layout/toolsAppsModal.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@src/slices/store.ts";
import {changeLayoutMode, changeSidebarColor} from "@src/slices/thunk.ts";
import {Dropdown, DropdownButton, DropdownMenu,} from "@custom/dropdown/dropdown.tsx";
import user10 from "@assets/images/avatar/user-10.png";
import user11 from "@assets/images/avatar/user-11.png";
import user18 from "@assets/images/avatar/user-18.png";
import SimpleBar from "simplebar-react";
import SettingsModal from "@src/components/layout/settingsModal.tsx";
import {LAYOUT_MODE_TYPES, SIDEBAR_COLOR,} from "@constants/layout.tsx";

import CardSidebar from "../../components/layout/cardSidebar.tsx";
import {changeSettingModalOpen} from "@src/slices/layout/reducer.ts";

import Profile from "@layout/topBar/profile.tsx";

interface TopBarProps {
    searchMenu: (value: string) => void;
    searchText: string;
    toggleSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
                                           searchMenu,
                                           searchText,
                                           toggleSidebar,
                                       }) => {
    const {layoutMode, isSettingModalOpen, layoutSidebarColor} = useSelector(
        (state: RootState) => state.Layout,
    );
    const dispatch = useDispatch<AppDispatch>();
    const [scrolled, setScrolled] = useState(false);
    const [cardOpen, setCardOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const flatpickrRef = useRef<any>(null);
    const [isOpen] = useState(false);

    useEffect(() => {
        // Automatically open the calendar when the dropdown is shown
        if (isOpen && flatpickrRef.current) {
            flatpickrRef.current.flatpickr.open();
        }
    }, [isOpen]);
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
    // call modal
    const handleOpenCardModal = () => {
        setCardOpen(true);
    };

    const handleCloseCardModal = () => {
        setCardOpen(false);
    };
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
                                        className="h-6 group-data-[layout=modern]:hidden inline-block dark:hidden"
                                        height={24}
                                        width={132}
                                    />
                                    <img
                                        src={logoWhite}
                                        aria-label="Read more about Seminole tax hike"
                                        alt="logoWhite"
                                        className="h-6 hidden dark:inline-block group-data-[layout=modern]:hidden"
                                        height={24}
                                        width={132}
                                    />
                                </Link>
                            </div>
                            <button
                                onClick={() => toggleSidebar()}
                                className="sidebar-toggle group-data-[layout=horizontal]:lg:hidden"
                                title="sidebar-toggle"
                            >
                                <PanelRightOpen className="size-4"/>
                            </button>
                        </div>

                        {/* Search */}
                        <div className="relative items-center hidden lg:flex">
                            <Search
                                className="absolute size-4 text-topbar top-3 ltr:left-2 rtl:right-2 group-data-[nav-type=pattern]:text-white/75"></Search>
                            <input
                                type="search"
                                className="border-0 w-72 ltr:pl-8 rtl:pr-8 form-input focus:outline-none group-data-[nav-type=pattern]:bg-transparent group-data-[nav-type=pattern]:placeholder:text-white/50 group-data-[nav-type=pattern]:text-white"
                                placeholder="Search for Domiex"
                                value={searchText}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    searchMenu(e.target.value)
                                }
                            />
                        </div>

                        <div className="flex items-center gap-2 ltr:ml-auto rtl:mr-auto">
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
                                    if (layoutSidebarColor === SIDEBAR_COLOR.DARK) {
                                        dispatch(changeSidebarColor(SIDEBAR_COLOR.LIGHT));
                                    }
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

                            {/* Tool Apps */}
                            {/*<button*/}
                            {/*    className="hidden topbar-link sm:flex"*/}
                            {/*    title="tools-apps-modal"*/}
                            {/*    data-modal-target="toolsAppsModal"*/}
                            {/*    onClick={handleOpenModal}*/}
                            {/*>*/}
                            {/*    <LayoutGrid className="size-4"></LayoutGrid>*/}
                            {/*</button>*/}
                            <button
                                className="relative hidden topbar-link sm:flex"
                                title="shopping-cart"
                                data-drawer-target="basicEnd"
                                onClick={handleOpenCardModal}
                            >
                                <ShoppingBag className="size-4"/>
                                <span
                                    className="absolute right-0 p-0 border-2 border-white rounded-full dark:border-dark-900 badge badge-square badge-solid-red top-3.5 size-5">
                  3
                </span>
                            </button>

                            {/* Notifications */}

                            <Dropdown
                                position="right"
                                trigger="click"
                                dropdownClassName="dropdown"
                            >
                                <DropdownButton colorClass="topbar-link">
                  <span className="relative">
                    <BellRing className="size-4"></BellRing>
                    <div
                        className="absolute top-0 -mt-1 bg-green-500 rounded-full ltr:-mr-1 rtl:-ml-1 ltr:right-0 rtl:left-0 size-2 animate-ping"></div>
                    <div
                        className="absolute top-0 -mt-1 bg-green-500 rounded-full ltr:-mr-1 rtl:-ml-1 ltr:right-0 rtl:left-0 size-2"></div>
                  </span>
                                </DropdownButton>
                                <DropdownMenu menuclass="!w-96">
                                    <div className="flex items-center gap-3 p-4">
                                        <h6 className="grow">Notification (4)</h6>
                                        <Link
                                            to="#!"
                                            className="text-sm shrink-0 link link-primary"
                                        >
                                            Mark All as read
                                        </Link>
                                    </div>
                                    <div className="py-4 border-t border-gray-200 dark:border-dark-800">
                                        <SimpleBar>
                                            <div className="px-3">
                                                <Link
                                                    to="#!"
                                                    className="relative flex gap-3 p-2 transition duration-300 ease-linear rounded-md hover:bg-gray-100 [&.unread]:bg-gray-100 dark:[&.unread]:bg-dark-850 dark:hover:bg-dark-850 unread"
                                                >
                                                    <img
                                                        src={user10}
                                                        alt="user10Img"
                                                        className="rounded-full size-7 shrink-0"
                                                    />
                                                    <div className="grow">
                                                        <p className="mb-0.5 text-sm">
                                                            <span className="font-medium">Donna Berlin</span>{" "}
                                                            wants to edit Domiex Admin & dashboards
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-dark-500">
                                                            5 min ago
                                                        </p>
                                                    </div>
                                                </Link>
                                                <Link
                                                    to="#!"
                                                    className="relative flex gap-3 p-2 transition duration-300 ease-linear rounded-md hover:bg-gray-100 [&.unread]:bg-gray-100 dark:[&.unread]:bg-dark-850 dark:hover:bg-dark-850"
                                                >
                                                    <img
                                                        src={user11}
                                                        alt="user11Img"
                                                        className="rounded-full size-7 shrink-0"
                                                    />
                                                    <div className="grow">
                                                        <p className="mb-0.5 text-sm">
                                                            <span className="font-medium">Liam Clark</span>{" "}
                                                            commented in domiex
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-dark-500">
                                                            8 min ago
                                                        </p>
                                                        <p className="mt-3 text-sm line-clamp-2">
                                                            " Greetings, I'm making blazor web assembly app /
                                                            MAUI. Does your template available for this? "
                                                        </p>
                                                    </div>
                                                </Link>
                                                <Link
                                                    to="#!"
                                                    className="relative flex gap-3 p-2 transition duration-300 ease-linear rounded-md hover:bg-gray-100 [&.unread]:bg-gray-100 dark:[&.unread]:bg-dark-850 dark:hover:bg-dark-850"
                                                >
                                                    <div
                                                        className="flex items-center justify-center text-xs text-gray-500 bg-gray-100 rounded-full size-7 shrink-0">
                                                        LN
                                                    </div>
                                                    <div className="grow">
                                                        <p className="mb-0.5 text-sm">
                                                            <span className="font-medium">Lucas Nguyen</span>{" "}
                                                            competed create new components
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-dark-500">
                                                            01:15 PM
                                                        </p>
                                                    </div>
                                                </Link>
                                                <Link
                                                    to="#!"
                                                    className="relative flex gap-3 p-2 transition duration-300 ease-linear rounded-md hover:bg-gray-100 [&.unread]:bg-gray-100 dark:[&.unread]:bg-dark-850 dark:hover:bg-dark-850"
                                                >
                                                    <img
                                                        src={user18}
                                                        alt="user18Img"
                                                        className="rounded-full size-7 shrink-0"
                                                    />
                                                    <div className="grow">
                                                        <p className="mb-0.5 text-sm">
                                                            <span className="font-medium">James Taylor</span>{" "}
                                                            marked your order.
                                                        </p>
                                                        <span className="mb-2 badge badge-primary">
                              Completed
                            </span>
                                                        <p className="text-xs text-gray-500 dark:text-dark-500">
                                                            03:57 AM
                                                        </p>
                                                    </div>
                                                </Link>
                                            </div>
                                        </SimpleBar>
                                    </div>
                                </DropdownMenu>
                            </Dropdown>

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

            <CardSidebar open={cardOpen} handleCloseModal={handleCloseCardModal}/>
        </React.Fragment>
    );
};

export default TopBar;
