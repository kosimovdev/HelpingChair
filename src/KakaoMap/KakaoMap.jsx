import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
// import previous from "../assets/previousImg.png";
// import nextLogo from "../assets/nextLogo.png";

const KakaoMapRedirect = () => {
    const mapRef = useRef(null); // DOM element uchun ref

    const [startCoords, setStartCoords] = useState(null);
    const [startAddress, setStartAddress] = useState("");
    const [endAddress, setEndAddress] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setStartCoords({lat, lng});

                    const script = document.createElement("script");
                    script.async = true;
                    script.src =
                        "https://dapi.kakao.com/v2/maps/sdk.js?appkey=a700f422b9e4da580b9847f15fce2177&libraries=services&autoload=false";
                    document.head.appendChild(script);

                    script.onload = () => {
                        window.kakao.maps.load(() => {
                            // ⚠️ DOM elementni to'g'ridan to'g'ri ref orqali olamiz
                            const container = mapRef.current;
                            const options = {
                                center: new window.kakao.maps.LatLng(lat, lng),
                                level: 3,
                            };
                            const map = new window.kakao.maps.Map(container, options);

                            new window.kakao.maps.Marker({
                                map,
                                position: new window.kakao.maps.LatLng(lat, lng),
                            });

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
                    alert("Joylashuvni aniqlab bo‘lmadi.");
                }
            );
        } else {
            alert("Brauzeringiz geolokatsiyani qo‘llab-quvvatlamaydi.");
        }
    }, []);

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
        <div className="relative w-full h-[480px]">
            <div className="absolute w-full z-10 top-[45%]">
                <div className="flex items-center justify-between p-1">
                    <button
                        onClick={handlePreviousClick}
                        className="flex items-center justify-center rounded-full w-[70px] h-[70px] bg-[#E2E2E2]"
                    >
                        <img className="w-[40px]" src="/images/previousImg.png" alt="previous" />
                    </button>
                    <button
                        onClick={handleNextClick}
                        className="flex items-center justify-center rounded-full w-[70px] h-[70px] bg-[#E2E2E2]"
                    >
                        <img className="w-[40px]" src="/images/nextLogo.png" alt="next" />
                    </button>
                </div>
            </div>
            {/* Inputlar */}
            <div className="absolute top-4 left-1/2 h-[70px] -translate-x-1/2 bg-white shadow-md rounded p-2 z-10 w-[90%] flex gap-2 items-center">
                <input
                    type="text"
                    placeholder="장소*주소*버스 검색 "
                    value={endAddress}
                    onChange={(e) => setEndAddress(e.target.value)}
                    className="border p-2 rounded w-full"
                />
                <button
                    onClick={openKakaoMap}
                    className="w-[80px] bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    길찾기
                </button>
            </div>

            {/* Kakao Map container */}
            <div ref={mapRef} className="w-full h-full" />
        </div>
    );
};

export default KakaoMapRedirect;

// import {useEffect} from "react";
// import previous from "../assets/previousImg.png";
// import nextLogo from "../assets/nextLogo.png";
// import {useNavigate} from "react-router-dom";

// const KakaoMap = ({latitude, longitude}) => {
// const navigate = useNavigate();
//     useEffect(() => {
//         const script = document.createElement("script");
//         script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=a700f422b9e4da580b9847f15fce2177&autoload=false";
//         script.async = true;

//         script.onload = () => {
//             window.kakao.maps.load(() => {
//                 const container = document.getElementById("kakao-map");
//                 const options = {
//                     center: new window.kakao.maps.LatLng(latitude, longitude),
//                     level: 3,
//                 };
//                 const map = new window.kakao.maps.Map(container, options);

//                 // Marker qo'shish
//                 const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
//                 const marker = new window.kakao.maps.Marker({
//                     position: markerPosition,
//                 });
//                 marker.setMap(map);
//             });
//         };

//         document.head.appendChild(script);

//         // Clean up script when component unmounts
//         return () => {
//             document.head.removeChild(script);
//         };
//     }, [latitude, longitude]);
// const handlePreviousClick = () => {
//     navigate("/activity");
// };

// const handleNextClick = () => {
//     navigate("/camera");
// };

//     return (
//         <div className="w-[800px] flex flex-col justify-center mx-auto">
//             <div id="kakao-map" style={{width: "100%", height: "400px", borderRadius: "8px"}}></div>
// <div className="flex items-center justify-between p-1">
//     <button
//         onClick={handlePreviousClick}
//         className="flex items-center justify-center rounded-full w-[70px] h-[70px] bg-[#E2E2E2]"
//     >
//         <img className={"w-[40px]"} src={previous} alt="previousLogo" />
//     </button>
//     <button
//         onClick={handleNextClick}
//         className="flex items-center justify-center rounded-full w-[70px] h-[70px] bg-[#E2E2E2]"
//     >
//         <img className={"w-[40px]"} src={nextLogo} alt="nextLogo" />
//     </button>
// </div>
//         </div>
//     );
// };

// export default KakaoMap;

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
