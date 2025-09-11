import React, {useEffect, useRef , useState} from "react";
import {getLatestObstacle} from "../services/Warning/Warning.jsx";
import {useWarning} from "../context/WarningContext";
import {useNavigate} from "react-router-dom";
import MJPEGPlayer from "../MJPEGPlayer/MJPEGPlayer.jsx"; 
import FallModal from "../FallModal/FallModal.jsx";
import user from "../services/Auth/Auth.jsx";

const CameraFeed = () => {
    const lastObstacleId = useRef(null);
    const user_id = localStorage.getItem("user_id");
    const walkerId = "walker001";
    const {showWarning} = useWarning();
    const navigate = useNavigate();
    const [dismissedAlertId, setDismissedAlertId] = useState(null);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [warningData, setWarningData] = useState(null);

    const streamUrl1 = " https://ddr-increase-fought-pipeline.trycloudflare.com/?action=stream";
    const streamUrl2 = " https://licking-invited-located-rd.trycloudflare.com/?action=stream"; 

   useEffect(() => {
        if (!user_id) return navigate("/login");
        const interval = setInterval(async () => {
            try {
                const data = await getLatestObstacle(user_id, walkerId);
               if (data.is_detected === 1 && data.obstacle_id !== lastObstacleId.current) {
                    lastObstacleId.current = data.obstacle_id;

    // obstacle_type ni tozalash (stringdan massivga aylantirish)
    let obstacleClean;
    try {
        obstacleClean = JSON.parse(data.obstacle_type.replace(/'/g, '"'));
    } catch {
        obstacleClean = [data.obstacle_type]; 
    }

    showWarning({
        alert_level: data.alert_level,
        obstacle_type: obstacleClean,
        risk_score: data.risk_score,
        obstacle_id: data.obstacle_id,
    });
}
            } catch (err) {
                console.error("Obstacle error:", err);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [user_id]);

    const handlePreviousClick = () => navigate("/map");
    const handleNextClick = () => navigate("/");

       const getFallAlert = async () => {
            try {
                const fallAlert = await user.getWarning(user_id, walkerId);

        // console.log("Alert ID from server:", fallAlert?.alert_id);
        console.log(fallAlert)
        if (
            fallAlert?.fall_detected &&
            fallAlert?.alert_id !== null &&
            Number(fallAlert.alert_id) !== Number(localStorage.getItem("dismissedAlertId"))
        ) {
            setWarningData(fallAlert);
            setIsModalOpen2(true);
        } else {
            // console.log("No new fall alert or already dismissed.");
        }
    } catch (error) {
        console.error("Error fetching fall alert:", error);
    }
};


  useEffect(() => {
    const saved = localStorage.getItem("dismissedAlertId");
    if (saved) {
        setDismissedAlertId(Number(saved));
    }

    const interval = setInterval(() => {
        getFallAlert();
    }, 1000); 

    return () => clearInterval(interval);
}, [user_id, walkerId ]); // Faqat user_id va walkerId ga bog‘liq


   const handleCloseModal = () => {
    setIsModalOpen2(false);
    if (warningData?.alert_id !== null) {
        const alertId = Number(warningData.alert_id);
        localStorage.setItem("dismissedAlertId", alertId);
        console.log("Dismissed alert ID saved:", alertId);
        console.log(warningData.timestamp)
        setDismissedAlertId(alertId); // baribir ishlaydi, lekin bu second layer
    }
};


    return (
        <div className="w-[1280px] h-[800px] flex flex-col m-auto justify-center">
            <div className="flex justify-between gap-4 px-2">
                <MJPEGPlayer streamUrl={streamUrl1} />
                <MJPEGPlayer streamUrl={streamUrl2} />
            </div>

            <div className="flex items-center justify-between p-1 mt-4">
                <button
                    onClick={handlePreviousClick}
                    className="flex items-center justify-center rounded-full w-[100px] h-[100px] bg-[#E2E2E2]"
                >
                    <img className="w-[60px]" src="/images/previousImg.png" alt="previous" />
                </button>
                <button
                    onClick={handleNextClick}
                    className="flex items-center justify-center rounded-full w-[100px] h-[100px] bg-[#E2E2E2]"
                >
                    <img className="w-[60px]" src="/images/nextLogo.png" alt="next" />
                </button>
            </div>
                   {isModalOpen2 && (
                
       <FallModal
        obstacleType={warningData.timestamp}
        obstacleId={warningData.alert_id}
        onClose={handleCloseModal}
        user_id={user_id}
        walker_id={walkerId}
    />
)}

        </div>
    );
};

export default CameraFeed;

