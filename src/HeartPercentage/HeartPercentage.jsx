import {useEffect, useState} from "react";
import "./index.scss";
import previous from "../assets/next.svg";
import nextLogo from "../assets/nextLogo.svg";
import {useNavigate} from "react-router-dom";
import storage from "../services/storage/index.js";
import user from "../services/Auth/Auth.jsx";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import dayjs from "dayjs";

function HeartPercentage() {
    const [bpm, setBpm] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const user_id = storage.get("user_id");

    useEffect(() => {
        if (!user_id) {
            return navigate("/login");
        }
    }, [user_id]);

    const getUserHeartrate = async (user_id) => {
        try {
            setLoading(true);
            const response = await user.getHeartrate(user_id);
            if (response.data) {
                // Optional: sort by time descending
                const sorted = response.data.sort((a, b) => new Date(a.recorded_at) > new Date(b.recorded_at) ? 1 : -1);
                setBpm(sorted);
            }
        } catch (error) {
            console.error("Heart rate olishda xatolik:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserHeartrate(user_id);
    }, [user_id]);

    const handlePreviousClick = () => {
        navigate(-1);
    };

    const handleNextClick = () => {
        navigate("/activity");
    };

    return (<div className={""}>
            <div className="flex flex-col m-auto items-center justify-center HeartMainDiv">
                <div className="w-full max-w-4xl bg-white p-6 rounded-2xl shadow-lg text-center">
                    <h1 className="text-[60px] font-bold">심박수</h1>
                    <div className="relative flex items-center justify-center mt-6 mb-4">
                        <button
                            onClick={handlePreviousClick}
                            className="flex items-center justify-center rounded-full w-[80px] h-[80px] bg-[#E2E2E2]"
                        >
                            <img className={"w-[40px]"} src={previous} alt="previousLogo"/>
                        </button>

                        <div
                            className="mx-4 w-[300px] h-[300px] bg-[#E2FBD7] rounded-full flex items-center justify-center border-[15px] border-green-600">
              <span className="text-[50px] font-bold text-green-700">
                {loading ? "Loading..." : bpm?.[bpm.length - 1]?.heartrate ?? "N/A"}
              </span>
                        </div>

                        <button
                            onClick={handleNextClick}
                            className="flex items-center justify-center rounded-full w-[80px] h-[80px] bg-[#E2E2E2]"
                        >
                            <img className={"w-[40px]"} src={nextLogo} alt="nextLogo"/>
                        </button>
                    </div>

                    <p className="mt-[20px] text-black text-[35px]">
                        <span className="w-[20px] h-[20px] bg-green-600 rounded-full inline-block mr-2"></span> BPM
                    </p>

                    {/* Chart Area */}
                    <div className="mt-8 h-[300px] w-full">
                        {loading ? (<p>Loading chart...</p>) : (<ResponsiveContainer width="100%" height="100%">
                                <LineChart data={bpm}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis
                                        dataKey="recorded_at"
                                        tickFormatter={(time) => dayjs(time).format("HH:mm:ss")}
                                    />
                                    <YAxis/>
                                    <Tooltip labelFormatter={(time) => dayjs(time).format("YYYY-MM-DD HH:mm:ss")}/>
                                    <Line
                                        type="monotone"
                                        dataKey="heartrate"
                                        stroke="#22c55e"
                                        strokeWidth={3}
                                        dot={{r: 4}}
                                        activeDot={{r: 6}}
                                    />
                                </LineChart>
                            </ResponsiveContainer>)}
                    </div>
                </div>
            </div>
        </div>);
}

export default HeartPercentage;
