import {useEffect, useRef, useState} from "react";
import "./index.scss";
import previousImg from "../assets/previousImg.png";
import nextLogo from "../assets/nextLogo.png";
import {useNavigate} from "react-router-dom";
import storage from "../services/storage/index.js";
import user from "../services/Auth/Auth.jsx";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import dayjs from "dayjs";
import {useWarning} from "../context/WarningContext.jsx";
import {getLatestObstacle} from "../services/Warning/Warning.jsx";
import alarmAudio from "../assets/alarm.mp3";

function HeartPercentage() {
    const [bpm, setBpm] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const user_id = storage.get("user_id");
    const walkerId = "walker001";
    const {showWarning} = useWarning();
    const lastObstacleId = useRef(null);

    const audioRef = useRef(null);

    useEffect(() => {
        if (!user_id) return navigate("/login");

        const interval = setInterval(async () => {
            try {
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

        return () => clearInterval(interval);
    }, [user_id]);
     
    const getUserHeartrate = async (user_id) => {
        try {
            setLoading(true);
            const bpmData = await user.getHeartrate(user_id);
            console.log("BPM data:", bpmData);

            if (Array.isArray(bpmData)) {
                if (bpmData.length > 0) {
                    setBpm(bpmData);
                } else {
                    console.warn("BPM array bo‘sh");
                    setBpm([]);
                }
            } else {
                console.error("BPM ma'lumotlari array formatida emas.");
                setBpm([]);
            }
        } catch (error) {
            console.error("Heart rate olishda xatolik:", error);
            setBpm([]);
        } finally {
            setLoading(false);
        }
    };
      

    // const getUserHeartrate = async (user_id) => {
    //     try {
    //         setLoading(true);
    //         const bpmData = await user.getHeartrate(user_id);
    //         console.log("BPM data:", bpmData);
    //         if (Array.isArray(bpmData) && bpmData.length > 0) {
    //             setBpm(bpmData);
    //             console.log(bpmData);
    //             console.log("Eng oxirgi BPM ma'lumot:", bpmData[0]);
    //         } else {
    //             console.error("BPM ma'lumotlari topilmadi yoki noto‘g‘ri formatda.");
    //         }
    //     } catch (error) {
    //         console.error("Heart rate olishda xatolik:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    useEffect(() => {
        getUserHeartrate(user_id);
    }, [user_id]);

    const handlePreviousClick = () => navigate("/camera");
    const handleNextClick = () => navigate("/activity");

    return (
        <div className={"heart m-auto"}>
            <div className="flex flex-col items-center justify-center HeartMainDiv">
                <div className="w-full bg-white px-6 rounded-2xl shadow-lg text-center">
                    <h1 className="text-[80px] font-bold">심박수</h1>

                    <div className="relative flex items-center justify-between mt-6 mb-4">
                        <button
                            onClick={handlePreviousClick}
                            className="flex items-center justify-center rounded-full w-[100px] h-[100px] bg-[#E2E2E2]"
                        >
                            {/* <img className={"w-[40px]"} src={previousImg} alt="myImage" /> */}
                            <img className="w-[60px]" src="/images/previousImg.png" alt="previous" />
                        </button>

                        <div className="mx-4 w-[400px] h-[400px] bg-[#E2FBD7] rounded-full flex items-center justify-center border-[20px] border-green-600">
                            <span className="text-[80px] font-bold text-green-700">
                                {loading ? "Loading..." : bpm?.[0]?.heartrate ?? "N/A"}
                            </span>
                        </div>

                        <button
                            onClick={handleNextClick}
                            className="flex items-center justify-center rounded-full w-[100px] h-[100px] bg-[#E2E2E2]"
                        >
                            {/* <img className={"w-[40px]"} src={nextLogo} alt="myImage" /> */}
                            <img className="w-[60px]" src="/images/nextLogo.png" alt="next" />
                        </button>
                    </div>

                    <p className="mt-[50px] text-black text-[45px] text-left">
                        <span className="w-[40px] h-[40px] bg-green-600 rounded-full inline-block mr-2"></span> BPM
                    </p>
                    <audio ref={audioRef} src={alarmAudio} preload="auto" />

                    {/* 🎵 Audio o‘ynatish tugmasi */}
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={() => {
                                if (audioRef.current) {
                                    audioRef.current.currentTime = 0;
                                    audioRef.current.play().catch((err) => {
                                        console.warn("Audio play error:", err);
                                    });
                                }
                            }}
                            className="px-6 py-3 bg-green-600 text-white rounded-xl text-xl hover:bg-green-700 transition"
                        >
                            ▶️ Ovoz eshittirish
                        </button>
                    </div>

                    {/* 🔘 Chartni ko‘rsatish tugmasi */}
                    <div className="relative top-[-320px] left-0">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="absolute top-[-300px] left-[10px] w-[220px] h-[60px] px-3 py-3 bg-green-600 text-white text-[20px] rounded-xl hover:bg-green-700 transition"
                        >
                            📈 심박수 그래프 보기
                        </button>
                    </div>
                </div>
            </div>

            {/* 📦 Modal */}
            {isModalOpen && (
                <div className="fixed  inset-0 bg-green-50 opacity-100 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-4xl relative top-[-25%]">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-3 right-3 text-xl font-bold text-gray-500 hover:text-black"
                        >
                            ×
                        </button>
                        <h2 className="text-2xl font-bold text-center mb-4">심박수 그래프</h2>
                        {loading ? (
                            <p className="text-center">Yuklanmoqda...</p>
                        ) : (
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={bpm}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="recorded_at"
                                            tickFormatter={(time) => dayjs(time).format("HH:mm:ss")}
                                        />
                                        <YAxis />
                                        <Tooltip labelFormatter={(time) => dayjs(time).format("YYYY-MM-DD HH:mm:ss")} />
                                        <Line
                                            type="monotone"
                                            dataKey="heartrate"
                                            stroke="#22c55e"
                                            strokeWidth={3}
                                            dot={{r: 4}}
                                            activeDot={{r: 6}}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default HeartPercentage;

// import {useEffect, useRef, useState} from "react";
// import "./index.scss";
// import previous from "../assets/previousImg.png";
// import nextLogo from "../assets/nextLogo.png";
// import {useNavigate} from "react-router-dom";
// import storage from "../services/storage/index.js";
// import user from "../services/Auth/Auth.jsx";
// import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
// import dayjs from "dayjs";
// import {useWarning} from "../context/WarningContext.jsx";
// import {getLatestObstacle} from "../services/Warning/Warning.jsx";

// function HeartPercentage() {
//     const [bpm, setBpm] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();
//     const user_id = storage.get("user_id");
//     const walkerId = "walker001";
//     const {showWarning} = useWarning();
//     const lastObstacleId = useRef(null);

//     useEffect(() => {
//         if (!user_id) {
//             return navigate("/login");
//         }
//         const interval = setInterval(async () => {
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

//         return () => clearInterval(interval);
//     }, [user_id]);

//     const getUserHeartrate = async (user_id) => {
//         try {
//             setLoading(true);
//             const bpmData = await user.getHeartrate(user_id);
//             // const bpmData = response.data;
//             console.log("bpm data", bpmData);

//             console.log("BPM API response:", bpmData);

//             if (Array.isArray(bpmData) && bpmData.length > 0) {
//                 // const sorted = bpmData.sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at));
//                 setBpm(bpmData);
//             } else {
//                 console.error("BPM ma'lumotlari topilmadi yoki noto‘g‘ri formatda.");
//             }
//         } catch (error) {
//             console.error("Heart rate olishda xatolik:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         getUserHeartrate(user_id);
//     }, [user_id]);

//     const handlePreviousClick = () => {
//         navigate("/camera");
//     };

//     const handleNextClick = () => {
//         navigate("/activity");
//     };

//     return (
//         <div className={""}>
//             <div className="flex flex-col m-auto items-center justify-center HeartMainDiv">
//                 <div className="w-full max-w-4xl bg-white px-6 rounded-2xl shadow-lg text-center">
//                     <h1 className="text-[60px] font-bold">심박수</h1>
//                     <div className="relative flex items-center justify-between mt-6 mb-4">
//                         <button
//                             onClick={handlePreviousClick}
//                             className="flex items-center justify-center rounded-full w-[80px] h-[80px] bg-[#E2E2E2]"
//                         >
//                             <img className={"w-[40px]"} src={previous} alt="<" />
//                         </button>

//                         <div className="mx-4 w-[300px] h-[300px] bg-[#E2FBD7] rounded-full flex items-center justify-center border-[15px] border-green-600">
//                             <span className="text-[60px] font-bold text-green-700">
//                                 {loading ? "Loading..." : bpm?.[bpm.length - 1]?.heartrate ?? "N/A"}
//                             </span>
//                             {/* <span className="text-[60px] font-bold text-green-700">
//                                 {loading ? "Loading..." : bpm ?? "N/A"}
//                             </span> */}
//                         </div>

//                         <button
//                             onClick={handleNextClick}
//                             className="flex items-center justify-center rounded-full w-[80px] h-[80px] bg-[#E2E2E2]"
//                         >
//                             <img className={"w-[40px]"} src={nextLogo} alt=">" />
//                         </button>
//                     </div>

//                     <p className="mt-[20px] text-black text-[35px]">
//                         <span className="w-[20px] h-[20px] bg-green-600 rounded-full inline-block mr-2"></span> BPM
//                     </p>

//                     {/* Chart Area */}
//                     <div className="mt-8 h-[300px] w-full">
//                         {loading ? (
//                             <p>Loading chart...</p>
//                         ) : (
//                             <ResponsiveContainer width="100%" height="100%">
//                                 <LineChart data={bpm}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis
//                                         dataKey="recorded_at"
//                                         tickFormatter={(time) => dayjs(time).format("HH:mm:ss")}
//                                     />
//                                     <YAxis />
//                                     <Tooltip labelFormatter={(time) => dayjs(time).format("YYYY-MM-DD HH:mm:ss")} />
//                                     <Line
//                                         type="monotone"
//                                         dataKey="heartrate"
//                                         stroke="#22c55e"
//                                         strokeWidth={3}
//                                         dot={{r: 4}}
//                                         activeDot={{r: 6}}
//                                     />
//                                 </LineChart>
//                             </ResponsiveContainer>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default HeartPercentage;
