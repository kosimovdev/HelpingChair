import { useEffect , useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // Logoningizni shu yerga import qiling

const SplashScreen = ({
  // logoText = "로고",
  // imageText = "이미지",
  // areaText = "영역",
  mainTitle = "길벗이",
}) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
    useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      navigate("/home"); // <-- Asosiy sahifangiz route
    }, 1000000); // 3 soniya
    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-green-400 to-green-500 overflow-hidden">
      {loading && (
        <>
        {/* Background decorative circles */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-green-300 bg-opacity-20 rounded-full"></div>
      <div className="absolute top-40 right-20 w-48 h-48 bg-green-300 bg-opacity-15 rounded-full"></div>
      <div className="absolute bottom-32 left-20 w-40 h-40 bg-green-300 bg-opacity-10 rounded-full"></div>
      <div className="absolute bottom-20 right-10 w-56 h-56 bg-green-300 bg-opacity-12 rounded-full"></div>
      <div className="absolute top-60 left-1/4 w-24 h-24 bg-green-300 bg-opacity-18 rounded-full"></div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center h-full text-white relative z-10">
        {/* Top text */}
        <div className="text-center mb-16">
          {/* <div className="text-lg font-medium mb-1">{logoText}</div>
          <div className="text-lg font-medium mb-1">{imageText}</div>
          <div className="text-lg font-medium">{areaText}</div> */}
        </div>

        {/* Central icon */}
        <div className="mb-14 mt-2">
          <div className="w-full h-full p-5  border-white border-opacity-60 flex items-center justify-center mb-4">
            <div className="w-[300px] h-[300px] border-[4px] border-white bg-[#fff] border-opacity-40 rounded-full flex items-center justify-center">
              <img src={logo} alt="Logo" className="w-[200px] " />
            </div>
          </div>
        </div>

        {/* Main title */}
        <div className="text-6xl font-bold mb-8">{mainTitle}</div>

        {/* Pagination dots */}
        {/* <div className="flex space-x-3">
          <div className="w-3 h-3 bg-white rounded-full"></div>
          <div className="w-3 h-3 bg-white bg-opacity-50 rounded-full"></div>
        </div> */}
      </div>
        </>
      )}
    </div>
  );
};

export default SplashScreen;




// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import logo from "../assets/logo.png"; // Logoningizni shu yerga import qiling

// const SplashScreen = () => {
//      const [loading, setLoading] = useState(true);
//      const navigate = useNavigate();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//       navigate("/home"); // <-- Asosiy sahifangiz route
//     }, 70000000); // 3 soniya
//     return () => clearTimeout(timer);
//   }, [navigate]);

//   return (
//     <div className="flex items-center justify-center h-screen  mx-auto  w-full">
//       {loading && (
        
//         <>
//         <div className="block text-center">
//             <img
//           src={logo} // <-- logoni to‘g‘ri pathda joylashtiring (public/logo.png)
//           alt="Logo"
//           className="w-[400px] h-[400px] animate-pulse"
//         />
//         <h1 className="text-[60px] font-bold">길벗이</h1>
//         </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default SplashScreen;
