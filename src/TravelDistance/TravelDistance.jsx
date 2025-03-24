import {useState} from "react";
import previous from "../assets/next.svg"
import nextLogo from "../assets/nextLogo.svg"
import {useNavigate} from "react-router-dom";


function TravelDistance() {
    const [bpm, setBpm] = useState(100);
    const navigate = useNavigate();
    const handlePreviousClick =() => {
        navigate(-1);
    }

    const handleNextClick =() => {
        navigate("/about");
    }

    return (
        <div className={"heart"}>
            {/*<h1 className={"font-bold mb-5"}>길벗이</h1>*/}
            <div className="flex flex-col items-center justify-center">
                <div className="bg-white p-6 rounded-2xl shadow-lg w-80 text-center">
                    <h1 className="text-xl font-bold">이동거리</h1>
                    <div className="relative flex items-center  m-auto mt-4">
                        <div>
                            <button onClick={handlePreviousClick} className="flex items-center justify-center rounded-full m-auto w-[40px] h-[40px] bg-[#E2E2E2]"><img className={"w-[20px]"} src={previous} alt="previousLogo"/></button>
                        </div>
                        <div className="w-32 h-32 bg-[#DAD7FE] rounded-full m-auto flex items-center justify-center border-[10px] border-[#4339F2]">
                            <span className="text-2xl font-bold text-[#4339F2]">{bpm}</span>
                        </div>
                        <div>
                            <button onClick={handleNextClick} className="flex items-center justify-center rounded-full m-auto w-[40px] h-[40px] bg-[#E2E2E2]"><img className={"w-[20px]"} src={nextLogo} alt="previousLogo"/></button>
                        </div>
                    </div>
                    <p className="mt-4 flex items-center text-black">
                        <span className="w-4 h-4 bg-[#4339F2] rounded-full inline-block mr-2"></span> KM
                    </p>
                </div>
            </div>
        </div>
    )
}

export default TravelDistance