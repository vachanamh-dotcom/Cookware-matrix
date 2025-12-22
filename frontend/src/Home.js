// Home.js
import React, { useState, useEffect, useMemo } from "react";
import { Search, Flame, TrendingUp, User, LogOut, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Snowfall from "react-snowfall";
import logo from "./Assets/logo.png";
import { useAuth } from "./App";
import { formatPrice, getImage } from "./utils/formatters";

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [categories, setCategories] = useState([]);
  const [trendingItems, setTrendingItems] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

  // Fixed categories list
  const FIXED_CATEGORIES = [
    { name: "Pressure Cooker", emoji: "🍲" },
    { name: "Frying Pan", emoji: "🍳" },
    { name: "Sauce Pan", emoji: "🥘" },
    { name: "Kadai", emoji: "🍛" },
    { name: "Dosa Tawa", emoji: "🫓" },
    { name: "Paddu Pan", emoji: "🟤" }
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20 - 10,
        y: (e.clientY / window.innerHeight) * 20 - 10
      });
    };

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress((currentScroll / totalScroll) * 100);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fetch categories from backend (now just sets fixed list)
  useEffect(() => {
    setCategories(FIXED_CATEGORIES);
  }, []);

  // Fetch trending products from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/cookware")
      .then(res => res.json())
      .then(data => {
        setTrendingItems(data.slice(0, 4)); // top 4 products
      })
      .catch(err => console.error("Error fetching trending items:", err));
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate('/search', { state: { query: searchQuery } });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate('/category', { state: { category: categoryName } });
  };

  const handleProductView = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleCompareClick = () => {
    if (user) {
      navigate('/compare');
    } else {
      navigate('/auth');
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const handleViewProfile = () => {
    setShowUserMenu(false);
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-900 to-red-950 font-sans relative overflow-hidden">
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

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-orange-950/50 z-50">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

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
      <div className="absolute top-1/2 right-10 text-4xl opacity-15 animate-floatMedium" style={{ animationDelay: '1.5s' }}>🫕</div>

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
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slideDown { animation: slideDown 0.6s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.8s ease-out; }
        .animate-slideInLeft { animation: slideInLeft 0.8s ease-out both; }
        .animate-slideInRight { animation: slideInRight 0.8s ease-out both; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out both; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>

      {/* Navigation */}
      <nav className="relative z-20 flex flex-col md:flex-row justify-between items-center px-4 md:px-8 py-6 animate-slideDown gap-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Cookware Matrix logo" className="w-16 h-16 drop-shadow-2xl hover:scale-110 transition-transform duration-300 cursor-pointer" />
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 animate-gradient">
            Cookware Matrix
          </h2>
        </div>
        <div className="flex items-center gap-4 md:gap-8 flex-wrap justify-center">
          <div className="flex gap-4 md:gap-8 text-amber-100 text-sm md:text-base font-semibold">
            <a href="/home" className="hover:text-amber-300 transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] hover:scale-110 relative group">
              Home
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-300"></span>
            </a>
            <a href="/about" className="hover:text-amber-300 transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] hover:scale-110 relative group">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-300 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="/help" className="hover:text-amber-300 transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] hover:scale-110 relative group">
              Help
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-300 group-hover:w-full transition-all duration-300"></span>
            </a>
            <button 
              onClick={handleCompareClick}
              className="hover:text-amber-300 transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] hover:scale-110 relative group"
            >
              Compare
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-300 group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>
          
          {/* User Authentication Section */}
          {!user ? (
            <button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:from-amber-400 hover:via-orange-400 hover:to-red-400 transition-all transform hover:scale-105 shadow-xl"
            >
              Sign Up
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 bg-orange-500/20 hover:bg-orange-500/30 border-2 border-amber-500/50 rounded-full px-4 py-2 transition-all backdrop-blur-xl"
              >
                <User className="w-5 h-5 text-amber-400" />
                <span className="text-amber-100 text-sm font-medium">{user.name}</span>
              </button>
              
              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-orange-900/95 to-red-900/95 backdrop-blur-xl border-2 border-orange-400/40 rounded-xl shadow-2xl overflow-hidden animate-fadeIn z-50">
                  <div className="px-4 py-3 border-b border-orange-400/30">
                    <p className="text-amber-100 text-sm font-semibold">{user.name}</p>
                    <p className="text-orange-200/80 text-xs">{user.email}</p>
                  </div>
                  <button
                    onClick={handleViewProfile}
                    className="w-full flex items-center gap-2 px-4 py-3 text-left text-amber-100 hover:bg-orange-800/50 transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">View Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-left text-amber-100 hover:bg-orange-800/50 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-8 md:pt-16 pb-12">
        <div className="text-center mb-12 animate-scaleIn">
          <div className="flex items-center justify-center gap-3 mb-6">
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 text-5xl md:text-7xl font-bold leading-tight drop-shadow-lg animate-gradient">
              Cookware Matrix
            </h1>
          </div>
          <p className="text-amber-100 text-xl md:text-2xl font-light mb-12 animate-fadeInUp drop-shadow-lg">
            Find Your Perfect Kitchen Companion
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full blur-xl opacity-0 group-focus-within:opacity-30 transition-opacity duration-500"></div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Search for cookware products..."
                className="relative w-full px-6 py-5 pl-14 rounded-full bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 text-amber-100 placeholder-orange-300/60 text-lg focus:outline-none focus:border-amber-400 transition-all shadow-2xl"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-orange-300 group-focus-within:text-amber-300 transition-colors" />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-6 md:px-8 py-3 rounded-full font-semibold hover:from-amber-400 hover:via-orange-400 hover:to-red-400 transition-all transform hover:scale-105 shadow-xl"
              >
                Search
              </button>

            </div>
          </div>

          {/* Know Your Materials Button */}
          <div className="mt-8 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => navigate('/materials')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-500 hover:via-pink-500 hover:to-rose-500 transition-all transform hover:scale-105 shadow-2xl border-2 border-purple-400/50"
            >
              <Sparkles className="w-5 h-5" />
              Know Your Materials
            </button>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-16 animate-slideInLeft bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-[30px] p-6 md:p-10 border-2 border-orange-300/30 shadow-2xl" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-3 mb-8">
            <Flame className="w-7 h-7 text-amber-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 animate-gradient">
              Browse by Category
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.length > 0 ? (
              categories.map((cat, index) => (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="group relative bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 rounded-2xl p-6 hover:border-amber-400/60 hover:from-orange-900/70 hover:to-red-900/70 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20 animate-fadeInUp"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>
                  <div className="relative text-center">
                    <div className="text-4xl md:text-5xl mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                      {cat.emoji}
                    </div>
                    <h3 className="text-amber-100 font-semibold text-sm md:text-base group-hover:text-amber-200 transition-colors">{cat.name}</h3>
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-6 text-center text-orange-300 py-8">
                <div className="text-5xl mb-4 animate-pulse">🍳</div>
                <p>Loading categories...</p>
              </div>
            )}
          </div>
        </div>

        {/* Trending Section */}
        <div className="animate-slideInRight bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-[30px] p-6 md:p-10 border-2 border-orange-300/30 shadow-2xl" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-7 h-7 text-amber-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 animate-gradient">
              Trending Cookware
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingItems.length > 0 ? (
              trendingItems.map((item, index) => (
                <div
                  key={item._id || index}
                  className="group relative bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 rounded-2xl p-6 hover:border-amber-400/60 hover:from-orange-900/70 hover:to-red-900/70 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20 animate-fadeInUp cursor-pointer flex flex-col h-full"
                  style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>
                  
                  {/* Product Image */}
                  <div className="text-center mb-4 mt-2">
                    <img
                      src={getImage(item.image)}
                      alt={item.title}
                      className="w-32 h-32 object-contain mx-auto mb-3 transform group-hover:scale-110 transition-transform drop-shadow-xl"
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                        e.target.onerror = null;
                      }}
                    />
                  </div>

                  {/* Product Info - flex-grow to push bottom content down */}
                  <div className="flex flex-col flex-grow">
                    <h3 className="text-amber-100 font-bold text-lg leading-tight group-hover:text-amber-200 transition-colors mb-2 min-h-[3.5rem]">{item.title}</h3>
                    <p className="text-orange-200/80 text-sm mb-2">{item.brand}</p>
                    
                    {/* Rating */}
                    <div className="mb-auto">
                      {item.rating && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <span className="text-yellow-400 text-lg">★</span>
                            <span className="text-amber-100 font-semibold ml-1">{item.rating}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Price - Always at bottom */}
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-orange-400/30">
                      <span className="text-amber-400 font-bold text-xl">
                        {formatPrice(item.price)}
                      </span>
                      <button 
                        onClick={() => handleProductView(item._id)}
                        className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-amber-400 hover:via-orange-400 hover:to-red-400 transition-all transform hover:scale-105 shadow-lg"
                      >
                        View
                      </button>                      
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center text-orange-300 py-8">
                <div className="text-6xl mb-4 animate-pulse">🔥</div>
                <p>Loading trending products...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white w-16 h-16 rounded-full shadow-2xl hover:from-amber-500 hover:via-orange-500 hover:to-red-500 transition-all transform hover:scale-110 flex items-center justify-center text-3xl z-50 group border-2 border-amber-400/50"
        title="Back to top"
      >
        <span className="group-hover:-translate-y-1 transition-transform duration-300">↑</span>
      </button>
    </div>
  );
}