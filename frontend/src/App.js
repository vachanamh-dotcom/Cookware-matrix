import React, { createContext, useState, useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import logo from "./Assets/logo.png";
import About from "./About";
import Help from "./Help";
import Auth from "./Auth";
import Home from "./Home";
import UserProfile from "./UserProfile";
import CategoryPage from "./Category";
import Materials from './Materials';
import Compare from "./Compare";
import ProtectedRoute from "./components/ProtectedRoute";
import ComparisonResult from "./ComparisonResult";
import SearchResultsPage from "./SearchResultsPage";
import SelectProducts from "./SelectProducts";
import Profile from "./Profile";
import ProductDetails from './ProductDetails';
// Create Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Auth Provider Component
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isSkipped, setIsSkipped] = useState(false);

  const login = (userData) => {
    setUser(userData);
    setIsSkipped(false);
  };

  const signup = (userData) => {
    setUser(userData);
    setIsSkipped(false);
  };

  const skip = () => {
    setIsSkipped(true);
    setUser(null);
  };

  const logout = () => {
    setUser(null);
    setIsSkipped(false);
  };

  return (
    <AuthContext.Provider value={{ user, isSkipped, login, signup, skip, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Logo SVG Component
function LogoSVG() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" className="drop-shadow-2xl">
      {/* Pan body */}
      <ellipse cx="80" cy="90" rx="60" ry="50" fill="url(#panGradient)" stroke="#d97706" strokeWidth="3"/>
      {/* Pan handle */}
      <rect x="130" y="85" width="25" height="10" rx="5" fill="url(#handleGradient)" stroke="#92400e" strokeWidth="2"/>
      {/* Shine effect */}
      <ellipse cx="65" cy="75" rx="20" ry="15" fill="white" opacity="0.3"/>
      {/* Steam */}
      <path d="M 60 40 Q 55 25 60 10" stroke="#fb923c" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7">
        <animate attributeName="d" values="M 60 40 Q 55 25 60 10; M 60 40 Q 65 25 60 10; M 60 40 Q 55 25 60 10" dur="2s" repeatCount="indefinite"/>
      </path>
      <path d="M 80 35 Q 75 20 80 5" stroke="#fb923c" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7">
        <animate attributeName="d" values="M 80 35 Q 75 20 80 5; M 80 35 Q 85 20 80 5; M 80 35 Q 75 20 80 5" dur="2.3s" repeatCount="indefinite"/>
      </path>
      <path d="M 100 40 Q 95 25 100 10" stroke="#fb923c" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7">
        <animate attributeName="d" values="M 100 40 Q 95 25 100 10; M 100 40 Q 105 25 100 10; M 100 40 Q 95 25 100 10" dur="1.8s" repeatCount="indefinite"/>
      </path>
      <defs>
        <linearGradient id="panGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="handleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function LandingPage() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-900 to-red-950 flex items-center justify-center font-sans relative overflow-hidden p-8">
      {/* Animated background elements */}
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
      <div className="absolute bottom-40 right-40 text-4xl opacity-20 animate-floatMedium" style={{ animationDelay: '0.5s' }}>🫕</div>
      
      {/* Vertical stripe on the right with gradient */}
      <div className="absolute right-[22%] top-0 h-full w-[15%] bg-gradient-to-b from-orange-800/40 via-red-900/40 to-amber-900/40 backdrop-blur-sm border-l border-r border-orange-500/20"></div>

      {/* Navigation bar with hover effects */}
      <div className="absolute top-8 right-[23%] z-20 animate-slideDown">
        <nav className="flex gap-10 text-white text-base font-semibold tracking-wide">
          <Link 
            to="/home" 
            className="hover:text-amber-300 transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] hover:scale-110 relative group"
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-300 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            to="/about" 
            className="hover:text-amber-300 transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] hover:scale-110 relative group"
          >
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-300 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            to="/help" 
            className="hover:text-amber-300 transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] hover:scale-110 relative group"
          >
            Help
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-300 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </nav>
      </div>

      {/* Main card with enhanced glassmorphism */}
      <div className="relative z-10 w-[90%] max-w-[1200px] bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl rounded-[50px] shadow-2xl p-20 mr-[8%] border-2 border-orange-300/30 animate-scaleIn hover:border-amber-300/50 transition-all duration-500 group">
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 rounded-[50px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-shimmer"></div>
        
        {/* Logo and Title */}
        <div className="flex items-center gap-8 mb-12 animate-slideInLeft relative">
          <div className="animate-fadeInRotate hover:scale-110 transition-transform duration-500">
            <LogoSVG />
          </div>
          <div>
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 text-[5.5rem] font-bold leading-[1.1] tracking-tight drop-shadow-2xl animate-gradient">
              COOKWARE<br />MATRIX
            </h1>
            <p className="text-amber-100 text-xl mt-4 font-light tracking-wide animate-fadeIn">
              Your intelligent cookware comparison platform
            </p>
          </div>
        </div>
        
        {/* Button with pulsing glow */}
        <Link to="/Auth">
          <button
            className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-12 py-5 rounded-full text-xl font-bold shadow-2xl hover:from-amber-400 hover:via-orange-400 hover:to-red-400 transition-all duration-300 transform hover:scale-110 hover:shadow-orange-500/60 animate-fadeInUp group overflow-hidden"
            type="button"
          >
            <span className="relative z-10 flex items-center gap-2">
              Let's get started 
              <span className="inline-block group-hover:translate-x-2 transition-transform duration-300">→</span>
            </span>
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            {/* Pulsing glow */}
            <div className="absolute inset-0 rounded-full bg-orange-400/50 blur-xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </Link>
      </div>

      {/* Info bubble with enhanced animation */}
      <div className="absolute right-[20%] top-[36%] -translate-y-1/2 z-30 animate-slideInRight">
        <div className="bg-gradient-to-br from-orange-700/95 via-red-800/95 to-amber-900/95 backdrop-blur-xl text-white p-8 rounded-3xl shadow-2xl w-[320px] relative border-2 border-orange-400/40 animate-float hover:scale-105 transition-transform duration-300">
          {/* Glowing border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-400/30 to-red-400/30 blur-xl -z-10"></div>
          
          {/* Speech bubble pointer with gradient */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[20px] border-t-red-800/95 filter drop-shadow-lg"></div>
          
          {/* Icon */}
          <div className="text-4xl mb-3 animate-bounce">👨‍🍳</div>
          
          <p className="text-base leading-relaxed text-amber-50 font-medium">
            Cookware Matrix helps you choose the best pots and pans. We provide simple, clear comparisons so you can find the right tools for your kitchen. Stop guessing, start cooking.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInRotate {
          from {
            opacity: 0;
            transform: rotate(-15deg) scale(0.8);
          }
          to {
            opacity: 1;
            transform: rotate(0deg) scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(5deg);
          }
        }

        @keyframes floatMedium {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(-5deg);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.8s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 1s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 1s ease-out 0.3s both;
        }

        .animate-slideInRight {
          animation: slideInRight 1s ease-out 0.5s both;
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out 0.8s both;
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out 0.5s both;
        }

        .animate-fadeInRotate {
          animation: fadeInRotate 1s ease-out 0.4s both;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-floatSlow {
          animation: floatSlow 8s ease-in-out infinite;
        }

        .animate-floatMedium {
          animation: floatMedium 6s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/auth" element={<Auth />} /> 
          <Route path="/about" element={<About />} />
          <Route path="/select-products" element={<SelectProducts />} />
          <Route path="/help" element={<Help />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/compare" element={
            <ProtectedRoute>
              <Compare />
            </ProtectedRoute>
          } />
          <Route path="/user-profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/comparison-result" element={<ComparisonResult />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}