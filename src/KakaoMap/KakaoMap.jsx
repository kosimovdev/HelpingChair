import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useWarning } from "../context/WarningContext.jsx";
import { getLatestObstacle } from "../services/Warning/Warning.jsx";
import FallModal from "../FallModal/FallModal.jsx";
import storage from "../services/storage/index.js";
import user from "../services/Auth/Auth.jsx";

const KakaoMapRedirect = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);
  const partnerMarkerRef = useRef(null);

  const [startCoords, setStartCoords] = useState({ lat: 37.5665, lng: 126.9780 }); // default Seul
  const [startAddress, setStartAddress] = useState("Seoul, South Korea"); // default address
  const [endAddress, setEndAddress] = useState("");
  const [partnerCoords, setPartnerCoords] = useState(null);

  const { showWarning } = useWarning();
  const navigate = useNavigate();
  const user_id = storage.get("user_id");
  const walkerId = "walker001";
  const lastObstacleId = useRef(null);
  const [dismissedAlertId, setDismissedAlertId] = useState(null);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [warningData, setWarningData] = useState(null);

  // Fall alert
  const getFallAlert = async () => {
    try {
      const fallAlert = await user.getWarning(user_id, walkerId);
      if (
        fallAlert?.fall_detected &&
        fallAlert?.alert_id !== null &&
        Number(fallAlert.alert_id) !== Number(localStorage.getItem("dismissedAlertId"))
      ) {
        setWarningData(fallAlert);
        setIsModalOpen2(true);
      }
    } catch (error) {
      console.error("Error fetching fall alert:", error);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("dismissedAlertId");
    if (saved) setDismissedAlertId(Number(saved));

    const interval = setInterval(() => {
      getFallAlert();
    }, 1000);

    return () => clearInterval(interval);
  }, [user_id, walkerId]);

  const handleCloseModal = () => {
    setIsModalOpen2(false);
    if (warningData?.alert_id !== null) {
      const alertId = Number(warningData.alert_id);
      localStorage.setItem("dismissedAlertId", alertId);
      setDismissedAlertId(alertId);
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

  // Kakao Map yaratish va backenddan marker olish
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://dapi.kakao.com/v2/maps/sdk.js?appkey=a700f422b9e4da580b9847f15fce2177&libraries=services&autoload=false";
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = mapRef.current;

        const options = {
          center: new window.kakao.maps.LatLng(startCoords.lat, startCoords.lng),
          level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);
        mapInstance.current = map;

        // Backenddan foydalanuvchi koordinatalarini olish va marker qo‘yish
        const fetchUserLocation = async () => {
          try {
            const res = await axios.get("https://gilbeot.up.railway.app/api/gps/kspace");
            const { latitude, longitude } = res.data;

            // Start marker
            const newPos = new window.kakao.maps.LatLng(latitude, longitude);
            if (!markerInstance.current) {
              markerInstance.current = new window.kakao.maps.Marker({
                map: mapInstance.current,
                position: newPos,
              });
            } else {
              markerInstance.current.setPosition(newPos);
            }

            // Update startCoords va startAddress
            setStartCoords({ lat: latitude, lng: longitude });

            // Optional: reverse geocoding
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.coord2Address(longitude, latitude, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                setStartAddress(result[0].address.address_name);
              }
            });

            // Xarita markerni markazga siljitadi
            mapInstance.current.setCenter(newPos);
          } catch (err) {
            console.error("User location fetch error:", err);
          }
        };

        fetchUserLocation();
        const interval = setInterval(fetchUserLocation, 5000);
        return () => clearInterval(interval);
      });
    };
  }, []);

  // 길찾기 tugmasi
  const openKakaoMap = () => {
    if (!startCoords || !startAddress || !endAddress) {
        alert("Iltimos, manzillarni to‘liq kiriting.");
        return;
    }
    const url = `https://map.kakao.com/?sName=${encodeURIComponent(
        startAddress
    )}&sX=${startCoords.lng}&sY=${startCoords.lat}&eName=${encodeURIComponent(
        endAddress
    )}&target=walk`;

    window.open(url, "_blank"); // yangi tabda ochadi
};


  // Refresh location tugmasi
  const refreshLocation = () => {
    axios
      .get("https://gilbeot.up.railway.app/api/gps/kspace")
      .then((res) => {
        const { latitude, longitude } = res.data;
        setStartCoords({ lat: latitude, lng: longitude });
        if (mapInstance.current && markerInstance.current) {
          const newPos = new window.kakao.maps.LatLng(latitude, longitude);
          markerInstance.current.setPosition(newPos);
          mapInstance.current.setCenter(newPos);
        }
      })
      .catch((err) => console.error("Refresh location error:", err));
  };

  // Sherik markerini olish (agar kerak bo‘lsa)
  const fetchPartnerLocation = async () => {
    try {
      const res = await axios.get("https://gilbeot.up.railway.app/api/gps/kspace");
      const { latitude, longitude } = res.data;
      setPartnerCoords({ lat: latitude, lng: longitude });

      if (mapInstance.current) {
        const newPos = new window.kakao.maps.LatLng(latitude, longitude);
        if (!partnerMarkerRef.current) {
          partnerMarkerRef.current = new window.kakao.maps.Marker({
            map: mapInstance.current,
            position: newPos,
            image: new window.kakao.maps.MarkerImage(
              "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
              new window.kakao.maps.Size(24, 35),
              { offset: new window.kakao.maps.Point(12, 35) }
            ),
          });
        } else {
          partnerMarkerRef.current.setPosition(newPos);
        }
      }
    } catch (err) {
      console.error("Partner location fetch error:", err);
    }
  };

  useEffect(() => {
    fetchPartnerLocation();
    const interval = setInterval(fetchPartnerLocation, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePreviousClick = () => navigate("/activity");
  const handleNextClick = () => navigate("/camera");

  return (
    <div className="relative w-full h-[800px]">
      <div className="absolute w-full z-10 top-[45%] flex items-center justify-between p-2">
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

      <div ref={mapRef} className="w-full h-full" />

      {isModalOpen2 && warningData && (
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



// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import storage from "../services/storage/index.js";
// import { useWarning } from "../context/WarningContext.jsx";
// import { getLatestObstacle } from "../services/Warning/Warning.jsx";
// import FallModal from "../FallModal/FallModal.jsx";
// import user from "../services/Auth/Auth.jsx";
// import axios from "axios";

// const KakaoMapRedirect = () => {
//     const mapRef = useRef(null);
//     const mapInstance = useRef(null);
//     const markerInstance = useRef(null);
//     const partnerMarkerRef = useRef(null); // sherik marker
//     const [startCoords, setStartCoords] = useState(null);
//     const [startAddress, setStartAddress] = useState("");
//     const [endAddress, setEndAddress] = useState("");
//     const [partnerCoords, setPartnerCoords] = useState(null);

//     const { showWarning } = useWarning();
//     const navigate = useNavigate();
//     const user_id = storage.get("user_id");
//     const walkerId = "walker001";
//     const lastObstacleId = useRef(null);
//     const [dismissedAlertId, setDismissedAlertId] = useState(null);
//     const [isModalOpen2, setIsModalOpen2] = useState(false);
//     const [warningData, setWarningData] = useState(null);

//     // Fall alert
//     const getFallAlert = async () => {
//         try {
//             const fallAlert = await user.getWarning(user_id, walkerId);
//             if (
//                 fallAlert?.fall_detected &&
//                 fallAlert?.alert_id !== null &&
//                 Number(fallAlert.alert_id) !== Number(localStorage.getItem("dismissedAlertId"))
//             ) {
//                 setWarningData(fallAlert);
//                 setIsModalOpen2(true);
//             }
//         } catch (error) {
//             console.error("Error fetching fall alert:", error);
//         }
//     };

//     useEffect(() => {
//         const saved = localStorage.getItem("dismissedAlertId");
//         if (saved) setDismissedAlertId(Number(saved));

//         const interval = setInterval(() => {
//             getFallAlert();
//         }, 1000);

//         return () => clearInterval(interval);
//     }, [user_id, walkerId]);

//     const handleCloseModal = () => {
//         setIsModalOpen2(false);
//         if (warningData?.alert_id !== null) {
//             const alertId = Number(warningData.alert_id);
//             localStorage.setItem("dismissedAlertId", alertId);
//             setDismissedAlertId(alertId);
//         }
//     };

//     // Obstacle tekshirish
//     useEffect(() => {
//         if (!user_id) return navigate("/login");
//         const interval = setInterval(async () => {
//             try {
//                 const data = await getLatestObstacle(user_id, walkerId);
//                 if (data.is_detected === 1 && data.obstacle_id !== lastObstacleId.current) {
//                     lastObstacleId.current = data.obstacle_id;
//                     let obstacleClean;
//                     try {
//                         obstacleClean = JSON.parse(data.obstacle_type.replace(/'/g, '"'));
//                     } catch {
//                         obstacleClean = [data.obstacle_type];
//                     }
//                     showWarning({
//                         alert_level: data.alert_level,
//                         obstacle_type: obstacleClean,
//                         risk_score: data.risk_score,
//                         obstacle_id: data.obstacle_id,
//                     });
//                 }
//             } catch (err) {
//                 console.error("Obstacle error:", err);
//             }
//         }, 3000);

//         return () => clearInterval(interval);
//     }, [user_id]);

//     // Map va marker yaratish
//    useEffect(() => {
//     const script = document.createElement("script");
//     script.async = true;
//     script.src =
//         "https://dapi.kakao.com/v2/maps/sdk.js?appkey=a700f422b9e4da580b9847f15fce2177&libraries=services&autoload=false";
//     document.head.appendChild(script);

//     script.onload = () => {
//         window.kakao.maps.load(() => {
//             const container = mapRef.current;

//             // Default joy (Seul)
//             const defaultLat = 37.5665;
//             const defaultLng = 126.9780;

//             const options = {
//                 center: new window.kakao.maps.LatLng(defaultLat, defaultLng),
//                 level: 3,
//             };

//             const map = new window.kakao.maps.Map(container, options);
//             mapInstance.current = map;

//             // Marker yaratish (backenddan keladigan koordinata)
//             fetchUserLocation();
//             const interval = setInterval(fetchUserLocation, 5000); // har 5 soniyada yangilash

//             function fetchUserLocation() {
//                 axios.get("https://gilbeot.up.railway.app/api/gps/kspace")
//                     .then(res => {
//                         const { latitude, longitude } = res.data;
//                         if (!markerInstance.current) {
//                             markerInstance.current = new window.kakao.maps.Marker({
//                                 map: mapInstance.current,
//                                 position: new window.kakao.maps.LatLng(latitude, longitude),
//                             });
//                         } else {
//                             markerInstance.current.setPosition(new window.kakao.maps.LatLng(latitude, longitude));
//                         }

//                         // Xarita markerni markazga siljitadi (optional)
//                         mapInstance.current.setCenter(new window.kakao.maps.LatLng(latitude, longitude));
//                     })
//                     .catch(err => console.error(err));
//             }

//             return () => clearInterval(interval);
//         });
//     };
// }, []);


//     // Refresh location
//     const refreshLocation = () => {
//         if (!navigator.geolocation) return alert("GPS mavjud emas.");
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const lat = position.coords.latitude;
//                 const lng = position.coords.longitude;
//                 setStartCoords({ lat, lng });
//                 if (mapInstance.current && markerInstance.current) {
//                     const newPos = new window.kakao.maps.LatLng(lat, lng);
//                     mapInstance.current.setCenter(newPos);
//                     markerInstance.current.setPosition(newPos);
//                 }
//             },
//             (error) => alert("Joylashuvni aniqlab bo‘lmadi.")
//         );
//     };

//     // 길찾기 tugmasi
//     const openKakaoMap = () => {
//         if (!startCoords || !startAddress || !endAddress) {
//             alert("Iltimos, manzillarni to‘liq kiriting.");
//             return;
//         }
//         const url = `https://map.kakao.com/?sName=${encodeURIComponent(
//             startAddress
//         )}&sX=${startCoords.lng}&sY=${startCoords.lat}&eName=${encodeURIComponent(
//             endAddress
//         )}&target=walk`;
//         window.location.href = url; // current tabga redirect
//     };

//     // Sheriklar koordinatalarini olish
//     const fetchPartnerLocation = async () => {
//         try {
//             const res = await axios.get("https://gilbeot.up.railway.app/api/gps/kspace");
//             const { latitude, longitude } = res.data;
//             setPartnerCoords({ lat: latitude, lng: longitude });

//             if (mapInstance.current) {
//                 const newPos = new window.kakao.maps.LatLng(latitude, longitude);
//                 if (!partnerMarkerRef.current) {
//                     partnerMarkerRef.current = new window.kakao.maps.Marker({
//                         map: mapInstance.current,
//                         position: newPos,
//                         image: new window.kakao.maps.MarkerImage(
//                             "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
//                             new window.kakao.maps.Size(24, 35),
//                             { offset: new window.kakao.maps.Point(12, 35) }
//                         ),
//                     });
//                 } else {
//                     partnerMarkerRef.current.setPosition(newPos);
//                 }
//             }
//         } catch (err) {
//             console.error("Partner location fetch error:", err);
//         }
//     };

//     useEffect(() => {
//         fetchPartnerLocation();
//         const interval = setInterval(fetchPartnerLocation, 5000);
//         return () => clearInterval(interval);
//     }, []);

//     const handlePreviousClick = () => navigate("/activity");
//     const handleNextClick = () => navigate("/camera");

//     return (
//         <div className="relative w-full h-[800px]">
//             <div className="absolute w-full z-10 top-[45%] flex items-center justify-between p-2">
//                 <button
//                     onClick={handlePreviousClick}
//                     className="flex items-center justify-center rounded-full w-[100px] h-[100px] bg-[#E2E2E2]"
//                 >
//                     <img className="w-[60px]" src="/images/previousImg.png" alt="previous" />
//                 </button>
//                 <button
//                     onClick={handleNextClick}
//                     className="flex items-center justify-center rounded-full w-[100px] h-[100px] bg-[#E2E2E2]"
//                 >
//                     <img className="w-[60px]" src="/images/nextLogo.png" alt="next" />
//                 </button>
//             </div>

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
//                 <button
//                     onClick={refreshLocation}
//                     className="w-[120px] h-[50px] bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//                 >
//                     현위치
//                 </button>
//             </div>

//             <div ref={mapRef} className="w-full h-full" />

//             {isModalOpen2 && warningData && (
//                 <FallModal
//                     obstacleType={warningData.timestamp}
//                     obstacleId={warningData.alert_id}
//                     onClose={handleCloseModal}
//                     user_id={user_id}
//                     walker_id={walkerId}
//                 />
//             )}
//         </div>
//     );
// };

// export default KakaoMapRedirect;










// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import storage from "../services/storage/index.js";
// import { useWarning } from "../context/WarningContext.jsx";
// import { getLatestObstacle } from "../services/Warning/Warning.jsx";
// import FallModal from "../FallModal/FallModal.jsx";
// import user from "../services/Auth/Auth.jsx";

// const KakaoMapRedirect = () => {
//     const mapRef = useRef(null);
//     const mapInstance = useRef(null);      // Map instance saqlash uchun
//     const markerInstance = useRef(null);   // Marker instance saqlash uchun

//     const [startCoords, setStartCoords] = useState(null);
//     const [startAddress, setStartAddress] = useState("");
//     const [endAddress, setEndAddress] = useState("");

//     const { showWarning } = useWarning();
//     const navigate = useNavigate();
//     const user_id = storage.get("user_id");
//     const walkerId = "walker001";
//     const lastObstacleId = useRef(null);
//     const [dismissedAlertId, setDismissedAlertId] = useState(null);
//     const [isModalOpen2, setIsModalOpen2] = useState(false);
//     const [warningData, setWarningData] = useState(null);
    

//      const getFallAlert = async () => {
//             try {
//                 const fallAlert = await user.getWarning(user_id, walkerId);

//         // console.log("Alert ID from server:", fallAlert?.alert_id);
//         console.log(fallAlert)
//         if (
//             fallAlert?.fall_detected &&
//             fallAlert?.alert_id !== null &&
//             Number(fallAlert.alert_id) !== Number(localStorage.getItem("dismissedAlertId"))
//         ) {
//             setWarningData(fallAlert);
//             setIsModalOpen2(true);
//         } else {
//             // console.log("No new fall alert or already dismissed.");
//         }
//     } catch (error) {
//         console.error("Error fetching fall alert:", error);
//     }
// };


//   useEffect(() => {
//     const saved = localStorage.getItem("dismissedAlertId");
//     if (saved) {
//         setDismissedAlertId(Number(saved));
//     }

//     const interval = setInterval(() => {
//         getFallAlert();
//     }, 1000); 

//     return () => clearInterval(interval);
// }, [user_id, walkerId ]); // Faqat user_id va walkerId ga bog‘liq


//    const handleCloseModal = () => {
//     setIsModalOpen2(false);
//     if (warningData?.alert_id !== null) {
//         const alertId = Number(warningData.alert_id);
//         localStorage.setItem("dismissedAlertId", alertId);
//         console.log("Dismissed alert ID saved:", alertId);
//         console.log(warningData.timestamp)
//         setDismissedAlertId(alertId); // baribir ishlaydi, lekin bu second layer
//     }
// };



//     // Obstacle tekshirish
//     useEffect(() => {
//         if (!user_id) return navigate("/login");
//         const interval = setInterval(async () => {
//             try {
//                 const data = await getLatestObstacle(user_id, walkerId);
//                 if (data.is_detected === 1 && data.obstacle_id !== lastObstacleId.current) {
//                     lastObstacleId.current = data.obstacle_id;

//                     let obstacleClean;
//                     try {
//                         obstacleClean = JSON.parse(data.obstacle_type.replace(/'/g, '"'));
//                     } catch {
//                         obstacleClean = [data.obstacle_type]; 
//                     }

//                     showWarning({
//                         alert_level: data.alert_level,
//                         obstacle_type: obstacleClean,
//                         risk_score: data.risk_score,
//                         obstacle_id: data.obstacle_id,
//                     });
//                 }
//             } catch (err) {
//                 console.error("Obstacle error:", err);
//             }
//         }, 3000);

//         return () => clearInterval(interval);
//     }, [user_id]);

//     useEffect(() => {
//     const script = document.createElement("script");
//     script.async = true;
//     script.src =
//         "https://dapi.kakao.com/v2/maps/sdk.js?appkey=a700f422b9e4da580b9847f15fce2177&libraries=services&autoload=false";
//     document.head.appendChild(script);

//     script.onload = () => {
//         window.kakao.maps.load(() => {
//             const container = mapRef.current;

//             // GPS yo‘q bo‘lsa default koordinatalar (Seul)
//             let lat = 37.5665;
//             let lng = 126.9780;

//             if (navigator.geolocation) {
//                 navigator.geolocation.getCurrentPosition(
//                     (position) => {
//                         lat = position.coords.latitude;
//                         lng = position.coords.longitude;
//                         setStartCoords({ lat, lng });
//                     },
//                     (error) => {
//                         console.warn("Geolocation error, using default location:", error);
//                         setStartCoords({ lat, lng });
//                     }
//                 );
//             } else {
//                 setStartCoords({ lat, lng });
//             }

//             const options = {
//                 center: new window.kakao.maps.LatLng(lat, lng),
//                 level: 3,
//             };
//             const map = new window.kakao.maps.Map(container, options);
//             mapInstance.current = map;

//             const marker = new window.kakao.maps.Marker({
//                 map,
//                 position: new window.kakao.maps.LatLng(lat, lng),
//             });
//             markerInstance.current = marker;

//             const geocoder = new window.kakao.maps.services.Geocoder();
//             geocoder.coord2Address(lng, lat, (result, status) => {
//                 if (status === window.kakao.maps.services.Status.OK) {
//                     const address = result[0].address.address_name;
//                     setStartAddress(address);
//                 }
//             });
//         });
//     };
// }, []);
    

//     // Joylashuvni yangilash funksiyasi
//     const refreshLocation = () => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const lat = position.coords.latitude;
//                     const lng = position.coords.longitude;
//                     setStartCoords({ lat, lng });

//                     if (mapInstance.current && markerInstance.current) {
//                         const newPos = new window.kakao.maps.LatLng(lat, lng);
//                         mapInstance.current.setCenter(newPos);
//                         markerInstance.current.setPosition(newPos);

//                         const geocoder = new window.kakao.maps.services.Geocoder();
//                         geocoder.coord2Address(lng, lat, (result, status) => {
//                             if (status === window.kakao.maps.services.Status.OK) {
//                                 const address = result[0].address.address_name;
//                                 setStartAddress(address);
//                             }
//                         });
//                     }
//                 },
//                 (error) => {
//                     console.error("Geolocation error:", error);
//                     alert("Joylashuvni aniqlab bo‘lmadi.");
//                 }
//             );
//         }
//     };

//     const openKakaoMap = () => {
//     if (!startCoords || !startAddress || !endAddress) {
//         alert("Iltimos, manzillarni to‘liq kiriting.");
//         return;
//     }

//     const url = `https://map.kakao.com/?sName=${encodeURIComponent(startAddress)}&sX=${startCoords.lng}&sY=${
//         startCoords.lat
//     }&eName=${encodeURIComponent(endAddress)}&target=walk`;

//     // Current tabga redirect
//     window.location.href = url;

//     // Agar yangi tabda ochilishini xohlasangiz:
//     // window.open(url, "_blank");
// };


//     const handlePreviousClick = () => {
//         navigate("/activity");
//     };

//     const handleNextClick = () => {
//         navigate("/camera");
//     };

//     return (
//         <div className="relative w-full h-[800px]">
//             {/* Top navigation buttons */}
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

//             {/* Inputlar va tugmalar */}
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
//                 <button
//                     onClick={refreshLocation}
//                     className="w-[120px] h-[50px] bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//                 >
//                    현위치
//                 </button>
//             </div>

//             {/* Kakao Map container */}
//             <div ref={mapRef} className="w-full h-full" />
//               {isModalOpen2 && (
                
//        <FallModal
//         obstacleType={warningData.timestamp}
//         obstacleId={warningData.alert_id}
//         onClose={handleCloseModal}
//         user_id={user_id}
//         walker_id={walkerId}
//     />
// )}
//         </div>
//     );
// };

// export default KakaoMapRedirect;
