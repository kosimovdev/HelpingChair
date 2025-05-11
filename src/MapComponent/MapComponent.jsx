import React, {useEffect} from "react";

const MapComponent = () => {
    useEffect(() => {
        console.log(import.meta.env.VITE_KAKAO_MAP_KEY);
        const loadKakaoMap = () => {
            if (window.kakao && window.kakao.maps) {
                initMap();
                return;
            }

            const script = document.createElement("script");
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${
                import.meta.env.VITE_KAKAO_MAP_KEY
            }`;

            script.async = true;

            script.onload = () => {
                window.kakao.maps.load(initMap);
            };

            document.head.appendChild(script);
        };

        const initMap = () => {
            const container = document.getElementById("map");
            const options = {
                center: new window.kakao.maps.LatLng(37.5665, 126.978),
                level: 3,
            };
            const map = new window.kakao.maps.Map(container, options);

            const marker = new window.kakao.maps.Marker({
                position: new window.kakao.maps.LatLng(37.5665, 126.978),
            });
            marker.setMap(map);
        };

        loadKakaoMap();
    }, []);

    return <div id="map" style={{width: "800px", height: "400px"}} />;
};

export default MapComponent;
