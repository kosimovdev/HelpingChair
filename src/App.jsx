import {useEffect, useState} from "react";
import "./App.css";
import {Routes, Route} from "react-router-dom";

import HeartPercentage from "./HeartPercentage/HeartPercentage.jsx";
import ActivityPage from "./ActivityPage/ActivityPage.jsx";
import LoginPage from "./LoginPage/LoginPage.jsx";
import NotFound from "./NotFound/NotFound.jsx";
import CameraCard from "./CameraCard/Camera.jsx";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {WarningProvider} from "./context/WarningContext.jsx";
import GlobalWarningModal from "./GlobalModal/GlobalModal.jsx";
import KakaoMap from "./KakaoMap/KakaoMap.jsx";
import UsersList from "./UsersList/userList.jsx";

function App() {
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    useEffect(() => {
        // Geolocation API yordamida hozirgi joylashuvni olish
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    // Hato haqida xabar berish
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    if (latitude === null || longitude === null) {
        return <div>Loading...</div>; // Joylashuv olinayotganini ko'rsatish
    }

    return (
        <>
                <WarningProvider>
                    <Routes>
                        <Route path="/" element={<HeartPercentage />} />
                        <Route path="/activity" element={<ActivityPage />} />
                        {/* <Route path="/map" element={<KakaoMap />} /> */}
                        <Route path="/map" element={<KakaoMap latitude={latitude} longitude={longitude} />} />
                        <Route path="/camera" element={<CameraCard />} />
                        <Route path="/users" element={<UsersList />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="*" element={<NotFound />} /> {/* 404 page*/}
                    </Routes>
                    <GlobalWarningModal />
                    <ToastContainer position="top-center" />
                </WarningProvider>
        </>
    );
}

export default App;
