import { useEffect, useRef } from "react";
import stopPng from "../assets/stopWarning.png";
import cautionPng from "../assets/cautionWarning.png";
import slowPng from "../assets/slowWarning.png";
import stopAlarm from "../assets/alarm.mp3";
// import stopAlarm from "../assets/stopAlarm.mp3";
import slowAlarm from "../assets/slowAlarm.mp3";
import cautionAlarm from "../assets/cautionAlarm.mp3";

const WarningModal = ({ obstacle, onClose }) => {
    const audioRef = useRef(null);
    const timeoutRef = useRef(null); // <-- Timeout ref
    const { alert_level, obstacle_type } = obstacle;

    // alert_level ga qarab audio tanlash
    const getAudioByLevel = () => {
        switch (alert_level) {
            case "STOP":
                return stopAlarm;
            case "CAUTION":
                return cautionAlarm;
            case "SLOW":
                return slowAlarm;
            default:
                return null;
        }
    };

    useEffect(() => {
        const sound = getAudioByLevel();
        if (sound && audioRef.current) {
            audioRef.current.src = sound;
            audioRef.current.play().catch((err) =>
                console.warn("Autoplay blocklandi:", err)
            );
        }

        // 5 sekunddan keyin avtomatik yopish
        timeoutRef.current = setTimeout(() => {
            onClose();
        }, 3000);

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [alert_level, onClose]);

    const formatObstacleType = (value) => {
        if (!value) return "알 수 없음";
        const mapping = {
            person: "사람",
            car: "차",
            bus: "버스",
            truck: "트럭",
            bicycle: "자전거",
            motorcycle: "오토바이",
            "Traffic Light": "신호등",
            bollard: "기둥",
            bollardbollardbollard: "기둥",
            upperbody: "사람 접근중",
        };
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                return parsed.map((item) => mapping[item] || item).join(", ");
            }
            return mapping[parsed] || parsed;
        } catch {
            return mapping[value] || value;
        }
    };

    const getMessageByLevel = () => {
        switch (alert_level) {
            case "STOP":
                return "즉시 정지 - 위험!";
            case "SLOW":
                return "속도 감소 - 주의 필요";
            case "CAUTION":
                return "주의 - 장애물 감지됨";
            default:
                return "안전 상태";
        }
    };

    const getImageByLevel = () => {
        switch (alert_level) {
            case "STOP":
                return stopPng;
            case "CAUTION":
                return cautionPng;
            case "SLOW":
                return slowPng;
            default:
                return null;
        }
    };

    const getLevelStyle = () => {
        switch (alert_level) {
            case "STOP":
                return { backgroundColor: "#ea0000", color: "white" };
            case "CAUTION":
                return { backgroundColor: "#ffea00", color: "black" };
            case "SLOW":
                return { backgroundColor: "#ff6600", color: "white" };
            default:
                return { backgroundColor: "green", color: "white" };
        }
    };

    if (alert_level === "NORMAL") return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <audio ref={audioRef}  loop />
            <div
                style={{
                    width: "600px",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "20px",
                    textAlign: "center",
                }}
            >
                <h2
                    style={{
                        fontSize: "30px",
                        fontWeight: "bold",
                        padding: "10px 20px",
                        borderRadius: "15px",
                        animation: "blink 1s infinite",
                        backgroundColor:
                            alert_level === "STOP"
                                ? "#ea0000"
                                : alert_level === "CAUTION"
                                ? "#ffea00"
                                : alert_level === "SLOW"
                                ? "#ff6600"
                                : "green",
                        color: alert_level === "CAUTION" ? "black" : "white",
                    }}
                >
                    위험 경고
                </h2>

                <style>
                    {` @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.3; }100% { opacity: 1; }}`}
                </style>

                <img
                    src={getImageByLevel()}
                    alt="warning"
                    style={{ width: "230px", height: "200px", margin: "20px auto" }}
                />

                <div
                    style={{
                        ...getLevelStyle(),
                        padding: "15px",
                        borderRadius: "15px",
                        marginBottom: "20px",
                        fontSize: "22px",
                    }}
                >
                    🚨 {getMessageByLevel()}
                    <br />
                    장애물 타입: {formatObstacleType(obstacle_type)}
                </div>

                <button
                    onClick={onClose}
                    style={{
                        width: "100%",
                        padding: "12px",
                        fontSize: "25px",
                        backgroundColor: "#2859eb",
                        borderRadius: "15px",
                        cursor: "pointer",
                        color: "#fff",
                    }}
                >
                    알람 종료
                </button>
            </div>
        </div>
    );
};

export default WarningModal;



// import { useEffect, useRef } from "react";
// import stopPng from "../assets/stopWarning.png";
// import cautionPng from "../assets/cautionWarning.png";
// import slowPng from "../assets/slowWarning.png";
// import alarmSound from "../assets/alarm.mp3";

// const WarningModal = ({ obstacle, onClose }) => {
//     const audioRef = useRef(null);
//     const { alert_level, obstacle_type, risk_score } = obstacle;
//     console.log("obstacle full -->", obstacle);
//     console.log("obstacle type:", obstacle_type , alert_level, risk_score);

//     useEffect(() => {
//         if (alert_level && alert_level !== "NORMAL" && audioRef.current) {
//             console.log("Playing alarm sound for alert level:", alert_level);
//             audioRef.current.play().catch((err) => {
//                 console.error("Audio play error:", err);
//             });
//         }

//         return () => {
//             if (audioRef.current) {
//                 audioRef.current.pause();
//                 audioRef.current.currentTime = 0;
//             }
//         };
//     }, [alert_level]);


//             // obstacle_type ni koreys tiliga o‘girib berish
//     // obstacle_type ni koreys tiliga o‘girib berish
//     const formatObstacleType = (value) => {
//         if (!value) return "알 수 없음";

//         const mapping = {
//             person: "사람",
//             car: "차",
//             bus: "버스",
//             truck: "트럭",
//             bicycle: "자전거",
//             motorcycle: "오토바이",
//             "Traffic Light": "신호등",
//             bollard: "기둥",
//             upperbody: "사람 접근중",
//         };

//         try {
//             const parsed = JSON.parse(value); // masalan "['Truck']"
//             if (Array.isArray(parsed)) {
//                 return parsed.map((item) => mapping[item] || item).join(", ");
//             }
//             return mapping[parsed] || parsed;
//         } catch {
//             return mapping[value] || value; // oddiy string bo‘lsa
//         }
//     };

//     const getMessageByLevel = () => {
//         switch (alert_level) {
//             case "STOP":
//                 return "즉시 정지 - 위험!";
//             case "SLOW":
//                 return "속도 감소 - 주의 필요";
//             case "CAUTION":
//                 return "주의 - 장애물 감지됨";
//             default:
//                 return "안전 상태";
//         }
//     };

//      const getImageByLevel = () => {
//         switch (alert_level) {
//             case "STOP":
//                 return stopPng;
//             case "CAUTION":
//                 return cautionPng;
//             case "SLOW":
//                 return slowPng;
//             default:
//                 return null;
//         }
//     };

//     // UI ranglarini belgilash
//     const getLevelStyle = () => {
//         switch (alert_level) {
//             case "STOP":
//                 return { backgroundColor: "#ea0000", color: "white" };
//             case "CAUTION":
//                 return { backgroundColor: "#ffea00", color: "black" };
//             case "SLOW":
//                 return { backgroundColor: "#ff6600", color: "white" };
//             default:
//                 return { backgroundColor: "green", color: "white" };
//         }
//     };

//     if (alert_level === "NORMAL") return null;

//     return (
//         <div
//             style={{
//                 position: "fixed",
//                 top: 0,
//                 left: 0,
//                 width: "100vw",
//                 height: "100%",
//                 backgroundColor: "rgba(0, 0, 0, 0.5)",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 zIndex: 1000,
//             }}
//         >
//             <audio ref={audioRef} src={alarmSound} loop />
//             <div
//                 style={{
//                     width: "600px",
//                     backgroundColor: "white",
//                     borderRadius: "12px",
//                     padding: "20px",
//                     textAlign: "center",
//                 }}
//             >
//            <h2
//   style={{
//     fontSize: "30px",
//     fontWeight: "bold",
//     padding: "10px 20px",
//     borderRadius: "15\px",
//     animation: "blink 1s infinite",
//     backgroundColor:
//       alert_level === "STOP"
//         ? "#ea0000"
//         : alert_level === "CAUTION"
//         ? "#ffea00"
//         : alert_level === "SLOW"
//         ? "#ff6600"
//         : "green",
//     color: alert_level === "CAUTION" ? "black" : "white", // sariqda qora text bo‘lsin
// }}>
//   위험 경고
// </h2>

//    <style> {` @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.3; }100% { opacity: 1; }}`} </style>

//                 <img src={getImageByLevel()} alt="warning" style={{ width: "230px", height:"200px" , margin: "20px auto" }} />

//                 <div
//                     style={{
//                         ...getLevelStyle(),
//                         padding: "15px",
//                         borderRadius: "15px",
//                         marginBottom: "20px",
//                         fontSize: "22px",
//                     }}
//                 >
//                      🚨 {getMessageByLevel()}
//                     <br />
//                     장애물 타입: {formatObstacleType(obstacle_type)}
//                     <br />
//                     {/* Risk Score: {risk_score} */}
//                 </div>

//                 <button
//                     onClick={onClose}
//                     style={{
//                         width: "100%",
//                         padding: "12px",
//                         fontSize: "25px",
//                         backgroundColor: "#2859eb",
//                         // border: "1px dashed #888",
//                         borderRadius: "15px",
//                         cursor: "pointer",
//                         color: "#fff",
//                     }}
//                 >
//                     알람 종료
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default WarningModal;



