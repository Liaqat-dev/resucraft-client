import React, {useEffect} from "react";
import UserActivityContent from "./userActivity";
import {NextPageWithLayout} from "@dtos/layout";

const UserActivity: NextPageWithLayout = () => {
    useEffect(() => {
        document.title =
            "User Activity | Domiex - React TS Admin & Dashboard Template";
    }, []);

    return (
        <React.Fragment>
            <UserActivityContent/>
        </React.Fragment>
    );
};
export default UserActivity;
