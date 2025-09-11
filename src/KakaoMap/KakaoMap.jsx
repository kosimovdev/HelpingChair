import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import storage from "../services/storage/index.js";
import { useWarning } from "../context/WarningContext.jsx";
import { getLatestObstacle } from "../services/Warning/Warning.jsx";
import FallModal from "../FallModal/FallModal.jsx";
import user from "../services/Auth/Auth.jsx";

const KakaoMapRedirect = () => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);      // Map instance saqlash uchun
    const markerInstance = useRef(null);   // Marker instance saqlash uchun

    const [startCoords, setStartCoords] = useState(null);
    const [startAddress, setStartAddress] = useState("");
    const [endAddress, setEndAddress] = useState("");

    const { showWarning } = useWarning();
    const navigate = useNavigate();
    const user_id = storage.get("user_id");
    const walkerId = "walker001";
    const lastObstacleId = useRef(null);
    // const user_id = localStorage.getItem("user_id");
    const [dismissedAlertId, setDismissedAlertId] = useState(null);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [warningData, setWarningData] = useState(null);
    

     const getFallAlert = async () => {
            try {
                const fallAlert = await user.getWarning(user_id, walkerId);

        // console.log("Alert ID from server:", fallAlert?.alert_id);
        console.log(fallAlert)
        if (
            fallAlert?.fall_detected &&
            fallAlert?.alert_id !== null &&
            Number(fallAlert.alert_id) !== Number(localStorage.getItem("dismissedAlertId"))
        ) {
            setWarningData(fallAlert);
            setIsModalOpen2(true);
        } else {
            // console.log("No new fall alert or already dismissed.");
        }
    } catch (error) {
        console.error("Error fetching fall alert:", error);
    }
};


  useEffect(() => {
    const saved = localStorage.getItem("dismissedAlertId");
    if (saved) {
        setDismissedAlertId(Number(saved));
    }

    const interval = setInterval(() => {
        getFallAlert();
    }, 1000); 

    return () => clearInterval(interval);
}, [user_id, walkerId ]); // Faqat user_id va walkerId ga bog‘liq


   const handleCloseModal = () => {
    setIsModalOpen2(false);
    if (warningData?.alert_id !== null) {
        const alertId = Number(warningData.alert_id);
        localStorage.setItem("dismissedAlertId", alertId);
        console.log("Dismissed alert ID saved:", alertId);
        console.log(warningData.timestamp)
        setDismissedAlertId(alertId); // baribir ishlaydi, lekin bu second layer
    }
};



    // Obstacle tekshirish
    useEffect(() => {
        if (!user_id) return navigate("/login");
        const interval = setInterval(async () => {
            try {
                const data = await getLatestObstacle(user_id, walkerId);
                if (data.is_detected === 1 && data.obstacle_id !== lastObstacleId.current) {
                    lastObstacleId.current = data.obstacle_id;

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

    // Map va marker yaratish
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setStartCoords({ lat, lng });

                    const script = document.createElement("script");
                    script.async = true;
                    script.src =
                        "https://dapi.kakao.com/v2/maps/sdk.js?appkey=a700f422b9e4da580b9847f15fce2177&libraries=services&autoload=false";
                    document.head.appendChild(script);

                    script.onload = () => {
                        window.kakao.maps.load(() => {
                            const container = mapRef.current;
                            const options = {
                                center: new window.kakao.maps.LatLng(lat, lng),
                                level: 3,
                            };
                            const map = new window.kakao.maps.Map(container, options);
                            mapInstance.current = map;

                            const marker = new window.kakao.maps.Marker({
                                map,
                                position: new window.kakao.maps.LatLng(lat, lng),
                            });
                            markerInstance.current = marker;

                            const geocoder = new window.kakao.maps.services.Geocoder();
                            geocoder.coord2Address(lng, lat, (result, status) => {
                                if (status === window.kakao.maps.services.Status.OK) {
                                    const address = result[0].address.address_name;
                                    setStartAddress(address);
                                }
                            });
                        });
                    };
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    alert("현위치를 알수없음.");
                }
            );
        } else {
            alert("Brauzeringiz geolokatsiyani qo‘llab-quvvatlamaydi.");
        }
    }, []);

    // Joylashuvni yangilash funksiyasi
    const refreshLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setStartCoords({ lat, lng });

                    if (mapInstance.current && markerInstance.current) {
                        const newPos = new window.kakao.maps.LatLng(lat, lng);
                        mapInstance.current.setCenter(newPos);
                        markerInstance.current.setPosition(newPos);

                        const geocoder = new window.kakao.maps.services.Geocoder();
                        geocoder.coord2Address(lng, lat, (result, status) => {
                            if (status === window.kakao.maps.services.Status.OK) {
                                const address = result[0].address.address_name;
                                setStartAddress(address);
                            }
                        });
                    }
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    alert("Joylashuvni aniqlab bo‘lmadi.");
                }
            );
        }
    };

    // Kakao map ga yo‘l ko‘rsatish
    const openKakaoMap = () => {
        if (!startCoords || !startAddress || !endAddress) {
            alert("Iltimos, manzillarni to‘liq kiriting.");
            return;
        }

        const url = `https://map.kakao.com/?sName=${encodeURIComponent(startAddress)}&sX=${startCoords.lng}&sY=${
            startCoords.lat
        }&eName=${encodeURIComponent(endAddress)}&target=walk`;
        window.open(url, "_blank");
    };

    const handlePreviousClick = () => {
        navigate("/activity");
    };

    const handleNextClick = () => {
        navigate("/camera");
    };

    return (
        <div className="relative w-full h-[800px]">
            {/* Top navigation buttons */}
            <div className="absolute w-full z-10 top-[45%]">
                <div className="flex items-center justify-between p-2">
                    <button
                        onClick={handlePreviousClick}
                        className="flex items-center justify-center rounded-full w-[100px] h-[100px] bg-[#E2E2E2]"
                    >
                        <img className="w-[60px]" src="/images/previousImg.png" alt="previous" />
                    </button>
                    <button
                        onClick={handleNextClick}
                        className="flex items-center justify-center rounded-full w-[100px] h-[100px] bg-[#E2E2E2]"
                    >
                        <img className="w-[60px]" src="/images/nextLogo.png" alt="next" />
                    </button>
                </div>
            </div>

            {/* Inputlar va tugmalar */}
            <div className="absolute top-4 left-1/2 h-[80px] -translate-x-1/2 bg-white shadow-md rounded p-2 z-10 w-[90%] flex gap-2 items-center">
                <input
                    type="text"
                    placeholder="장소*주소*버스 검색 "
                    value={endAddress}
                    onChange={(e) => setEndAddress(e.target.value)}
                    className="border p-2 rounded w-full h-[50px]"
                />
                <button
                    onClick={openKakaoMap}
                    className="w-[100px] h-[50px] bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    길찾기
                </button>
                <button
                    onClick={refreshLocation}
                    className="w-[120px] h-[50px] bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                   현위치
                </button>
            </div>

            {/* Kakao Map container */}
            <div ref={mapRef} className="w-full h-full" />
              {isModalOpen2 && (
                
       <FallModal
        obstacleType={warningData.timestamp}
        obstacleId={warningData.alert_id}
        onClose={handleCloseModal}
        user_id={user_id}
        walker_id={walkerId}
    />
)}
        </div>
    );
};

export default KakaoMapRedirect;



// import {useEffect, useRef, useState} from "react";
// import {useNavigate} from "react-router-dom";
// import storage from "../services/storage/index.js";
// import {useWarning} from "../context/WarningContext.jsx";
// import {getLatestObstacle} from "../services/Warning/Warning.jsx";



// const KakaoMapRedirect = () => {
//     const mapRef = useRef(null); // DOM element uchun ref

//     const [startCoords, setStartCoords] = useState(null);
//     const [startAddress, setStartAddress] = useState("");
//     const [endAddress, setEndAddress] = useState("");
//     const {showWarning} = useWarning();
//     const navigate = useNavigate();
//     const user_id = storage.get("user_id");
//     const walkerId = "walker001";
//     const lastObstacleId = useRef(null);
  

//      useEffect(() => {
//         if (!user_id) return navigate("/login");
//         const interval = setInterval(async () => {
//             try {
//                 const data = await getLatestObstacle(user_id, walkerId);
//                if (data.is_detected === 1 && data.obstacle_id !== lastObstacleId.current) {
//                     lastObstacleId.current = data.obstacle_id;

//     // obstacle_type ni tozalash (stringdan massivga aylantirish)
//     let obstacleClean;
//     try {
//         obstacleClean = JSON.parse(data.obstacle_type.replace(/'/g, '"'));
//     } catch {
//         obstacleClean = [data.obstacle_type]; 
//     }

//     showWarning({
//         alert_level: data.alert_level,
//         obstacle_type: obstacleClean,
//         risk_score: data.risk_score,
//         obstacle_id: data.obstacle_id,
//     });
// }
//             } catch (err) {
//                 console.error("Obstacle error:", err);
//             }
//         }, 3000);

//         return () => clearInterval(interval);
//     }, [user_id]);


//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const lat = position.coords.latitude;
//                     const lng = position.coords.longitude;
//                     setStartCoords({lat, lng});

//                     const script = document.createElement("script");
//                     script.async = true;
//                     script.src =
//                         "https://dapi.kakao.com/v2/maps/sdk.js?appkey=a700f422b9e4da580b9847f15fce2177&libraries=services&autoload=false";
//                     document.head.appendChild(script);

//                     script.onload = () => {
//                         window.kakao.maps.load(() => {
//                             // ⚠️ DOM elementni to'g'ridan to'g'ri ref orqali olamiz
//                             const container = mapRef.current;
//                             const options = {
//                                 center: new window.kakao.maps.LatLng(lat, lng),
//                                 level: 3,
//                             };
//                             const map = new window.kakao.maps.Map(container, options);

//                             new window.kakao.maps.Marker({
//                                 map,
//                                 position: new window.kakao.maps.LatLng(lat, lng),
//                             });

//                             const geocoder = new window.kakao.maps.services.Geocoder();
//                             geocoder.coord2Address(lng, lat, (result, status) => {
//                                 if (status === window.kakao.maps.services.Status.OK) {
//                                     const address = result[0].address.address_name;
//                                     setStartAddress(address);
//                                 }
//                             });
//                         });
//                     };
//                 },
//                 (error) => {
//                     console.error("Geolocation error:", error);
//                     alert("Joylashuvni aniqlab bo‘lmadi.");
//                 }
//             );
//         } else {
//             alert("Brauzeringiz geolokatsiyani qo‘llab-quvvatlamaydi.");
//         }
//     }, []);

//     const openKakaoMap = () => {
//         if (!startCoords || !startAddress || !endAddress) {
//             alert("Iltimos, manzillarni to‘liq kiriting.");
//             return;
//         }

//         const url = `https://map.kakao.com/?sName=${encodeURIComponent(startAddress)}&sX=${startCoords.lng}&sY=${
//             startCoords.lat
//         }&eName=${encodeURIComponent(endAddress)}&target=walk`;
//         window.open(url, "_blank");
//     };
//     const handlePreviousClick = () => {
//         navigate("/activity");
//     };

//     const handleNextClick = () => {
//         navigate("/camera");
//     };

//     return (
//         <div className="relative w-full h-[800px]">
//             <div className="absolute w-full z-10 top-[45%]">
//                 <div className="flex items-center justify-between p-2">
//                     <button
//                         onClick={handlePreviousClick}
//                         className="flex items-center justify-center rounded-full w-[100px] h-[100px] bg-[#E2E2E2]"
//                     >
//                         <img className="w-[60px]" src="/images/previousImg.png" alt="previous" />
//                     </button>
//                     <button
//                         onClick={handleNextClick}
//                         className="flex items-center justify-center rounded-full w-[100px] h-[100px] bg-[#E2E2E2]"
//                     >
//                         <img className="w-[60px]" src="/images/nextLogo.png" alt="next" />
//                     </button>
//                 </div>
//             </div>
//             {/* Inputlar */}
//             <div className="absolute top-4 left-1/2 h-[80px] -translate-x-1/2 bg-white shadow-md rounded p-2 z-10 w-[90%] flex gap-2 items-center">
//                 <input
//                     type="text"
//                     placeholder="장소*주소*버스 검색 "
//                     value={endAddress}
//                     onChange={(e) => setEndAddress(e.target.value)}
//                     className="border p-2 rounded w-full h-[50px]"
//                 />
//                 <button
//                     onClick={openKakaoMap}
//                     className="w-[100px] h-[50px] bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                 >
//                     길찾기
//                 </button>
//             </div>

//             {/* Kakao Map container */}
//             <div ref={mapRef} className="w-full h-full" />
//         </div>
//     );
// };

// export default KakaoMapRedirect;
