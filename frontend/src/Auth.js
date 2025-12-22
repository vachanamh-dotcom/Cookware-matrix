import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Snowfall from "react-snowfall";
import logo from "./Assets/logo.png";
import { useAuth } from "./App"; // ✅ Import useAuth

export default function Auth() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Get login function from context
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: ""
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20 - 10,
        y: (e.clientY / window.innerHeight) * 20 - 10
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const endpoint = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/signup";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Authentication failed");
        return;
      }

      // ✅ SAVE AUTH STATE to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ UPDATE AUTH CONTEXT - This is the missing piece!
      login(data.user, data.token);

      // Navigate to home
      navigate("/home");
    } catch (err) {
      alert("Server error");
    }
  };

  const handleSkip = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-900 to-red-950 flex items-center justify-center font-sans relative overflow-hidden p-4">
      {/* Snowfall Effect */}
      <Snowfall
        color="#fbbf24"
        snowflakeCount={100}
        speed={[0.5, 1.5]}
        wind={[-0.5, 1.0]}
        radius={[0.5, 2.0]}
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          zIndex: 1
        }}
      />

      {/* Animated background blobs with mouse tracking */}
      <div 
        className="absolute top-20 left-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"
        style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
      ></div>
      <div 
        className="absolute bottom-20 right-40 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl animate-pulse" 
        style={{ animationDelay: '1s', transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)` }}
      ></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-red-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Floating cookware icons */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-floatSlow">🍳</div>
      <div className="absolute top-32 right-20 text-5xl opacity-15 animate-floatMedium" style={{ animationDelay: '1s' }}>🍲</div>
      <div className="absolute bottom-20 left-32 text-7xl opacity-10 animate-floatSlow" style={{ animationDelay: '2s' }}>🥘</div>

      {/* CSS animations */}
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        @keyframes floatMedium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(-5deg); }
        }
        .animate-floatSlow {
          animation: floatSlow 8s ease-in-out infinite;
        }
        .animate-floatMedium {
          animation: floatMedium 6s ease-in-out infinite;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.6s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.8s ease-out; }
        .animate-slideInLeft { animation: slideInLeft 0.8s ease-out 0.2s both; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out 0.4s both; }
      `}</style>

      {/* Main card */}
      <div className="relative w-full max-w-[520px] bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl rounded-[30px] shadow-2xl p-8 md:p-12 border-2 border-orange-300/30 z-10 animate-scaleIn hover:border-amber-300/50 transition-all duration-500">

        {/* Logo + header */}
        <div className="text-center mb-8 animate-slideDown">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Cookware Matrix logo" className="w-20 h-20 drop-shadow-2xl hover:scale-110 transition-transform duration-300" />
          </div>
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 text-3xl md:text-4xl font-bold mb-2 animate-gradient">
            {isLogin ? "Welcome Back! 👋" : "Join Us! 🎉"}
          </h1>
          <p className="text-amber-100 text-sm md:text-base">
            {isLogin ? "Log in to continue your cookware journey" : "Create an account to get started"}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex gap-2 mb-8 bg-gradient-to-r from-orange-900/50 to-red-900/50 backdrop-blur-xl p-1.5 rounded-full animate-slideInLeft border-2 border-orange-400/30">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-full font-semibold transition-all ${
              isLogin 
                ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-xl" 
                : "text-amber-200 hover:text-amber-100"
            }`}
          >
            Log In
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-full font-semibold transition-all ${
              !isLogin 
                ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-xl" 
                : "text-amber-200 hover:text-amber-100"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 animate-fadeInUp">

          {/* Name (signup only) */}
          {!isLogin && (
            <div className="animate-slideInLeft">
              <label className="block text-sm font-semibold text-amber-100 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                required={!isLogin}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 text-amber-100 placeholder-orange-300/60 focus:outline-none focus:border-amber-400 transition-all shadow-lg"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-amber-100 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@email.com"
              required
              className="w-full px-4 py-3 rounded-xl bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 text-amber-100 placeholder-orange-300/60 focus:outline-none focus:border-amber-400 transition-all shadow-lg"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-amber-100 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 rounded-xl bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 text-amber-100 placeholder-orange-300/60 focus:outline-none focus:border-amber-400 transition-all shadow-lg"
            />
          </div>

          {/* Confirm Password (signup only) */}
          {!isLogin && (
            <div className="animate-slideInLeft">
              <label className="block text-sm font-semibold text-amber-100 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required={!isLogin}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 text-amber-100 placeholder-orange-300/60 focus:outline-none focus:border-amber-400 transition-all shadow-lg"
              />
            </div>
          )}

          {/* Forgot password */}
          {isLogin && (
            <div className="text-right">
              <button type="button" className="text-sm text-amber-300 hover:text-amber-200 transition-colors font-medium">
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="relative w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white py-4 rounded-xl font-bold shadow-2xl hover:from-amber-400 hover:via-orange-400 hover:to-red-400 transition-all transform hover:scale-105 overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLogin ? "Log In" : "Create Account"}
              <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>

          {/* Skip */}
          <button
            type="button"
            onClick={handleSkip}
            className="w-full bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 text-amber-100 py-4 rounded-xl font-semibold hover:border-amber-400/60 hover:from-orange-900/70 hover:to-red-900/70 transition-all shadow-lg"
          >
            Skip for now
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center animate-fadeInUp" style={{ animationDelay: "0.6s" }}>
          <Link 
            to="/home" 
            className="inline-flex items-center gap-2 text-sm text-amber-300 hover:text-amber-200 transition-colors font-medium group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}