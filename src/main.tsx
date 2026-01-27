import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import 'react-loading-skeleton/dist/skeleton.css';

import App from "./App.tsx";
import {Provider} from "react-redux";
import store from "./slices/store.ts";
import {BrowserRouter as Router} from "react-router-dom";
import {GoogleOAuthProvider} from "@react-oauth/google";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <Provider store={store}>
                <Router basename={import.meta.env.BASE_URL}>
                    <App/>
                </Router>
            </Provider>
        </GoogleOAuthProvider>
    </StrictMode>,
);
