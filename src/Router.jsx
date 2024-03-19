import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room"
import Title from "./pages/Title";
import { GoogleOAuthProvider } from "@react-oauth/google";
import config from "./config";
import RouteTracker from "./RouteTracker";
import Wishlist from "./pages/Wishlist";
import { useEffect } from "react";

export default function Router(){

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" exact element={<GoogleOAuthProvider clientId={config.google_client_id}>
                    {/* <RouteTracker /> */}
                    <Home />
                </GoogleOAuthProvider>} />
                <Route path="/room" element={<GoogleOAuthProvider clientId={config.google_client_id}>
                    {/* <RouteTracker /> */}
                    <Home />
                </GoogleOAuthProvider>} />
                <Route path="/wishlist" element={<GoogleOAuthProvider clientId={config.google_client_id}>
                    {/* <RouteTracker /> */}
                    <Wishlist />
                </GoogleOAuthProvider>} />
                <Route path="/room/:slug" element={<GoogleOAuthProvider clientId={config.google_client_id}>
                    {/* <RouteTracker /> */}
                    <Title />
                </GoogleOAuthProvider>} />
                <Route path="/:slug" element={<GoogleOAuthProvider clientId={config.google_client_id}>
                    {/* <RouteTracker /> */}
                    <Title />
                </GoogleOAuthProvider>} />
            </Routes>
        </BrowserRouter>
    )
}