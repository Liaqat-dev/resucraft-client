import React, {useEffect} from "react";
import UserNotesContent from "./userNotes";
import {NextPageWithLayout} from "@dtos/layout";

const UserNotes: NextPageWithLayout = () => {
    useEffect(() => {
        document.title =
            "User Notes | Domiex - React TS Admin & Dashboard Template";
    }, []);

    return (
        <React.Fragment>
            <UserNotesContent/>
        </React.Fragment>
    );
};
export default UserNotes;
