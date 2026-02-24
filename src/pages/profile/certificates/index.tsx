import { useEffect } from "react";
import { NextPageWithLayout } from "@dtos/layout";
import CertificatesPage from "./certificatesPage.tsx";

const Certificates: NextPageWithLayout = () => {
    useEffect(() => {
        document.title = "Certificates | ResuCraft";
    }, []);

    return <CertificatesPage />;
};

export default Certificates;