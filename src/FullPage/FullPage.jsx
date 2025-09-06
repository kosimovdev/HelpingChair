import { useEffect , useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartPulse, Clock, MapPin, Camera } from "lucide-react"; // 🔹 lucide-react iconlar
import storage from "../services/storage/storage";
import { useWarning } from "../context/WarningContext.jsx";
import { getLatestObstacle } from "../services/Warning/Warning.jsx";

export default function FullPage() {
    const user_id = storage.get("user_id");
    const lastObstacleId = useRef(null);
    const { showWarning } = useWarning();
    const walkerId = "walker001";

    const navigate = useNavigate();
  const menus = [
    { id: 1, title: "심박수", path: "/heart" , icon:<HeartPulse size={140} className="text-[#fff]" /> ,  bgColor:"bg-red-500"},
    { id: 2, title: "활동 시간", path: "/activity" ,  icon: <Clock size={140} className="text-white" /> , bgColor:"bg-[#0077b6]"}, 
    { id: 3, title: "지도", path: "/map" , icon: <MapPin size={140} className="text-white" /> , bgColor:"bg-[#f2c203ff]"},
    { id: 4, title: "Camera", path: "/camera" , icon: <Camera size={140} className="text-white" /> , bgColor:"bg-gray-500"},
  ];

  useEffect(() => {
        if (!user_id) return navigate("/login");
        const interval = setInterval(async () => {
            try {
                const data = await getLatestObstacle(user_id, walkerId);
               if (data.is_detected === 1 && data.obstacle_id !== lastObstacleId.current) {
                    lastObstacleId.current = data.obstacle_id;

    // obstacle_type ni tozalash (stringdan massivga aylantirish)
    let obstacleClean;
    try {
        obstacleClean = JSON.parse(data.obstacle_type.replace(/'/g, '"'));
    } catch {
        obstacleClean = [data.obstacle_type]; 
    }

    showWarning({
        alert_level: data.alert_level,
        obstacle_type: obstacleClean,
        risk_score: data.risk_score,
        obstacle_id: data.obstacle_id,
    });
}
            } catch (err) {
                console.error("Obstacle error:", err);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [user_id]);

 

  return (
    <div className="flex items-center justify-center  p-2">
      <div className="grid grid-cols-2 gap-6 w-[100%]">
        {menus.map((menu) => (
          <Link
            key={menu.id}
            to={menu.path}
            className={`flex items-center justify-center p-4 rounded-[25px] shadow-md transition-transform transform hover:scale-105 ${menu.bgColor}`}
          >
           <div> 
            {/* <img src="/images/heart.png" alt="heart" /> */}
            {menu.icon}
           <h1 className="text-[45px] text-center mt-[10px] text-white"> {menu.title}</h1>
           </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

