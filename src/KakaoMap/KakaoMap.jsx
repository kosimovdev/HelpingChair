import {useEffect} from "react";
import previous from "../assets/previousImg.png";
import nextLogo from "../assets/nextLogo.png";
import {useNavigate} from "react-router-dom";

const KakaoMap = ({latitude, longitude}) => {
    const navigate = useNavigate();
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=a700f422b9e4da580b9847f15fce2177&autoload=false";
        script.async = true;

        script.onload = () => {
            window.kakao.maps.load(() => {
                const container = document.getElementById("kakao-map");
                const options = {
                    center: new window.kakao.maps.LatLng(latitude, longitude),
                    level: 3,
                };
                const map = new window.kakao.maps.Map(container, options);

                // Marker qo'shish
                const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
                const marker = new window.kakao.maps.Marker({
                    position: markerPosition,
                });
                marker.setMap(map);
            });
        };

        document.head.appendChild(script);

        // Clean up script when component unmounts
        return () => {
            document.head.removeChild(script);
        };
    }, [latitude, longitude]);
    const handlePreviousClick = () => {
        navigate("/activity");
    };

    const handleNextClick = () => {
        navigate("/camera");
    };

    return (
        <div className="w-[800px] flex flex-col justify-center mx-auto">
            <div id="kakao-map" style={{width: "100%", height: "400px", borderRadius: "8px"}}></div>
            <div className="flex items-center justify-between p-1">
                <button
                    onClick={handlePreviousClick}
                    className="flex items-center justify-center rounded-full w-[70px] h-[70px] bg-[#E2E2E2]"
                >
                    <img className={"w-[40px]"} src={previous} alt="previousLogo" />
                </button>
                <button
                    onClick={handleNextClick}
                    className="flex items-center justify-center rounded-full w-[70px] h-[70px] bg-[#E2E2E2]"
                >
                    <img className={"w-[40px]"} src={nextLogo} alt="nextLogo" />
                </button>
            </div>
        </div>
    );
};

export default KakaoMap;

// import {useEffect, useRef, useState} from "react";

// const KakaoMap = () => {
//     const mapRef = useRef(null);
//     const mapContainerRef = useRef(null);
//     const polylineRef = useRef(null);
//     const [startAddress, setStartAddress] = useState("");
//     const [endAddress, setEndAddress] = useState("");

//     const TMAP_API_KEY = "vLwHODVvwK7mKH7Zt6gUJ95LXdQlkgem2GdOzeba";

//     // Load Kakao Map script
//     useEffect(() => {
//         const script = document.createElement("script");
//         script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=a700f422b9e4da580b9847f15fce2177&autoload=false";
//         script.async = true;

//         script.onload = () => {
//             window.kakao.maps.load(() => {
//                 const options = {
//                     center: new window.kakao.maps.LatLng(37.5665, 126.978),
//                     level: 4,
//                 };
//                 const map = new window.kakao.maps.Map(mapContainerRef.current, options);
//                 mapRef.current = map;
//             });
//         };

//         document.head.appendChild(script);
//         return () => document.head.removeChild(script);
//     }, []);

//     // Geocoding manzildan coord olish
//    const geocodeAddress = async (address) => {
//        console.log("Searching address:", address); // ADD THIS
//        const response = await fetch(
//            `https://apis.openapi.sk.com/tmap/geo/fullAddrGeo?version=1&format=json&searchKeyword=${encodeURIComponent(
//                address
//            )}`,
//            {
//                headers: {
//                    appKey: TMAP_API_KEY,
//                },
//            }
//        );

//        const data = await response.json();
//        console.log("Geocoding response:", data); // ADD THIS

//        if (!data.coordinateInfo || !data.coordinateInfo.coordinate || data.coordinateInfo.coordinate.length === 0) {
//            throw new Error("Geocoding failed");
//        }

//        const info = data.coordinateInfo.coordinate[0];
//        return {
//            lat: parseFloat(info.newLat),
//            lng: parseFloat(info.newLon),
//        };
//    };

//     // Piyoda marshrut olish
//     const getRoute = async (start, end) => {
//         const response = await fetch("https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 appKey: TMAP_API_KEY,
//             },
//             body: JSON.stringify({
//                 startX: start.lng,
//                 startY: start.lat,
//                 endX: end.lng,
//                 endY: end.lat,
//                 reqCoordType: "WGS84GEO",
//                 resCoordType: "WGS84GEO",
//             }),
//         });

//         const data = await response.json();
//         const features = data.features;

//         const linePath = features
//         .map((feat) => {
//             if (feat.geometry.type === "LineString") {
//                 return feat.geometry.coordinates.map(([lng, lat]) => new window.kakao.maps.LatLng(lat, lng));
//             }
//             return [];
//         })
//         .flat();

//         // remove old polyline if exists
//         if (polylineRef.current) {
//             polylineRef.current.setMap(null);
//         }

//         const polyline = new window.kakao.maps.Polyline({
//             path: linePath,
//             strokeWeight: 5,
//             strokeColor: "#FF0000",
//             strokeOpacity: 0.8,
//             strokeStyle: "solid",
//         });

//         polyline.setMap(mapRef.current);
//         polylineRef.current = polyline;

//         // Center map to start location
//         mapRef.current.setCenter(new window.kakao.maps.LatLng(start.lat, start.lng));
//     };

//     const handleFindRoute = async () => {
//         try {
//             const startCoord = await geocodeAddress(startAddress);
//             const endCoord = await geocodeAddress(endAddress);
//             await getRoute(startCoord, endCoord);
//         } catch (err) {
//             alert("Manzillarni topib bo‘lmadi. Iltimos, tekshirib qayta urinib ko‘ring.");
//         }
//     };

//     return (
//         <div className="w-[800px] flex flex-col gap-4 mx-auto">
//             <div className="flex gap-2">
//                 <input
//                     value={startAddress}
//                     onChange={(e) => setStartAddress(e.target.value)}
//                     className="border p-2 w-1/2 rounded"
//                     placeholder="Boshlanish manzilini kiriting"
//                 />
//                 <input
//                     value={endAddress}
//                     onChange={(e) => setEndAddress(e.target.value)}
//                     className="border p-2 w-1/2 rounded"
//                     placeholder="Boriladigan manzilini kiriting"
//                 />
//                 <button onClick={handleFindRoute} className="bg-blue-500 text-white px-4 py-2 rounded">
//                     Yo‘lni topish
//                 </button>
//             </div>

//             <div
//                 ref={mapContainerRef}
//                 id="kakao-map"
//                 style={{width: "100%", height: "400px", borderRadius: "8px"}}
//             ></div>
//         </div>
//     );
// };

// export default KakaoMap;

// import {useState} from "react";

// const KakaoMapRedirect = () => {
//     const [endAddress, setEndAddress] = useState("");
//     const [startCoords, setStartCoords] = useState(null);

//     const getCurrentLocation = () => {
//         if (!navigator.geolocation) {
//             alert("Geolokatsiya qo‘llab-quvvatlanmaydi.");
//             return;
//         }

//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const {latitude, longitude} = position.coords;
//                 setStartCoords({lat: latitude, lng: longitude});
//                 alert("Joylashuv olindi!");
//             },
//             () => {
//                 alert("Joylashuvni aniqlab bo‘lmadi.");
//             }
//         );
//     };

//     const openKakaoMap = () => {
//         if (!startCoords || !endAddress) {
//             alert("Iltimos, joylashuv va boriladigan manzilni kiriting.");
//             return;
//         }

//         const url = `https://map.kakao.com/?sName=출발지&sX=${startCoords.lng}&sY=${
//             startCoords.lat
//         }&eName=${encodeURIComponent(endAddress)}&target=walk`;

//         window.open(url, "_blank"); // yangi tabda ochiladi
//     };

//     return (
//         <div className="w-[800px] mx-auto flex flex-col gap-4">
//             <div className="flex gap-2">
//                 <button onClick={getCurrentLocation} className="bg-green-600 text-white px-4 py-2 rounded">
//                     📍 Joylashuvim
//                 </button>
//                 <input
//                     type="text"
//                     placeholder="Boriladigan manzil (koreyscha)"
//                     value={endAddress}
//                     onChange={(e) => setEndAddress(e.target.value)}
//                     className="border p-2 rounded w-full"
//                 />
//                 <button onClick={openKakaoMap} className="bg-blue-500 text-white px-4 py-2 rounded">
//                     길찾기
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default KakaoMapRedirect;
