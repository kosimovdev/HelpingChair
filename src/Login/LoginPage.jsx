import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import storage from "../services/storage/index.js";
import UserIcon from './UserIcon'
import LockIcon from './LockIcon'
import logo from "../assets/logo.png"; // Logoningizni shu yerga import qiling

const LoginPage = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Camera Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-[170px] h-[170px] bg-[#fff] bg-opacity-50 rounded-full flex items-center justify-center">
             
              <img src={logo} alt="logo" className='w-[170px] ' />
            </div>
          </div>

          {/* Username Input */}
          <div className="relative">
            <div className="absolute  inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-green-600" />
            </div>
            <input
              id="userId"
              name="userId"
              type="text"
              value={userId}
              required
              onChange={(e) => setUserId(e.target.value)}
              placeholder="아이디"
              className="w-full pl-12 pr-4 py-3 bg-[#fff] bg-opacity-50 border-0 rounded-[15px] placeholder-[#000] text-[#000] focus:outline-none focus:ring-2 focus:ring-[#000] focus:bg-opacity-70"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <LockIcon className="h-5 w-5 text-green-600" />
            </div>
            <input
               id="contact"
               name="contact"
               type="tel"
               required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="핸드폰번호"
              autoComplete="current-password"
              className="w-full pl-12 pr-4 py-3 bg-[#fff] bg-opacity-50 border-0 rounded-[15px] placeholder-[#000] text-[#000] focus:outline-none focus:ring-2 focus:ring-[#000] focus:bg-opacity-70"
            />
             {error && <p className={"text-red-500 text-center"}>{error}</p>}
          </div>

          {/* Remember Me and Forgot Password */}
          {/* <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-green-800">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded-[15px]"
              />
             아이디 기억하기
            </label>
            <a href="#" className="text-green-800 hover:text-green-700 underline">
              비밀번호 잊었습니까?
            </a>
          </div> */}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-800 rounded-[15px] hover:bg-purple-900 text-white font-semibold py-3 px-4 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            {loading ? "로그인중..." : "확인"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
