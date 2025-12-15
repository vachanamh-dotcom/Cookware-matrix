// Home.js
import React, { useState, useEffect } from "react";
import { Search, Flame, TrendingUp, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

  // Fixed categories list
  const FIXED_CATEGORIES = [
    { name: "Pressure Cooker", emoji: "🍲" },
    { name: "Frying Pan", emoji: "🍳" },
    { name: "Sauce Pan", emoji: "🥘" },
    { name: "Kadai", emoji: "🍛" },
    { name: "Dosa Tawa", emoji: "🫓" },
    { name: "Paddu Pan", emoji: "🟤" }
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-sans relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Navigation */}
      <nav className="relative z-20 flex justify-between items-center px-8 py-6 animate-slideDown">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Cookware Matrix logo" className="w-16 h-16 drop-shadow-2xl animate-fadeInRotate" />
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            Cookware Matrix
          </h2>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex gap-8 text-white text-base font-medium">
            <a href="/home" className="hover:text-emerald-400 transition-all hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">Home</a>
            <a href="/about" className="hover:text-emerald-400 transition-all hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">About</a>
            <a href="/help" className="hover:text-emerald-400 transition-all hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">Help</a>
            <button 
              onClick={handleCompareClick}
              className="hover:text-emerald-400 transition-all hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
            >
              Compare
            </button>
          </div>
          
          {/* User Authentication Section */}
          {!user ? (
            <button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:from-emerald-400 hover:to-teal-400 transition-all transform hover:scale-105 shadow-lg"
            >
              Sign Up
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 rounded-full px-4 py-2 transition-all"
              >
                <User className="w-5 h-5 text-emerald-400" />
                <span className="text-white text-sm font-medium">{user.name}</span>
              </button>
              
              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-fadeIn z-50">
                  <div className="px-4 py-3 border-b border-slate-700">
                    <p className="text-white text-sm font-semibold">{user.name}</p>
                    <p className="text-slate-400 text-xs">{user.email}</p>
                  </div>
                  <button
                    onClick={handleViewProfile}
                    className="w-full flex items-center gap-2 px-4 py-3 text-left text-slate-300 hover:bg-slate-700 transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">View Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-left text-slate-300 hover:bg-slate-700 transition-all"
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
      <div className="relative z-10 max-w-6xl mx-auto px-8 pt-16 pb-12">
        <div className="text-center mb-12 animate-scaleIn">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-7xl font-bold leading-tight mb-6 drop-shadow-lg">
            Cookware Matrix
          </h1>
          <p className="text-slate-300 text-2xl font-light mb-12 animate-fadeInUp">
            Find Your Perfect Kitchen Companion
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Search for cookware products..."
                className="w-full px-6 py-5 pl-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-slate-400 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all shadow-2xl"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-full font-semibold hover:from-emerald-400 hover:to-teal-400 transition-all transform hover:scale-105 shadow-lg"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-16 animate-slideInLeft" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-3 mb-8">
            <Flame className="w-7 h-7 text-emerald-400" />
            <h2 className="text-3xl font-bold text-white">Browse by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.length > 0 ? (
              categories.map((cat, index) => (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all transform hover:scale-105 hover:shadow-2xl animate-fadeInUp"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <div className="relative text-center">
                    <div className="text-5xl mb-3">
                      {cat.emoji}
                    </div>
                    <h3 className="text-white font-semibold text-lg">{cat.name}</h3>
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-4 text-center text-slate-400 py-8">
                Loading categories...
              </div>
            )}
          </div>
        </div>

        {/* Trending Section */}
        <div className="animate-slideInRight" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-7 h-7 text-emerald-400" />
            <h2 className="text-3xl font-bold text-white">Trending Cookware</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingItems.length > 0 ? (
              trendingItems.map((item, index) => (
                <div
                  key={item._id || index}
                  className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all transform hover:scale-105 hover:shadow-2xl animate-fadeInUp cursor-pointer"
                  style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                >
                  {/* Product Image */}
                  <div className="text-center mb-4">
                    <img
                      src={getImage(item.image)}
                      alt={item.title}
                      className="w-32 h-32 object-contain mx-auto mb-3 transform group-hover:scale-110 transition-transform"
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                        e.target.onerror = null;
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <h3 className="text-white font-bold text-lg leading-tight">{item.title}</h3>
                    <p className="text-slate-400 text-sm">{item.brand}</p>
                    
                    {/* Rating */}
                    {item.rating && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <span className="text-yellow-400 text-lg">★</span>
                          <span className="text-white font-semibold ml-1">{item.rating}</span>
                        </div>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-emerald-400 font-bold text-xl">
                        {formatPrice(item.price)}
                      </span>
                      <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-emerald-400 hover:to-teal-400 transition-all transform hover:scale-105">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center text-slate-400 py-8">
                Loading trending products...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animations style */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .animate-slideDown { animation: slideDown 0.6s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.8s ease-out; }
        .animate-slideInLeft { animation: slideInLeft 0.8s ease-out both; }
        .animate-slideInRight { animation: slideInRight 0.8s ease-out both; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out both; }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
}