import {useState} from "react";
import "./index.scss";
import previous from "../assets/next.svg"
import nextLogo from "../assets/nextLogo.svg"
import {useNavigate} from "react-router-dom";


function HeartPercentage() {
    const [bpm, setBpm] = useState(100);
    const navigate = useNavigate();
    const handlePreviousClick =() => {
        navigate(-1);
    }

    const handleNextClick =() => {
        navigate("/activity");
    }

   return (
       <div className={"heart"}>
           {/*<h1 className={"font-bold mb-5"}>길벗이</h1>*/}
           <div className="flex flex-col items-center justify-center">
               <div className="bg-white p-6 rounded-2xl shadow-lg w-80 text-center">
                   <h1 className="text-xl font-bold">심박수</h1>
                   <div className="relative flex items-center  m-auto mt-4">
                       <div>
                           <button onClick={handlePreviousClick} className="flex items-center justify-center rounded-full m-auto w-[40px] h-[40px] bg-[#E2E2E2]"><img className={"w-[20px]"} src={previous} alt="previousLogo"/></button>
                       </div>
                       <div className="w-32 h-32 bg-green-300 rounded-full m-auto flex items-center justify-center border-4 border-green-600">
                           <span className="text-2xl font-bold text-green-700">{bpm}</span>
                       </div>
                       <div>
                           <button onClick={handleNextClick} className="flex items-center justify-center rounded-full m-auto w-[40px] h-[40px] bg-[#E2E2E2]"><img className={"w-[20px]"} src={nextLogo} alt="previousLogo"/></button>
                       </div>
                   </div>
                   <p className="mt-4 flex items-center text-black">
                       <span className="w-4 h-4 bg-green-600 rounded-full inline-block mr-2"></span> BPM
                   </p>
               </div>
           </div>
       </div>
   )
}

export default HeartPercentage