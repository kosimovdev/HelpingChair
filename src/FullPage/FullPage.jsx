import { Link } from "react-router-dom";
import { HeartPulse, Clock, MapPin, Camera } from "lucide-react"; // 🔹 lucide-react iconlar

export default function FullPage() {
  const menus = [
    { id: 1, title: "심박수", path: "/heart" , icon:<HeartPulse size={140} className="text-[#fff]" /> ,  bgColor:"bg-red-500"},
    { id: 2, title: "활동 시간", path: "/activity" ,  icon: <Clock size={140} className="text-white" /> , bgColor:"bg-[#0077b6]"}, 
    { id: 3, title: "지도", path: "/map" , icon: <MapPin size={140} className="text-white" /> , bgColor:"bg-[#f2c203ff]"},
    { id: 4, title: "Camera", path: "/camera" , icon: <Camera size={140} className="text-white" /> , bgColor:"bg-gray-500"},
  ];

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

