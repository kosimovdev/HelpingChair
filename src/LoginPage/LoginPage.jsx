import  {useState} from "react";
import {useNavigate} from "react-router-dom";
import storage from "../services/storage/index.js";


export default function login() {
    const [userId, setUserId] = useState("");
    const [contact, setContact] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (userId && contact) {
            storage.set("user_id", userId);
            storage.set("contact", contact);
        }
        return navigate("/");
    };

    return (
        <>
            <div className="loginMainDiv flex min-h-full flex-1 flex-col justify-center">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-[60px] font-bold tracking-tight text-gray-900">
                        로그인
                    </h2>
                </div>
                <div className="mt-10 mx-auto w-[500px] ">
                    <form onSubmit={handleLogin} action="#" method="POST" className="space-y-6">
                        <div>
                            <div className="mt-2">
                                <input
                                    id="userId"
                                    name="userId"
                                    type="text"
                                    required
                                    placeholder="아이디"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    className="block w-full h-[50px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">

                            </div>
                            <div className="mt-2">
                                <input
                                    id="contact"
                                    name="contact"
                                    type="tel"
                                    required
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    autoComplete="current-password"
                                    placeholder="핸드폰번호"
                                    className="block w-full h-[50px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>
                        {error && <p className={"text-red-500 text-center"}>{error}</p>}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-[150px] h-[50px] justify-center mx-auto text-[20px] items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                {loading ? "로그인중..." : "확인"}
                            </button>
                        </div>
                    </form>


                </div>
            </div>
        </>
    )
}