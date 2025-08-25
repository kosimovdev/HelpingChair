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
import WarningModal from "./WarningModal/Warningmodal.jsx";
import FullPage from "./FullPage/FullPage.jsx";

function App() {
   
    return (
        <>
                <WarningProvider>
                    <Routes>
                        <Route path="/" element={<FullPage />} />
                        <Route path="/heart" element={<HeartPercentage />} />
                        <Route path="/activity" element={<ActivityPage />} />
                        <Route path="/map" element={<KakaoMap />} />
                        <Route path="/camera" element={<CameraCard />} />
                        <Route path="/users" element={<UsersList />} />
                        <Route path="/login" element={<LoginPage />} />
                          <Route path="/warning" element={<WarningModal />} />
                        <Route path="*" element={<NotFound />} /> {/* 404 page*/}
                    </Routes>
                    <GlobalWarningModal />
                    <ToastContainer position="top-center" />
                </WarningProvider>
        </>
    );
}

export default App;

