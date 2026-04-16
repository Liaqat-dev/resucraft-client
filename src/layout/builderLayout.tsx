import React, {useEffect} from "react";
import TopBar from "./topBar/topBar.tsx";
import {useAuth} from "@hooks/useAuth.ts";
import {useNavigate} from "react-router-dom";

interface LayoutProps {
    children: React.ReactNode;
}

const BuilderLayout = ({children}: LayoutProps) => {
    const {user, isAuthenticated, loading, login, refreshToken} = useAuth();
    const navigate = useNavigate();
    // const {
    //     layoutMode,
    //     layoutType,
    //     layoutWidth,
    //     layoutSidebar,
    //     layoutDarkModeClass,
    //     layoutSidebarColor,
    //     layoutDataColor,
    //     layoutDirection,
    // } = useSelector((state: RootState) => state.Layout);
    // const dispatch = useDispatch<AppDispatch>();
    //
    // useEffect(() => {
    //     const handleResize = () => {
    //         // Update the sidebar state based on the window width
    //         if (
    //             layoutType === LAYOUT_TYPES.SEMIBOX ||
    //             layoutType === LAYOUT_TYPES.MODERN
    //         ) {
    //             if (window.innerWidth > 1000) {
    //                 // Set the layout to the layoutType if screen size is greater than 1000px
    //                 document.documentElement.setAttribute("data-layout", layoutType);
    //             } else {
    //                 // Set to 'default' if screen size is 1000px or less
    //                 document.documentElement.setAttribute("data-layout", "default");
    //             }
    //         } else {
    //             // For other layouts, just set to layoutType, no need to check screen size
    //             document.documentElement.setAttribute("data-layout", layoutType);
    //         }
    //     };
    //     // Initial layout check on component mount
    //     handleResize();
    //     // Listen for window resize events
    //     window.addEventListener("resize", handleResize);
    //     // Cleanup the event listener on unmount
    //     return () => {
    //         window.removeEventListener("resize", handleResize);
    //     };
    // }, [layoutType]); // Only rerun the effect when layoutType changes
    // // handle search menu
    // useEffect(() => {
    //     let timer: NodeJS.Timeout;
    //     if (window.innerWidth >= 768) {
    //         timer = setTimeout(() => {
    //             dispatch(changeSettingModalOpen(false));
    //         }, 500); // Delay to show modal after a short timeout
    //     }
    //     // Cleanup the timeout if the component is unmounted or the effect is cleaned up
    //     return () => {
    //         clearTimeout(timer);
    //     };
    // }, [dispatch]);
    // useEffect(() => {
    //     document.documentElement.classList.add("scroll-smooth", "group");
    //     document.documentElement.setAttribute("data-mode", layoutMode);
    //     document.documentElement.setAttribute("data-colors", layoutDataColor);
    //     document.documentElement.setAttribute("lang", "en");
    //     document.documentElement.setAttribute("data-layout", layoutType);
    //     document.documentElement.setAttribute("data-content-width", layoutWidth);
    //     document.documentElement.setAttribute("data-sidebar", layoutSidebar);
    //     document.documentElement.setAttribute(
    //         "data-sidebar-colors",
    //         layoutSidebarColor,
    //     );
    //     document.documentElement.setAttribute("data-nav-type", layoutDarkModeClass);
    //     document.documentElement.setAttribute("dir", layoutDirection);
    // }, []);
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            // Capture the full current URL (pathname + search + hash)
            const currentUrl = window.location.pathname + window.location.search + window.location.hash;

            refreshToken().then((action: any) => {
                if (action?.meta?.requestStatus === 'fulfilled') {
                    // Token refreshed successfully — stay on / re-navigate to the same URL
                    navigate(currentUrl, {replace: true});
                } else {
                    setTimeout(() => {

                        navigate(`/auth/sign-in?redirect=${encodeURIComponent(currentUrl)}`, {replace: true});
                    }, 200)
                }
            });
        }
    }, [loading, isAuthenticated]);

    return (
        <React.Fragment>
            <title>{"ResuCraft"}</title>
            <TopBar/>
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
