import React from "react";

interface NonLayoutProps {
    children: React.ReactNode;
}

const NonLayout = ({children,}: NonLayoutProps) => {
    return (
        <React.Fragment>
            <title>{"ResuCraft"}</title>
            <main>{children}</main>
        </React.Fragment>
    );
};

export default NonLayout;
