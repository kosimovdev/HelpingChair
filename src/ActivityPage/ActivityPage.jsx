/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import accelerometerService from "../services/ActivityTime2/ActivityTime2.jsx";
import { toast } from "react-toastify";

function ActivityPage({ walker_id = "walker001" }) {
    const [elapsedTime, setElapsedTime] = useState(0); // Umumiy hisob
    const [isCounting, setIsCounting] = useState(false);
    const intervalRef = useRef(null);
    const lastTimestamp = useRef(null); // Takroriy timestampni oldini olish
    const navigate = useNavigate();
    const user_id = localStorage.getItem("user_id");

    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;

    // Tugmalar
    const handlePreviousClick = () => navigate("/heart");
    const handleNextClick = () => navigate("/map");

    // 종료 tugmasi (faqat timerni to‘xtatadi)
    // const stopTimer = () => {
    //     if (intervalRef.current) {
    //         clearInterval(intervalRef.current);
    //         intervalRef.current = null;
    //     }
    //     setIsCounting(false);
    //     toast.info("활동시간이 일시정지 되었습니다!");
    // };

    // 🔄 Reset tugmasi (0 ga qaytarish)
    const resetTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setElapsedTime(0);
        setIsCounting(false);
        toast.success("활동시간이 초기화 되었습니다!");
    };

    // ✅ is_moving bo‘yicha avtomatik hisoblash
    useEffect(() => {
        const THRESHOLD = 1; // test uchun threshold
        const movementInterval = setInterval(async () => {
            try {
                const result = await accelerometerService.getLatestAccelerometer(user_id, walker_id);
                if (!result || typeof result.is_moving !== "number") return;

                // Timestamp tekshirish
                if (result.timestamp && result.timestamp === lastTimestamp.current) return;
                lastTimestamp.current = result.timestamp;

                const { is_moving } = result;

                if (is_moving >= THRESHOLD) {
                    // Harakat boshlangan yoki davom etmoqda
                    if (!isCounting) {
                        setIsCounting(true);
                        intervalRef.current = setInterval(() => {
                            setElapsedTime(prev => prev + 1);
                        }, 1000);
                    }
                } else if (is_moving <= 0) {
                    // Harakat to‘xtadi, hisobni saqlab turish
                    if (isCounting) {
                        setIsCounting(false);
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        }
                        toast.info("활동시간이 일시정지 되었습니다!");
                    }
                }
            } catch (err) {
                console.error("Accelerometer error:", err);
            }
        }, 1000); // har 1 soniyada tekshiradi

        return () => clearInterval(movementInterval);
    }, [user_id, isCounting, walker_id]);

    return (
        <div className="activity mx-auto">
            <div className="activityMainDiv flex flex-col items-center justify-center">
                <div className="w-full h-full bg-white pl-[10px] pr-[10px] pt-[10px] rounded-2xl shadow-lg text-center">
                    <h1 className="text-[80px] font-bold text-black">활동시간</h1>

                    <div className="relative flex items-center m-auto mt-[50px]">
                        {/* 이전 */}
                        <div>
                            <button
                                onClick={handlePreviousClick}
                                className="flex items-center justify-center rounded-full m-auto w-[100px] h-[100px] bg-[#E2E2E2]"
                            >
                                <img className="w-[60px]" src="/images/previousImg.png" alt="previous" />
                            </button>
                        </div>

                        {/* Timer */}
                        <div className="relative w-[400px] h-[400px] bg-[#CCF8FE] rounded-full m-auto flex flex-col items-center justify-center border-[20px] border-[#02A0FC]">
                            <span className="text-[80px] font-bold text-[#02A0FC]">
                                {minutes}분 {seconds < 10 ? `0${seconds}` : seconds}초
                            </span>

                            {/* 종료 tugmasi
                            {isCounting && (
                                <button
                                    onClick={stopTimer}
                                    className="mt-6 px-6 py-3 bg-red-500 text-white font-bold rounded-2xl shadow-lg hover:bg-red-600"
                                >
                                    종료
                                </button>
                            )} */}

                            {/* 🔄 Reset tugmasi */}
                           <div className="absolute bottom-[-150px]">
                             <button
                                onClick={resetTimer}
                                className=" px-[55px] text-[27px] py-5 bg-gray-500 text-white font-bold rounded-[25px] shadow-lg hover:bg-gray-600"
                            >
                                초기화
                            </button>
                           </div>
                        </div>

                        {/* 다음 */}
                        <div>
                            <button
                                onClick={handleNextClick}
                                className="flex items-center justify-center rounded-full m-auto w-[100px] h-[100px] bg-[#E2E2E2]"
                            >
                                <img className="w-[60px]" src="/images/nextLogo.png" alt="next" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActivityPage;











// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./index.scss";
// import accelerometerService from "../services/ActivityTime2/ActivityTime2.jsx";
// import { toast } from "react-toastify";

// function ActivityPage({ walker_id = "walker001" }) {
//     const [elapsedTime, setElapsedTime] = useState(0); // Umumiy hisob
//     const [isCounting, setIsCounting] = useState(false);
//     const intervalRef = useRef(null);
//     const lastTimestamp = useRef(null); // Takroriy timestampni oldini olish
//     const navigate = useNavigate();
//     const user_id = localStorage.getItem("user_id");

//     const minutes = Math.floor(elapsedTime / 60);
//     const seconds = elapsedTime % 60;

//     // Tugmalar
//     const handlePreviousClick = () => navigate("/heart");
//     const handleNextClick = () => navigate("/map");

//     // ⏱️ 종료 tugmasi (faqat timerni to‘xtatadi, backendga yubormaydi)
//     // const stopTimer = () => {
//     //     if (intervalRef.current) {
//     //         clearInterval(intervalRef.current);
//     //         intervalRef.current = null;
//     //     }
//     //     setIsCounting(false);
//     //     toast.info("활동시간이 일시정지 되었습니다!");
//     // };

//     // ✅ is_moving bo‘yicha avtomatik hisoblash
//     useEffect(() => {
//         const THRESHOLD = 1; // test uchun threshold
//         const movementInterval = setInterval(async () => {
//             try {
//                 const result = await accelerometerService.getLatestAccelerometer(user_id, walker_id);
//                 if (!result || typeof result.is_moving !== "number") return;

//                 // Timestamp tekshirish
//                 if (result.timestamp && result.timestamp === lastTimestamp.current) return;
//                 lastTimestamp.current = result.timestamp;

//                 const { is_moving } = result;

//                 if (is_moving >= THRESHOLD) {
//                     // Harakat boshlangan yoki davom etmoqda
//                     if (!isCounting) {
//                         setIsCounting(true);
//                         intervalRef.current = setInterval(() => {
//                             setElapsedTime(prev => prev + 1);
//                         }, 1000);
//                     }
//                 } else if (is_moving <= 0) {
//                     // Harakat to‘xtadi, hisobni saqlab turish
//                     if (isCounting) {
//                         setIsCounting(false);
//                         if (intervalRef.current) {
//                             clearInterval(intervalRef.current);
//                             intervalRef.current = null;
//                         }
//                         toast.info("활동시간이 일시정지 되었습니다!");
//                     }
//                 }
//             } catch (err) {
//                 console.error("Accelerometer error:", err);
//             }
//         }, 1000); // har 1 soniyada tekshiradi

//         return () => clearInterval(movementInterval);
//     }, [user_id, isCounting, walker_id]);

//     return (
//         <div className="activity mx-auto">
//             <div className="activityMainDiv flex flex-col items-center justify-center">
//                 <div className="w-full h-full bg-white pl-[10px] pr-[10px] pt-[10px] rounded-2xl shadow-lg text-center">
//                     <h1 className="text-[80px] font-bold text-black">활동시간</h1>

//                     <div className="relative flex items-center m-auto mt-[50px]">
//                         {/* 이전 */}
//                         <div>
//                             <button
//                                 onClick={handlePreviousClick}
//                                 className="flex items-center justify-center rounded-full m-auto w-[100px] h-[100px] bg-[#E2E2E2]"
//                             >
//                                 <img className="w-[60px]" src="/images/previousImg.png" alt="previous" />
//                             </button>
//                         </div>

//                         {/* Timer */}
//                         <div className="w-[400px] h-[400px] bg-[#CCF8FE] rounded-full m-auto flex flex-col items-center justify-center border-[20px] border-[#02A0FC]">
//                             <span className="text-[80px] font-bold text-[#02A0FC]">
//                                 {minutes}분 {seconds < 10 ? `0${seconds}` : seconds}초
//                             </span>

//                             {/* 종료 tugmasi */}
//                             {/* {isCounting && (
//                                 <button
//                                     onClick={stopTimer}
//                                     className="mt-6 px-6 py-3 bg-red-500 text-white font-bold rounded-2xl shadow-lg hover:bg-red-600"
//                                 >
//                                     종료
//                                 </button>
//                             )} */}
//                         </div>

//                         {/* 다음 */}
//                         <div>
//                             <button
//                                 onClick={handleNextClick}
//                                 className="flex items-center justify-center rounded-full m-auto w-[100px] h-[100px] bg-[#E2E2E2]"
//                             >
//                                 <img className="w-[60px]" src="/images/nextLogo.png" alt="next" />
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ActivityPage;




// import {useEffect, useRef, useState} from "react";
// import {useNavigate} from "react-router-dom";
// import "./index.scss";
// // import activityService from "../services/ActivityTime/Activitytime.jsx";
// // import accelerometerService from "../services/ActivityTime/ActivityTime2.jsx"; // 🆕
// import accelerometerService from "../services/ActivityTime2/ActivityTime2.jsx";
// import {toast} from "react-toastify";
// import storage from "../services/storage/index.js";
// import {useWarning} from "../context/WarningContext";
// import {getLatestObstacle} from "../services/Warning/Warning";

// function ActivityPage({walker_id = "walker001"}) {
//     const [bpm, setBpm] = useState(0);
//     const [isCounting, setIsCounting] = useState(false);
//     const intervalRef = useRef(null);
//     const navigate = useNavigate();
//     const [elapsedTime, setElapsedTime] = useState(0);
//     const minutes = Math.floor(elapsedTime / 60);
//     const seconds = elapsedTime % 60;
//     const user_id = storage.get("user_id");
//     const walkerId = "walker001";
//     const {showWarning} = useWarning();
//     const lastObstacleId = useRef(null);

//     const startCounting = async () => {
//         if (!isCounting) {
//             // API chaqiruvni vaqtincha olib tashladik
//             console.log("⏱️ Vaqt boshlandi (test rejimi - API yo‘q)");
//             toast.success("활동시간이 시작되었습니다!");
//             setIsCounting(true);
//             setBpm(0);
//             intervalRef.current = setInterval(() => {
//                 setElapsedTime((prev) => prev + 1);
//             }, 1000);
//         }
//     };

//     const stopCounting = async () => {
//         if (intervalRef.current) {
//             clearInterval(intervalRef.current);
//             intervalRef.current = null;
//             setIsCounting(false);
//             toast.success("활동시간이 저장되었습니다!");
//             console.log("⛔️ Vaqt to‘xtatildi (test rejimi - API yo‘q)");
//             setElapsedTime(0);
//         }
//     };


// // ⬇️ yuqoriga qo‘shib qo‘ying
// const lastTimestamp = useRef(null);

// // ✅ Avtomatik harakatni aniqlovchi useEffect
// useEffect(() => {
//     const THRESHOLD = 1;
//     const movementInterval = setInterval(async () => {
//         const result = await accelerometerService.getLatestAccelerometer(user_id, walker_id);

//         if (!result || typeof result.is_moving !== "number") return;

//         // 🔑 Yangi timestamp tekshirish
//         if (result.timestamp && result.timestamp === lastTimestamp.current) {
//             console.log("Timestamp", result.timestamp);
//             return;
//         }
//         lastTimestamp.current = result.timestamp; // yangilash

//         const {is_moving} = result;
//         console.log("Timestamp --->", result.timestamp);

//         if (is_moving >= THRESHOLD && !isCounting) {
//             console.log("🚶 Harakat boshlandi (is_moving=1)");
//             toast.success("활동시간이 시작되었습니다!");
//             startCounting();
//         } else if (is_moving <= 0 && isCounting) {
//             console.log("🛑 Harakat tugadi (is_moving=0)");
//             toast.success("활동시간이 저장되었습니다!");
//             stopCounting();
//         }
//     }, 2000);

//     return () => clearInterval(movementInterval);
// }, [user_id, isCounting]);


   


//         // ✅ 2. 장애물 감지 aniqlovchi useEffect
//      useEffect(() => {
//         if (!user_id) return navigate("/login");
//         //  getUserHeartrate(user_id);
//         const interval = setInterval(async () => {
//             try {
//                 const data = await getLatestObstacle(user_id, walkerId);
//                if (data.is_detected === 1 && data.obstacle_id !== lastObstacleId.current) {
//                     lastObstacleId.current = data.obstacle_id;

//     // obstacle_type ni tozalash (stringdan massivga aylantirish)
//     let obstacleClean;
//     try {
//         obstacleClean = JSON.parse(data.obstacle_type.replace(/'/g, '"'));
//     } catch {
//         obstacleClean = [data.obstacle_type]; 
//     }

//     showWarning({
//         alert_level: data.alert_level,
//         obstacle_type: obstacleClean,
//         risk_score: data.risk_score,
//         obstacle_id: data.obstacle_id,
//     });
// }
//             } catch (err) {
//                 console.error("Obstacle error:", err);
//             }
//         }, 3000);

//         return () => clearInterval(interval);
//     }, [user_id]);


//     const handlePreviousClick = () => {
//         navigate("/heart");
//     };
//     const handleNextClick = () => {
//         navigate("/map");
//     };

//     return (
//         <div className="activity mx-auto">
//             <div className="activityMainDiv flex flex-col items-center justify-center">
//                 <div className="w-full h-full bg-white pl-[10px] pr-[10px] pt-[10px] rounded-2xl shadow-lg text-center">
//                     <h1 className="text-[80px] font-bold text black">활동시간</h1>
//                     <div className="relative flex items-center m-auto mt-[50px]">
//                         <div>
//                             <button
//                                 onClick={handlePreviousClick}
//                                 className="flex items-center justify-center rounded-full m-auto w-[100px] h-[100px] bg-[#E2E2E2]"
//                             >
//                                 <img className="w-[60px]" src="/images/previousImg.png" alt="previous" />
//                             </button>
//                         </div>
//                         <div className="w-[400px] h-[400px] bg-[#CCF8FE] rounded-full m-auto flex items-center justify-center border-[20px] border-[#02A0FC]">
//                             <span className="text-[80px] font-bold text-[#02A0FC]">
//                                 {minutes}분 {seconds < 10 ? `0${seconds}` : seconds}초
//                             </span>            
//                         </div>
//                         <div>
//                             <button
//                                 onClick={handleNextClick}
//                                 className="flex items-center justify-center rounded-full m-auto w-[100px] h-[100px] bg-[#E2E2E2]"
//                             >
//                                 <img className="w-[60px]" src="/images/nextLogo.png" alt="next" />
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ActivityPage;






