import React, {useEffect, useRef} from "react";
import Hls from "hls.js";
import {getLatestObstacle} from "../services/Warning/Warning.jsx";
import {useWarning} from "../context/WarningContext";
import {useNavigate} from "react-router-dom";
import previous from "../assets/previousImg.png";
import nextLogo from "../assets/nextLogo.png";

const HLSPlayer = ({streamUrl}) => {
    const videoRef = useRef();

    useEffect(() => {
        if (videoRef.current && streamUrl.endsWith(".m3u8")) {
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(streamUrl);
                hls.attachMedia(videoRef.current);
            } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
                videoRef.current.src = streamUrl;
            }
        }
    }, [streamUrl]);

    return (
        <video ref={videoRef} controls autoPlay muted className="w-full h-[400px] object-cover rounded-2xl shadow-md" />
    );
};

const MJPEGPlayer = ({streamUrl}) => {
    return (
        <div className="flex items-center justify-between">
            <img
                src={streamUrl}
                alt="Live MJPEG Stream"
                className="w-[380px] h-[400px] object-cover rounded-2xl shadow-md"
            />
            <img
                src={streamUrl}
                alt="Live MJPEG Stream"
                className="w-[380px] h-[400px] object-cover rounded-2xl shadow-md"
            />
        </div>
    );
};

const CameraFeed = () => {
    const lastObstacleId = useRef(null);
    const userId = localStorage.getItem("user_id");
    const walkerId = "walker001";
    const {showWarning} = useWarning(); // ❗ Kontekstdan foydalanamiz
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                if (!userId) return;

                const data = await getLatestObstacle(userId, walkerId);

                if (data.is_detected === 1 && data.obstacle_id !== lastObstacleId.current) {
                    lastObstacleId.current = data.obstacle_id;
                    const obstacleClean = data.obstacle_type.replace(/[\[\]']/g, "");
                    showWarning(obstacleClean, data.obstacle_id); // 🟢 Kontekst orqali chiqaramiz
                }
            } catch (err) {
                console.error("Obstacle error:", err);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [userId, walkerId, showWarning]);

    const handlePreviousClick = () => {
        navigate("/map");
    };

    const handleNextClick = () => {
        navigate("/login");
    };
    const streamUrl = "http://192.168.0.142:8080/?action=stream";
;

    return (
        <div>
            <div className="relative">
                {streamUrl.endsWith(".m3u8") ? (
                    <HLSPlayer streamUrl={streamUrl} />
                ) : (
                    <MJPEGPlayer streamUrl={streamUrl} />
                )}
            </div>
            <div className="flex items-center justify-between p-1">
                <button
                    onClick={handlePreviousClick}
                    className="flex items-center justify-center rounded-full w-[70px] h-[70px] bg-[#E2E2E2]">
                    <img className={"w-[40px]"} src={previous} alt="previousLogo" />
                </button>
                <button
                    onClick={handleNextClick}
                    className="flex items-center justify-center rounded-full w-[70px] h-[70px] bg-[#E2E2E2]">
                    <img className={"w-[40px]"} src={nextLogo} alt="nextLogo" />
                </button>
            </div>
        </div>
    );
};

export default CameraFeed;

// // import React, {useEffect, useRef, useState} from "react";
// // import Hls from "hls.js";
// // import WarningModal from "../WarningModal/Warningmodal.jsx";
// // import { getLatestObstacle } from '../services/Warning/Warning.jsx'; // Yangi servisni import qilish

// // const HLSPlayer = ({streamUrl}) => {
// //     const videoRef = useRef();

// //     useEffect(() => {
// //         if (videoRef.current && streamUrl.endsWith(".m3u8")) {
// //             if (Hls.isSupported()) {
// //                 const hls = new Hls();
// //                 hls.loadSource(streamUrl);
// //                 hls.attachMedia(videoRef.current);
// //             } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
// //                 videoRef.current.src = streamUrl;
// //             }
// //         }
// //     }, [streamUrl]);

// //     return <video ref={videoRef} controls autoPlay muted className="w-full h-full object-cover" />;
// // };

// // const CameraCard = ({title, streamUrl}) => {
// //     return (
// //         <div className="w-[380px] h-[480px] bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
// //             <div className="bg-gray-200 px-4 py-2 text-center font-semibold text-lg">{title}</div>
// //             <HLSPlayer streamUrl={streamUrl} />
// //         </div>
// //     );
// // };

// // const CameraFeed = () => {
// //     const [obstacle, setObstacle] = useState(null);
// //     const lastObstacleId = useRef(null); // ⏺️ Avvalgi ID'ni eslab qolish uchun
// //      const userId = localStorage.getItem("user_id");
// //      const walkerId = "walker001";
// //      console.log("user id -->", userId, "walker id -->" ,walkerId);

// //      useEffect(() => {
// //          const interval = setInterval(async () => {
// //              try {
// //                  if (!userId) {
// //                      console.warn("❗ user_id not found in localStorage");
// //                      return;
// //                  }

// //                  const data = await getLatestObstacle(userId, walkerId); // API'dan ma'lumot olish

// //                  if (data.is_detected === 1 && data.obstacle_id !== lastObstacleId.current) {
// //                      lastObstacleId.current = data.obstacle_id;
// //                      setObstacle(data.obstacle_type.replace(/[\[\]']/g, ""));
// //                  }
// //              } catch (error) {
// //                  console.error("Error fetching obstacle:", error);
// //              }
// //          }, 300000);

// //          return () => clearInterval(interval);
// //      }, [userId, walkerId]);
// //     const handleClose = () => {
// //         setObstacle(null);
// //     };

// //     return (
// //         <div className="relative">
// //             <div className="flex justify-between items-center pt-[10px] px-[10px] flex-wrap">
// //                 <CameraCard title="Camera 1" streamUrl="http://192.168.0.142:8091/?action=stream" />
// //                 <CameraCard
// //                     title="Camera 2"
// //                     streamUrl="https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"
// //                 />
// //             </div>

// //             {obstacle && <WarningModal obstacleType={obstacle} onClose={handleClose} />}
// //         </div>
// //     );
// // };

// // export default CameraFeed;

// import React, {useEffect, useRef, useState} from "react";
// import Hls from "hls.js";
// import WarningModal from "../WarningModal/Warningmodal.jsx";
// import {getLatestObstacle} from "../services/Warning/Warning.jsx";

// // MJPEG stream uchun
// const MJPEGPlayer = ({streamUrl}) => {
//     return (
//         <div className="flex items-center justify-between">
//             <img
//                 src={streamUrl}
//                 alt="Live MJPEG Stream"
//                 className="w-[380px] h-[480px] object-cover rounded-2xl shadow-md"
//             />
//             <img
//                 src={streamUrl}
//                 alt="Live MJPEG Stream"
//                 className="w-[380px] h-[480px] object-cover rounded-2xl shadow-md"
//             />
//         </div>
//     );
// };

// // HLS (.m3u8) stream uchun
// const HLSPlayer = ({streamUrl}) => {
//     const videoRef = useRef();

//     useEffect(() => {
//         if (videoRef.current && streamUrl.endsWith(".m3u8")) {
//             if (Hls.isSupported()) {
//                 const hls = new Hls();
//                 hls.loadSource(streamUrl);
//                 hls.attachMedia(videoRef.current);
//             } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
//                 videoRef.current.src = streamUrl;
//             }
//         }
//     }, [streamUrl]);

//     return (
//         <video ref={videoRef} controls autoPlay muted className="w-full h-[480px] object-cover rounded-2xl shadow-md" />
//     );
// };

// const CameraFeed = () => {
//     const [obstacle, setObstacle] = useState(null);
//     const lastObstacleId = useRef(null);

//     const userId = localStorage.getItem("user_id");
//     const walkerId = "walker001";
//     console.log("user id -->", userId, "walker id -->", walkerId);

//     useEffect(() => {
//         const interval = setInterval(async () => {
//             try {
//                 if (!userId) {
//                     console.warn("❗ user_id not found in localStorage");
//                     return;
//                 }

//                 const data = await getLatestObstacle(userId, walkerId);

//                 if (data.is_detected === 1 && data.obstacle_id !== lastObstacleId.current) {
//                     lastObstacleId.current = data.obstacle_id;
//                     setObstacle(data.obstacle_type.replace(/[\[\]']/g, ""));
//                 }
//             } catch (error) {
//                 console.error("Error fetching obstacle:", error);
//             }
//         }, 3000);

//         return () => clearInterval(interval);
//     }, [userId, walkerId]);

//     const handleClose = () => {
//         setObstacle(null);
//     };

//     const streamUrl = "http://192.168.0.142:8091/?action=stream"; // Backenddan olingan MJPEG

//     return (
//         <div className="relative">
//             {streamUrl.endsWith(".m3u8") ? <HLSPlayer streamUrl={streamUrl} /> : <MJPEGPlayer streamUrl={streamUrl} />}

//             {obstacle && <WarningModal obstacleType={obstacle} onClose={handleClose} />}
//         </div>
//     );
// };

// export default CameraFeed;
