import {useEffect, useRef} from "react";
import warningPng from "../assets/warning.png";
import alarmSound from "../assets/alarm.mp3";

const WarningModal = ({obstacleType, onClose}) => {
    const audioRef = useRef(null);
    console.log("kamji" , obstacleType)

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play().catch((err) => {
                console.error("Audio play error:", err);
            });
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    return (
        <div
            style={{
                position: "fixed",
                top: "0px",
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
            <audio ref={audioRef} src={alarmSound} loop />
            <div
                style={{
                    width: "600px",
                    height: "auto",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "20px",
                    paddingBottom: "30px",
                    textAlign: "center",
                }}
            >
                <h2 style={{fontSize: "30px", fontWeight: "bold"}}>위험 경고</h2>

                <div style={{margin: "0 auto"}}>
                    <img src={warningPng} alt="warning" style={{width: "250px", height: "200px", margin: "0 auto"}} />
                </div>
             
                <div
                    style={{
                        backgroundColor: "#FFF600",
                        padding: "10px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        fontSize: "26px",
                        marginTop: "10px",
                    }}
                >
                    장애물 감지 ({obstacleType})
                </div>

                <button
                    onClick={onClose}
                    style={{
                        width: "100%",
                        padding: "10px",
                        fontSize: "16px",
                        backgroundColor: "#e0e0e0",
                        border: "1px dashed #888",
                        borderRadius: "8px",
                        cursor: "pointer",
                    }}
                >
                    알람 종료 salom
                </button>
            </div>
        </div>
    );
};

export default WarningModal;

