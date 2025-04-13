import {useEffect, useRef, useState} from "react";
import previous from "../assets/next.svg";
import nextLogo from "../assets/nextLogo.svg";
import {useNavigate} from "react-router-dom";
import "./index.scss";
import activityService from "../services/ActivityTime/Activitytime.jsx";
import {toast} from "react-toastify";
import storage from "../services/storage/index.js";

function ActivityPage({walker_id = "walker001"}) {
    const [bpm, setBpm] = useState(0);
    const [isCounting, setIsCounting] = useState(false);
    const intervalRef = useRef(null);
    const navigate = useNavigate();
    const [elapsedTime, setElapsedTime] = useState(0);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    const user_id = storage.get("user_id");

    const startCounting = async () => {
        if (!isCounting) {
            try {
                await activityService.startActivity({
                    user_id, walker_id
                });
                setIsCounting(true);
                setBpm(0);
                intervalRef.current = setInterval(() => {
                    setElapsedTime(prev => prev + 1); // har 1 sekundda bittaga oshadi
                }, 1000);
            } catch (error) {
                console.error("Start API error:", error);
            }
        }
    };

    const stopCounting = async () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsCounting(false);
            const minutes = Math.floor(elapsedTime / 60);
            const seconds = elapsedTime % 60;
            try {
                await activityService.stopActivity({
                    user_id, walker_id, minutes, seconds
                });
                setElapsedTime(0)
                toast.success("활동시간이 저장되었습니다!");
            } catch (error) {
                console.error("Stop API error:", error);
                toast.error("저장 실패. 다시 시도해주세요."); // xato bo'lsa
            }
        }
    };


    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);


    const handlePreviousClick = () => {
        navigate(-1);
    }
    const handleNextClick = () => {
        navigate("/travel");

    }

    return (<>
        <div className="activity">
            <div className="activityMainDiv flex flex-col items-center justify-center ">
                <div
                    className="w-full h-full bg-white pl-[10px] pr-[10px] pt-[10px] rounded-2xl shadow-lg text-center">
                    <h1 className="text-[60px] font-bold text black">활동시간</h1>
                    <div className="relative flex items-center  m-auto ">
                        <div>
                            <button onClick={handlePreviousClick}
                                    className="flex items-center justify-center rounded-full m-auto w-[80px] h-[80px] bg-[#E2E2E2]">
                                <img className={"w-[40px]"} src={previous} alt="previousLogo"/></button>
                        </div>
                        <div
                            className="w-[250px] h-[250px] bg-[#CCF8FE] rounded-full m-auto flex items-center justify-center border-[15px] border-[#02A0FC]">
                                <span
                                    className="text-[50px] font-bold text-[#02A0FC]"> {minutes}분 {seconds < 10 ? `0${seconds}` : seconds}초</span>
                        </div>
                        <div>
                            <button onClick={handleNextClick}
                                    className="flex items-center justify-center rounded-full m-auto w-[80px] h-[80px] bg-[#E2E2E2]">
                                <img className={"w-[40px]"} src={nextLogo} alt="previousLogo"/></button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className={`w-[100px] h-[100px] border-2 rounded-full text-[35px] ${isCounting ? "bg-[#ffffff] text-[#E2E2E2] border-[#E2E2E2]" : "bg-[#CCF8FE] text-[#02A0FC] border-[#02A0FC]"}`}
                            onClick={startCounting}
                            disabled={isCounting}>
                            {isCounting ? "진행중" : "시작"}
                        </button>
                        <button
                            className="w-[100px] h-[100px] bg-[#ffffff] border-2 border-[#E2E2E2] rounded-full text-[#E2E2E2] text-[35px]"
                            onClick={stopCounting}
                            disabled={!isCounting}
                        >
                            종료
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </>)


}

export default ActivityPage
