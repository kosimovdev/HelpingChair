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
        <div>
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
