import React, {useEffect} from "react";
import TopBar from "./topBar/topBar.tsx";
import {useAuth} from "@hooks/useAuth.ts";
import {useNavigate} from "react-router-dom";

interface LayoutProps {
    children: React.ReactNode;
}

const ResumeEditorLayout = ({children}: LayoutProps) => {

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

export default ResumeEditorLayout;
