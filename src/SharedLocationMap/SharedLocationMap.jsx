import { useEffect, useRef, useState } from "react";
import axios from "axios";

const SharedLocationMap = () => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markerInstance = useRef(null);
    const [coords, setCoords] = useState({ lat: 37.5665, lng: 126.9780 }); // default Seul

    useEffect(() => {
        const script = document.createElement("script");
        script.async = true;
        script.src =
            "https://dapi.kakao.com/v2/maps/sdk.js?appkey=a700f422b9e4da580b9847f15fce2177&libraries=services&autoload=false";
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                const container = mapRef.current;
                const options = { center: new window.kakao.maps.LatLng(coords.lat, coords.lng), level: 4 };
                const map = new window.kakao.maps.Map(container, options);
                mapInstance.current = map;

                const marker = new window.kakao.maps.Marker({
                    map,
                    position: new window.kakao.maps.LatLng(coords.lat, coords.lng),
                });
                markerInstance.current = marker;
            });
        };
    }, []);

    // Backenddan koordinatalarni olish
    const fetchLocation = async () => {
        try {
            const res = await axios.get("https://gilbeot.up.railway.app/api/gps/kspace");
            const { latitude, longitude } = res.data;
            setCoords({ lat: latitude, lng: longitude });

            if (mapInstance.current && markerInstance.current) {
                const newPos = new window.kakao.maps.LatLng(latitude, longitude);
                mapInstance.current.setCenter(newPos);
                markerInstance.current.setPosition(newPos);
            }
        } catch (err) {
            console.error("Location fetch error:", err);
        }
    };

    // Har 5 soniyada yangilash
    useEffect(() => {
        fetchLocation();
        const interval = setInterval(fetchLocation, 5000);
        return () => clearInterval(interval);
    }, []);

    return <div ref={mapRef} className="w-full h-[600px]" />;
};

export default SharedLocationMap;
