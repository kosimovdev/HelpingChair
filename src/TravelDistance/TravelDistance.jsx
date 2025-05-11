import {useState} from "react";
import previous from "../assets/previousImg.png";
import nextLogo from "../assets/nextLogo.png";
import {useNavigate} from "react-router-dom";
import "./index.scss";

function TravelDistance() {
    const [bpm, setBpm] = useState(100);
    const navigate = useNavigate();
    const handlePreviousClick = () => {
        navigate(-1);
    };

    const handleNextClick = () => {
        navigate("/camera");
    };

    return (
        <div className="travel">
            <div className="flex flex-col items-center justify-center">
                <div className="TravelMainDiv bg-white p-6 rounded-2xl shadow-lg w-80 text-center">
                    <h1 className="text-[55px] font-bold">이동거리</h1>

                    <div className="relative flex items-center  m-auto mt-4">
                        <div>
                            <button
                                onClick={handlePreviousClick}
                                className="flex items-center justify-center rounded-full m-auto w-[80px] h-[80px] bg-[#E2E2E2]"
                            >
                                <img className={"w-[20px]"} src={previous} alt="previousLogo" />
                            </button>
                        </div>
                        <div className="w-[250px] h-[250px] bg-[#DAD7FE] rounded-full m-auto flex items-center justify-center border-[10px] border-[#4339F2]">
                            <span className="text-[50px] font-bold text-[#4339F2]">{bpm}</span>
                        </div>
                        <div>
                            <button
                                onClick={handleNextClick}
                                className="flex items-center justify-center rounded-full m-auto w-[80px] h-[80px] bg-[#E2E2E2]"
                            >
                                <img className={"w-[20px]"} src={nextLogo} alt="previousLogo" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="mt-4 flex items-center text-black text-[30px]">
                            <span className="w-[30px] h-[30px] bg-[#4339F2] rounded-full inline-block mr-2"></span> KM
                        </p>
                        <button className="w-[100px] h-[100px] bg-[#DAD7FE] border-2 border-[#4339F2] rounded-full text-[#4339F2] text-[35px]">
                            종료
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TravelDistance;
