import { useEffect } from "react";
import { NextPageWithLayout } from "@dtos/layout";
import ProjectsPage from "./projectsPage.tsx";

const Projects: NextPageWithLayout = () => {
    useEffect(() => {
        document.title = "Projects | ResuCraft";
    }, []);

    return <ProjectsPage />;
};

export default Projects;