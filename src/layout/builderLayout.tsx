import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@src/slices/store.ts";
import {changeSidebarSize} from "@src/slices/thunk";
import TopBar from "./topBar/topBar.tsx";
import {LAYOUT_TYPES, SIDEBAR_SIZE} from "@src/components/constants/layout";
import {changeHTMLAttribute, setNewThemeData} from "@src/slices/layout/utils";
import {changeSettingModalOpen} from "@src/slices/layout/reducer";
import {useLocation} from "react-router-dom";

interface LayoutProps {
    children: React.ReactNode;
    breadcrumbTitle?: string;
}

const BuilderLayout = ({children, breadcrumbTitle}: LayoutProps) => {
    const title = breadcrumbTitle
        ? ` ${breadcrumbTitle} | ResuCraft `
        : "ResuCraft";
    const {
        layoutMode,
        layoutType,
        layoutWidth,
        layoutSidebar,
        layoutDarkModeClass,
        layoutSidebarColor,
        layoutDataColor,
        layoutDirection,
    } = useSelector((state: RootState) => state.Layout);
    const dispatch = useDispatch<AppDispatch>();
    const [searchValue, setSearchValue] = useState<string>("");
    const router = useLocation();
    useEffect(() => {
        // If the user has no session and has no prior login, redirect to login page
        if (!localStorage.getItem("wasLoggedIn")) {
            localStorage.setItem("wasLoggedIn", 'true')
            // navigate("/auth/signin-basic");
        }
    }, [router]);
    const handleThemeSidebarSize = useCallback(() => {
        if (layoutType !== "horizontal") {
            // Toggle between BIG and SMALL sidebar
            const newSize =
                layoutSidebar === SIDEBAR_SIZE.DEFAULT
                    ? SIDEBAR_SIZE.SMALL
                    : SIDEBAR_SIZE.DEFAULT;
            setNewThemeData("data-sidebar-size", newSize);
            changeHTMLAttribute("data-sidebar", newSize);
            dispatch(changeSidebarSize(newSize));
        } else {
            // If layout is horizontal, always use default size
            setNewThemeData("data-sidebar-size", SIDEBAR_SIZE.DEFAULT);
            changeHTMLAttribute("data-sidebar", SIDEBAR_SIZE.DEFAULT);
            dispatch(changeSidebarSize(SIDEBAR_SIZE.DEFAULT));
        }
    }, [layoutType, layoutSidebar, dispatch]);

    const toggleSidebar = () => {
        if (window.innerWidth < 1000) {
            // Toggle sidebar open/close for small screens
            setNewThemeData("data-sidebar-size", SIDEBAR_SIZE.DEFAULT);
            changeHTMLAttribute("data-sidebar", SIDEBAR_SIZE.DEFAULT);
            dispatch(changeSidebarSize(SIDEBAR_SIZE.DEFAULT));
        } else {
            // On larger screens, toggle between big and small sidebar
            handleThemeSidebarSize();
        }
    };

    useEffect(() => {
        const handleResize = () => {
            // Update the sidebar state based on the window width
            if (
                layoutType === LAYOUT_TYPES.SEMIBOX ||
                layoutType === LAYOUT_TYPES.MODERN
            ) {
                if (window.innerWidth > 1000) {
                    // Set the layout to the layoutType if screen size is greater than 1000px
                    document.documentElement.setAttribute("data-layout", layoutType);
                } else {
                    // Set to 'default' if screen size is 1000px or less
                    document.documentElement.setAttribute("data-layout", "default");
                }
            } else {
                // For other layouts, just set to layoutType, no need to check screen size
                document.documentElement.setAttribute("data-layout", layoutType);
            }
        };
        // Initial layout check on component mount
        handleResize();
        // Listen for window resize events
        window.addEventListener("resize", handleResize);
        // Cleanup the event listener on unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [layoutType]); // Only rerun the effect when layoutType changes
    // handle search menu
    const handleSearchClient = (value: string) => {
        setSearchValue(value);
    };
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (window.innerWidth >= 768) {
            timer = setTimeout(() => {
                dispatch(changeSettingModalOpen(false));
            }, 500); // Delay to show modal after a short timeout
        }
        // Cleanup the timeout if the component is unmounted or the effect is cleaned up
        return () => {
            clearTimeout(timer);
        };
    }, [dispatch]);
    useEffect(() => {
        document.documentElement.classList.add("scroll-smooth", "group");
        document.documentElement.setAttribute("data-mode", layoutMode);
        document.documentElement.setAttribute("data-colors", layoutDataColor);
        document.documentElement.setAttribute("lang", "en");
        document.documentElement.setAttribute("data-layout", layoutType);
        document.documentElement.setAttribute("data-content-width", layoutWidth);
        document.documentElement.setAttribute("data-sidebar", layoutSidebar);
        document.documentElement.setAttribute(
            "data-sidebar-colors",
            layoutSidebarColor,
        );
        document.documentElement.setAttribute("data-nav-type", layoutDarkModeClass);
        document.documentElement.setAttribute("dir", layoutDirection);
    }, []);

    return (
        <React.Fragment>
            {/* Main topbar */}
            {/* <Head> */}
            <title>{title}</title>
            {/* </Head> */}

            <TopBar
                searchMenu={(value: string) => handleSearchClient(value)}
                searchText={searchValue}
                toggleSidebar={toggleSidebar}
            />


            <div
                className="relative min-h-screen group-data-[layout=boxed]:bg-white group-data-[layout=boxed]:rounded-md">
                <div className=" pt-[calc(theme('spacing.topbar')_*_1.0)]
                ">
                    {" "}
                    {children}
                </div>
            </div>
        </React.Fragment>
    );
};

export default BuilderLayout;
