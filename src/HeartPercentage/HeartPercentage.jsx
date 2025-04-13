import {useEffect, useState} from "react";
import "./index.scss";
import previous from "../assets/next.svg"
import nextLogo from "../assets/nextLogo.svg"
import {useNavigate} from "react-router-dom";
import user from "../services/HeartPercentage/HeartPercentage.jsx";


function HeartPercentage() {
    const [bpm, setBpm] = useState(null);
    const navigate = useNavigate();

    const userId = "123"; // <- bu yerga o'zingizga mos user ID ni qo'ying

    // useEffect(() => {
    //     user.getHeartrate(userId)
    //         .then((response) => {
    //             // Ma'lumot kelganini tekshirib, bpm ni o‘rnatamiz
    //             if (response.data && response.data.bpm) {
    //                 setBpm(response.data.bpm);
    //             } else {
    //                 console.error("BPM topilmadi", response.data);
    //             }
    //         })
    //         .catch((error) => {
    //             console.error("Heart rate olishda xatolik:", error);
    //         });
    // }, [userId]);




    const handlePreviousClick =() => {
        navigate(-1);
    }

    const handleNextClick =() => {
        navigate("/activity");
    }

   return (
       <div className={"heart"}>
           <div className="flex flex-col m-auto items-center justify-center HeartMainDiv">
               <div className="w-full h-full bg-white p-6 rounded-2xl shadow-lg text-center">
                   <h1 className="text-[60px] font-bold">심박수</h1>
                   <div className="relative flex items-center  m-auto mt-4">
                       <div>
                           <button onClick={handlePreviousClick} className="flex items-center justify-center rounded-full m-auto w-[80px] h-[80px] bg-[#E2E2E2]"><img className={"w-[40px]"} src={previous} alt="previousLogo"/></button>
                       </div>
                       <div className="w-[250px] h-[250px] bg-[#E2FBD7] rounded-full m-auto flex items-center justify-center border-[15px] border-green-600">
                           <span className="text-[50px] font-bold text-green-700">{bpm !== null ? bpm : "..."}</span>
                       </div>
                       <div>
                           <button onClick={handleNextClick} className="flex items-center justify-center rounded-full m-auto w-[80px] h-[80px] bg-[#E2E2E2]"><img className={"w-[40px]"} src={nextLogo} alt="previousLogo"/></button>
                       </div>
                   </div>
                   <p className="mt-[40px] flex items-center text-black text-[35px]">
                       <span className="w-[20px] h-[20px] bg-green-600 rounded-full inline-block mr-2"></span> BPM
                   </p>
               </div>
           </div>
       </div>
   )
}

export default HeartPercentage