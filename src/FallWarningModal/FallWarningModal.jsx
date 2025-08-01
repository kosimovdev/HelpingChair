// import React, { useEffect, useRef, useState } from "react";
// import WarningModal from "../WarningModal/Warningmodal.jsx";
// import { checkFallAlert, sendFallAlert } from "../services/Warning/FallAlert.jsx";
// import storage from "../services/storage/index.js"; // sizda bor, `get("user_id")` ishlatyapti

// const FallWarningWatcher = () => {
//     const user_id = storage.get("user_id");
//     const walker_id = "walker001";
//     const [showModal, setShowModal] = useState(false);
//     const [obstacleData, setObstacleData] = useState(null);
//     const timeoutRef = useRef(null);
//     const lastFallId = useRef(null); // oldingi fall alert ID

//     useEffect(() => {
//         if (!user_id) return;

//         const intervalId = setInterval(async () => {
//             const result = await checkFallAlert();
//             if (
//                 result?.fall_detected &&
//                 result.fall_id !== lastFallId.current // faqat yangi warningda
//             ) {
//                 lastFallId.current = result.fall_id;

//                 const fallData = {
//                     obstacle_id: result.fall_id,
//                     obstacle_type: "낙상 감지", // yoki boshqa type
//                     detection_time: result.timestamp,
//                 };

//                 setObstacleData(fallData);
//                 setShowModal(true);

//                 // 1 daqiqada tugma bosilmasa fallback POST
//                 timeoutRef.current = setTimeout(() => {
//                     sendFallAlert({
//                         user_id,
//                         walker_id,
//                         ...fallData,
//                     });
//                     setShowModal(false);
//                 }, 60_000);
//             }
//         }, 5000); // har 5s da tekshir

//         return () => {
//             clearInterval(intervalId);
//             clearTimeout(timeoutRef.current);
//         };
//     }, [user_id]);

//     const handleClose = () => {
//         setShowModal(false);
//         clearTimeout(timeoutRef.current);
//     };

//     return (
//         <>
//             {showModal && obstacleData && (
//                 <WarningModal
//                     obstacleType={obstacleData.obstacle_type}
//                     onClose={handleClose}
//                 />
//             )}
//         </>
//     );
// };

// export default FallWarningWatcher;
