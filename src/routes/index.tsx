import React from "react";
import { Route, Routes } from "react-router-dom";
import { nonAuthRoutes, routes } from "./allRoutes";
import NonLayout from "@src/layout/nonLayout";
import Layout from "@src/layout/layout";

const Routing = () => {
    function renderRoutes(routes: any[]) {
        return routes.map((route, idx) => (
            <Route
                key={idx}
                path={route.path}
                element={<Layout>{route.component}</Layout>}
            >
                {route.children &&
                    route.children.map((route: any) => {
                        if (route.index) {
                            // Handle index route
                            return <Route key={idx} index element={route.element} />;
                        }
                        return (

                            <Route key={idx} path={route.path} element={route.component} />
                        );
                    })}
            </Route>
        ));
    }

    return (
        <React.Fragment>
            <Routes>
                {renderRoutes(routes || [])}

                {(nonAuthRoutes || []).map((item, key) => (
                    <Route
                        key={key}
                        path={item.path}
                        element={<NonLayout>{item.component}</NonLayout>}
                    />
                ))}
            </Routes>
        </React.Fragment>
    );
};

export default Routing;
