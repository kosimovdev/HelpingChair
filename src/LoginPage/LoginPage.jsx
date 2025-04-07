import React, {useEffect, useState} from "react";
import user from "../services/Auth/Auth.jsx";
import "./LoginStyle.scss";


export default function login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Loading holati
    console.log(localStorage.getItem("userToken"));





    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null)
        setLoading(true)


        try {
            const response = await user.login({email, password});
            console.log("Login muvaffaqiyatli", response.data);
            localStorage.setItem("userToken", response.data.token);
            console.log("Konsolda token:", localStorage.getItem("userToken"));
            alert("Login muvaffaqiyatli");
        } catch (err) {
            setError("Login xatosi: Email yoki parol noto‘g‘ri!")
            console.error(err)
        } finally {
            setLoading(false)
        }

    }

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
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    placeholder="아이디"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full h-[50px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">

                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"

                                    placeholder="핸드폰번호"
                                    className="block w-full h-[50px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>
                        { error && <p className={"text-red-500 text-center"}>{error}</p>  }
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
