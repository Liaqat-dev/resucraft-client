import React, {useEffect} from "react";
import {NextPageWithLayout} from "@dtos/layout";

const Projects: NextPageWithLayout = () => {
    useEffect(() => {
        document.title =
            "Projects | ResuCraft";
    }, []);

    return (
        <React.Fragment>

        </React.Fragment>
    );
};
export default Projects;
