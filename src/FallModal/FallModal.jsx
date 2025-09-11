import { useEffect, useState, useRef } from "react";
import alarmSound from "../assets/fallAlert.mp3"; 
import axios from "axios";
import { toast } from "react-toastify";

const FallModal = ({ obstacleType,  onClose }) => {
  const [countdown, setCountdown] = useState(10);
  const audioRef = useRef(null);
  const hasPostedRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // 🔊 Audio chalish
    if (audioRef.current) {
      audioRef.current.play().catch((err) => console.error("Audio error:", err));
    }

    // ⏳ Countdown boshlash
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current); // ✅ timer to‘xtatish
          if (!hasPostedRef.current) {
            hasPostedRef.current = true;
            postFallAlert(); // 0 bo‘lganda darhol yuborish
          }
          return 0; // ❌ -1, -2 bo‘lib ketmaydi
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  const postFallAlert = async () => {
    try {
      await axios.post(
        "https://gilbeot.up.railway.app/api/fall-alert/dashboard-response",
        {
          action: "not_turned_off",
        },
        {
          params: {
            user_id: "kspace", 
            walker_id: "walker001", 
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      onClose();
      toast.success("보호자에게 낙상 알림이 전송되었습니다!");
      console.log("Alert sent!");
    } catch (error) {
      console.error("Error sending fall alert:", error.response?.data || error);
    }
  };

  // ✅ Foydalanuvchi tugmani bosganda
  const handleClose = () => {
    if (!hasPostedRef.current) {
      hasPostedRef.current = true;
    }
    onClose();
  };

  return (
    <div style={modalStyle.overlay}>
      <div style={modalStyle.modal}>
        <img className="mx-auto" src="/images/warningPng.png" alt="warning png" />
        <h2 className="mb-[10px] mt-[10px] text-[20px]">⚠️ 낙상이 감지되었습니다.</h2>
        <h3>{obstacleType}</h3>
        <p>
          <span className="bg-[#fff600] text-[#000] p-1 rounded-[5px]">알람 끄기</span> 버튼을 누르지 않으신다면 본인 보호자에게 자동으로 문자가 전송됩니다.
        </p>
        <p style={{ fontWeight: "bold", fontSize: "24px" }}>{countdown} 초 남았습니다</p>
        <button style={modalStyle.button} onClick={handleClose}>
          알림 끄기
        </button>
        <audio ref={audioRef} src={alarmSound} loop />
      </div>
    </div>
  );
};

export default FallModal;

const modalStyle = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    maxWidth: "400px",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#ff4d4f",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};


// import { useEffect, useState, useRef } from "react";
// import alarmSound from "../assets/fallAlert.mp3"; // Fayl yo‘li loyihangizga mos bo‘lsin
// import axios from "axios";
// import {toast} from "react-toastify";


// const FallModal = ({ obstacleType, obstacleId, onClose, user_id, walker_id }) => {
//     const [countdown, setCountdown] = useState(10);
//     const audioRef = useRef(null);
//     const hasPostedRef = useRef(false);
    

//     useEffect(() => {
//         // 🔊 Audio chalish
//         if (audioRef.current) {
//             audioRef.current.play().catch((err) => console.error("Audio error:", err));
//         }

//         // ⏳ Countdown boshlash
//         const timer = setInterval(() => {
//             setCountdown((prev) => prev - 1);
//         }, 1000);

//         // 🧠 Timeout orqali 1 daqiqada POST yuborish
//         const postTimeout = setTimeout(() => {
//             if (!hasPostedRef.current) {
//                 hasPostedRef.current = true;
//                 postFallAlert(); // POST yuborish
//             }
//         }, 10000);

//         // 🧹 Tozalash
//         return () => {
//             clearInterval(timer);
//             clearTimeout(postTimeout);
//         };
//     }, []);



//     const postFallAlert = async () => {
//   try {
//     await axios.post(
//       "https://gilbeot.up.railway.app/api/fall-alert/dashboard-response",
//       {
//         action: "not_turned_off", // faqat 'turned_off' yoki 'not_turned_off' bo'lishi kerak
//       },
//       {
//         params: {
//           user_id: "kspace", // query param
//           walker_id: "walker001", // query param
//         },
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     onClose(); // Modalni yopamiz
//      toast.success("보호자에게 낙상 알림이 전송되었습니다!");
//     console.log("Alert sent!");
//   } catch (error) {
//     console.error("Error sending fall alert:", error.response?.data || error);
//   }
// };

//     // ✅ Foydalanuvchi bosdi — modalni yopamiz
//     const handleClose = () => {
//         if (!hasPostedRef.current) {
//             hasPostedRef.current = true;
//         }
//         onClose();
//     };

//     return (
//         <div style={modalStyle.overlay}>
//             <div style={modalStyle.modal}>
//                 <img className="mx-auto" src="/images/warningPng.png" alt="warning png"/>
//                 <h2 className="mb-[10px] mt-[10px] text-[20px]">⚠️ 낙상이 감지되었습니다.</h2>
//                 <h3>{obstacleType}</h3>
//                 <p><span className="bg-[#fff600] text-[#000] p-1 rounded-[5px]">알람 끄기</span> 버튼을 누르지 않으신다면 본인 보호자에게 자동으로 문자가 전송됩니다.</p>
//                 <p style={{ fontWeight: "bold", fontSize: "24px" }}>{countdown} 초 남았습니다</p>
//                 <button style={modalStyle.button} onClick={handleClose}>
//                     알림 끄기
//                 </button>
//                 <audio ref={audioRef} src={alarmSound} loop />
//             </div>
//         </div>
//     );
// };

// export default FallModal;

// // 🎨 Inline style (istasa SCSS faylga ko‘chirsa ham bo‘ladi)
// const modalStyle = {
//     overlay: {
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100vw",
//         height: "100vh",
//         backgroundColor: "rgba(0, 0, 0, 0.6)",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         zIndex: 1000,
//     },
//     modal: {
//         backgroundColor: "#fff",
//         padding: "20px",
//         borderRadius: "10px",
//         textAlign: "center",
//         boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
//         maxWidth: "400px",
//     },
//     button: {
//         marginTop: "20px",
//         padding: "10px 20px",
//         backgroundColor: "#ff4d4f",
//         color: "white",
//         border: "none",
//         borderRadius: "5px",
//         cursor: "pointer",
//         fontSize: "16px",
//     },
// };
