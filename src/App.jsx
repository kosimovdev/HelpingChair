import './App.css'
import { Routes, Route } from "react-router-dom";
import HeartPercentage from "./HeartPercentage/HeartPercentage.jsx";
import ActivityPage from "./ActivityPage/ActivityPage.jsx";
import LoginPage from "./LoginPage/LoginPage.jsx";
import NotFound from "./NotFound/NotFound.jsx";
import TravelDistance from "./TravelDistance/TravelDistance.jsx";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
        <Routes>
            <Route path="/" element={<HeartPercentage />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/travel" element={<TravelDistance />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFound />} />        {/* 404 page*/}
        </Routes>
        <ToastContainer position="top-center" />
    </>
  )
}

export default App
