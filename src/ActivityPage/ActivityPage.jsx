import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import "./index.scss";
import activityService from "../services/ActivityTime/Activitytime.jsx";
// import accelerometerService from "../services/ActivityTime/ActivityTime2.jsx"; // 🆕
import accelerometerService from "../services/ActivityTime2/ActivityTime2.jsx";
import {toast} from "react-toastify";
import storage from "../services/storage/index.js";
import {useWarning} from "../context/WarningContext";
import {getLatestObstacle} from "../services/Warning/Warning";

function ActivityPage({walker_id = "walker001"}) {
    const [bpm, setBpm] = useState(0);
    const [isCounting, setIsCounting] = useState(false);
    const intervalRef = useRef(null);
    const navigate = useNavigate();
    const [elapsedTime, setElapsedTime] = useState(0);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    const user_id = storage.get("user_id");
    const walkerId = "walker001";
    const {showWarning} = useWarning();
    const lastObstacleId = useRef(null);

    const startCounting = async () => {
        if (!isCounting) {
            // API chaqiruvni vaqtincha olib tashladik
            console.log("⏱️ Vaqt boshlandi (test rejimi - API yo‘q)");
            setIsCounting(true);
            setBpm(0);
            intervalRef.current = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        }
    };

    const stopCounting = async () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsCounting(false);
            console.log("⛔️ Vaqt to‘xtatildi (test rejimi - API yo‘q)");
            setElapsedTime(0);
        }
    };

    // // 👉 Harakatni boshlash (manual emas, avtomatik chaqiriladi)
    // const startCounting = async () => {
    //     if (!isCounting) {
    //         try {
    //             await activityService.startActivity({
    //                 user_id,
    //                 walker_id,
    //             });
    //             setIsCounting(true);
    //             setBpm(0);
    //             intervalRef.current = setInterval(() => {
    //                 setElapsedTime((prev) => prev + 1);
    //             }, 1000);
    //         } catch (error) {
    //             console.error("Start API error:", error);
    //         }
    //     }
    // };

    // // 👉 Harakatni to‘xtatish (hozircha faqat tugma orqali yoki qo‘lda ishlatiladi)
    // const stopCounting = async () => {
    //     if (intervalRef.current) {
    //         clearInterval(intervalRef.current);
    //         intervalRef.current = null;
    //         setIsCounting(false);
    //         const minutes = Math.floor(elapsedTime / 60);
    //         const seconds = elapsedTime % 60;
    //         try {
    //             await activityService.stopActivity({
    //                 user_id,
    //                 walker_id,
    //                 minutes,
    //                 seconds,
    //             });
    //             setElapsedTime(0);
    //             toast.success("활동시간이 저장되었습니다!");
    //         } catch (error) {
    //             console.error("Stop API error:", error);
    //             toast.error("저장 실패. 다시 시도해주세요.");
    //         }
    //     }
    // };

    // ✅ 1. Avtomatik harakatni aniqlovchi useEffect
    useEffect(() => {
        const THRESHOLD = 1.2; // bu qiymatni siz test qilib o‘zingiz aniqlang
        const movementInterval = setInterval(async () => {
            const result = await accelerometerService.getLatestAccelerometer(user_id, walker_id);
            // console.log("📡 GET javobi:", result);

            if (!result || typeof result.accel_value !== "number") return;

            const {accel_value} = result;
            console.log("📈 accel_value:", accel_value);

            if (accel_value > THRESHOLD && !isCounting) {
                console.log("🚶 Harakat boshlandi (accel_value > threshold)");
                startCounting();
            } else if (accel_value <= THRESHOLD && isCounting) {
                console.log("🛑 Harakat tugadi (accel_value <= threshold)");
                stopCounting();
            }
        }, 2000); // Har 2 sekundda tekshiradi

        return () => clearInterval(movementInterval);
    }, [user_id, isCounting]);
    
    

    // ✅ 2. Obstacle aniqlovchi useEffect (mavjud bo‘lib qoladi)
    useEffect(() => {
        if (!user_id) {
            return navigate("/login");
        }
        const intervalRef = setInterval(async () => {
            try {
                if (!user_id) return;

                const data = await getLatestObstacle(user_id, walkerId);

                if (data.is_detected === 1 && data.obstacle_id !== lastObstacleId.current) {
                    lastObstacleId.current = data.obstacle_id;
                    const obstacleClean = data.obstacle_type.replace(/[\[\]']/g, "");
                    showWarning(obstacleClean, data.obstacle_id);
                }
            } catch (err) {
                console.error("Obstacle error:", err);
            }
        }, 3000);

        return () => {
            clearInterval(intervalRef);
        };
    }, [user_id]);

    const handlePreviousClick = () => {
        navigate("/");
    };
    const handleNextClick = () => {
        navigate("/map");
    };

    return (
        <div className="activity mx-auto">
            <div className="activityMainDiv flex flex-col items-center justify-center">
                <div className="w-full h-full bg-white pl-[10px] pr-[10px] pt-[10px] rounded-2xl shadow-lg text-center">
                    <h1 className="text-[80px] font-bold text black">활동시간</h1>
                    <div className="relative flex items-center m-auto mt-[50px]">
                        <div>
                            <button
                                onClick={handlePreviousClick}
                                className="flex items-center justify-center rounded-full m-auto w-[100px] h-[100px] bg-[#E2E2E2]"
                            >
                                <img className="w-[60px]" src="/images/previousImg.png" alt="previous" />
                            </button>
                        </div>
                        <div className="w-[400px] h-[400px] bg-[#CCF8FE] rounded-full m-auto flex items-center justify-center border-[20px] border-[#02A0FC]">
                            <span className="text-[80px] font-bold text-[#02A0FC]">
                                {minutes}분 {seconds < 10 ? `0${seconds}` : seconds}초
                            </span>
                        </div>
                        <div>
                            <button
                                onClick={handleNextClick}
                                className="flex items-center justify-center rounded-full m-auto w-[100px] h-[100px] bg-[#E2E2E2]"
                            >
                                <img className="w-[60px]" src="/images/nextLogo.png" alt="next" />
                            </button>
                        </div>
                    </div>
                    {/* Tugmalar olib tashlandi */}
                </div>
            </div>
        </div>
    );
}

export default ActivityPage;

// import {useEffect, useRef, useState} from "react";
// import {useNavigate} from "react-router-dom";
// import "./index.scss";
// import activityService from "../services/ActivityTime/Activitytime.jsx";
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
//     const MOVEMENT_THRESHOLD = 0.3;

//     const startCounting = async () => {
//         if (!isCounting) {
//             try {
//                 await activityService.startActivity({
//                     user_id,
//                     walker_id,
//                 });
//                 setIsCounting(true);
//                 setBpm(0);
//                 intervalRef.current = setInterval(() => {
//                     setElapsedTime((prev) => prev + 1); // har 1 sekundda bittaga oshadi
//                 }, 1000);
//             } catch (error) {
//                 console.error("Start API error:", error);
//             }
//         }
//     };

//     const stopCounting = async () => {
//         if (intervalRef.current) {
//             clearInterval(intervalRef.current);
//             intervalRef.current = null;
//             setIsCounting(false);
//             const minutes = Math.floor(elapsedTime / 60);
//             const seconds = elapsedTime % 60;
//             try {
//                 await activityService.stopActivity({
//                     user_id,
//                     walker_id,
//                     minutes,
//                     seconds,
//                 });
//                 setElapsedTime(0);
//                 toast.success("활동시간이 저장되었습니다!");
//             } catch (error) {
//                 console.error("Stop API error:", error);
//                 toast.error("저장 실패. 다시 시도해주세요."); // xato bo'lsa
//             }
//         }
//     };

//     useEffect(() => {
//         const movementInterval = setInterval(async () => {
//             try {
//                 const result = await accelerometerService.getAccelerometer(user_id, walker_id);
//                 if (!result) return;

//                 const {ax, ay, az} = result;
//                 const acceleration = Math.sqrt(ax ** 2 + ay ** 2 + az ** 2);

//                 if (acceleration > MOVEMENT_THRESHOLD && !isCounting) {
//                     console.log("Movement detected. Starting activity...");
//                     startCounting(); // avtomatik chaqiramiz
//                 }
//             } catch (err) {
//                 console.error("Accelerometer polling error:", err);
//             }
//         }, 2000); // har 2 soniyada tekshiradi

//         return () => clearInterval(movementInterval);
//     }, [user_id, isCounting]);

//     useEffect(() => {
//         if (!user_id) {
//             return navigate("/login");
//         }
//         const intervalRef = setInterval(async () => {
//             try {
//                 if (!user_id) return;

//                 const data = await getLatestObstacle(user_id, walkerId);

//                 if (data.is_detected === 1 && data.obstacle_id !== lastObstacleId.current) {
//                     lastObstacleId.current = data.obstacle_id;
//                     const obstacleClean = data.obstacle_type.replace(/[\[\]']/g, "");
//                     showWarning(obstacleClean, data.obstacle_id); // 🟢 Kontekst orqali chiqaramiz
//                 }
//             } catch (err) {
//                 console.error("Obstacle error:", err);
//             }
//         }, 3000);

//         return () => {
//             if (intervalRef.current) {
//                 clearInterval(intervalRef.current);
//             }
//         };
//     }, [user_id]);

//     const handlePreviousClick = () => {
//         navigate("/");
//     };
//     const handleNextClick = () => {
//         navigate("/map");
//     };

//     return (
//         <>
//             <div className="activity mx-auto">
//                 <div className="activityMainDiv flex flex-col items-center justify-center ">
//                     <div className="w-full h-full bg-white pl-[10px] pr-[10px] pt-[10px] rounded-2xl shadow-lg text-center">
//                         <h1 className="text-[80px] font-bold text black">활동시간</h1>
//                         <div className="relative flex items-center  m-auto mt-[50px]">
//                             <div>
//                                 <button
//                                     onClick={handlePreviousClick}
//                                     className="flex items-center justify-center rounded-full m-auto w-[100px] h-[100px] bg-[#E2E2E2]"
//                                 >
//                                     <img className="w-[60px]" src="/images/previousImg.png" alt="previous" />
//                                 </button>
//                             </div>
//                             <div className="w-[400px] h-[400px] bg-[#CCF8FE] rounded-full m-auto flex items-center justify-center border-[20px] border-[#02A0FC]">
//                                 <span className="text-[80px] font-bold text-[#02A0FC]">
//                                     {" "}
//                                     {minutes}분 {seconds < 10 ? `0${seconds}` : seconds}초
//                                 </span>
//                             </div>
//                             <div>
//                                 <button
//                                     onClick={handleNextClick}
//                                     className="flex items-center justify-center rounded-full m-auto w-[100px] h-[100px] bg-[#E2E2E2]"
//                                 >
//                                     <img className="w-[60px]" src="/images/nextLogo.png" alt="next" />
//                                 </button>
//                             </div>
//                         </div>
//                         <div className="flex items-center justify-between">
//                             <button
//                                 className={`w-[150px] h-[150px] border-[10px] rounded-full text-[40px] ${
//                                     isCounting
//                                         ? "bg-[#ffffff] text-[#E2E2E2] border-[#E2E2E2]"
//                                         : "bg-[#CCF8FE] text-[#02A0FC] border-[#02A0FC]"
//                                 }`}
//                                 onClick={startCounting}
//                                 disabled={isCounting}
//                             >
//                                 {isCounting ? "진행중" : "시작"}
//                             </button>
//                             <button
//                                 className="w-[150px] h-[150px] bg-[#ffffff] border-[10px] border-[#E2E2E2] rounded-full text-[#E2E2E2] text-[40px]"
//                                 onClick={stopCounting}
//                                 disabled={!isCounting}
//                             >
//                                 종료
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default ActivityPage;
