import {useState} from "react";
import previous from "../assets/next.svg";
import nextLogo from "../assets/nextLogo.svg";
import {useNavigate} from "react-router-dom";

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
            <div className={"heart mt-4"}>
                <div className="flex flex-col items-center justify-center">
                    <div className="bg-white p-6 rounded-2xl shadow-lg w-100 text-center">
                        <h1 className="text-xl font-bold text black">활동시간</h1>
                        <div className="relative flex items-center  m-auto mt-4">
                            <div>
                                <button onClick={handlePreviousClick} className="flex items-center justify-center rounded-full m-auto w-[40px] h-[40px] bg-[#E2E2E2]"><img className={"w-[20px]"} src={previous} alt="previousLogo"/></button>
                            </div>
                            <div className="w-32 h-32 bg-[#CCF8FE] rounded-full m-auto flex items-center justify-center border-4 border-[#02A0FC]">
                                <span className="text-2xl font-bold text-[#02A0FC]">{bpm}분</span>
                            </div>
                            <div>
                                <button onClick={handleNextClick} className="flex items-center justify-center rounded-full m-auto w-[40px] h-[40px] bg-[#E2E2E2]"><img className={"w-[20px]"} src={nextLogo} alt="previousLogo"/></button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <button className="w-[50px] h-[50px] bg-[#CCF8FE] text-[#02A0FC] border-2 border-[#02A0FC] rounded-full">
                                시작
                            </button>
                            <button className="w-[50px] h-[50px] bg-[#ffffff] border-2 border-[#E2E2E2] rounded-full text-[#E2E2E2]">
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