import {useState} from "react";
import previous from "../assets/next.svg";
import nextLogo from "../assets/nextLogo.svg";
import {useNavigate} from "react-router-dom";
import "./index.scss";

function ActivityPage() {
    const [bpm, setBpm] = useState(0);

    const navigate = useNavigate();
    const handlePreviousClick =() => {
        navigate(-1);
    }

    const handleNextClick =() => {
        navigate("/login");
    }

    return(
        <>
            <div className="activity">
                <div className="flex flex-col items-center justify-center activityMainDiv">
                    <div className="w-full h-full bg-white pl-[10px] pr-[10px] pt-[10px] rounded-2xl shadow-lg text-center">
                        <h1 className="text-[60px] font-bold text black">활동시간</h1>
                        <div className="relative flex items-center  m-auto ">
                            <div>
                                <button onClick={handlePreviousClick} className="flex items-center justify-center rounded-full m-auto w-[80px] h-[80px] bg-[#E2E2E2]"><img className={"w-[40px]"} src={previous} alt="previousLogo"/></button>
                            </div>
                            <div className="w-[250px] h-[250px] bg-[#CCF8FE] rounded-full m-auto flex items-center justify-center border-[15px] border-[#02A0FC]">
                                <span className="text-[50px] font-bold text-[#02A0FC]">{bpm}분</span>
                            </div>
                            <div>
                                <button onClick={handleNextClick} className="flex items-center justify-center rounded-full m-auto w-[80px] h-[80px] bg-[#E2E2E2]"><img className={"w-[40px]"} src={nextLogo} alt="previousLogo"/></button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <button className="w-[100px] h-[100px] bg-[#CCF8FE] text-[#02A0FC] text-[35px] border-2 border-[#02A0FC] rounded-full">
                                시작
                            </button>
                            <button className="w-[100px] h-[100px] bg-[#ffffff] border-2 border-[#E2E2E2] rounded-full text-[#E2E2E2] text-[35px]">
                                종료
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )


}

export default ActivityPage