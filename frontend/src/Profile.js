import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, ArrowLeft, Mail, Calendar, Activity, ShoppingBag, Settings, Sparkles, Heart } from "lucide-react";
import logo from "./Assets/logo.png";
import { formatPrice, getImage } from "./utils/formatters";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [savedComparisons, setSavedComparisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

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

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/auth");
      return;
    }
    setUser(storedUser);
    fetchUserComparisons(storedUser._id || storedUser.id);
  }, [navigate]);

  const fetchUserComparisons = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/comparisons/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setSavedComparisons(data);
      }
    } catch (error) {
      console.error("Error fetching comparisons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const handleViewComparison = (comparison) => {
    navigate("/comparison-result", {
      state: {
        product1: comparison.product1,
        product2: comparison.product2,
        category: comparison.category
      }
    });
  };

  const handleDeleteComparison = async (comparisonId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/comparisons/${comparisonId}`, {
        method: "DELETE"
      });
      
      if (response.ok) {
        setSavedComparisons(savedComparisons.filter(c => c._id !== comparisonId));
      }
    } catch (error) {
      console.error("Error deleting comparison:", error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-900 to-red-950 font-sans relative overflow-hidden">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-orange-950/50 z-50">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Animated background blobs */}
      <div 
        className="absolute top-20 left-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"
        style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
      ></div>
      <div 
        className="absolute bottom-20 right-40 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl animate-pulse" 
        style={{ animationDelay: '1s', transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)` }}
      ></div>
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-red-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Floating cookware icons */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-floatSlow">🍳</div>
      <div className="absolute top-32 right-20 text-5xl opacity-15 animate-floatMedium" style={{ animationDelay: '1s' }}>👤</div>
      <div className="absolute bottom-20 left-32 text-7xl opacity-10 animate-floatSlow" style={{ animationDelay: '2s' }}>⭐</div>

      {/* Navigation */}
      <nav className="relative z-20 flex justify-between items-center px-8 py-6 animate-slideDown">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/home')}>
          <img src={logo} alt="Cookware Matrix logo" className="w-16 h-16 drop-shadow-2xl hover:scale-110 transition-transform" />
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 animate-gradient">
            Cookware Matrix
          </h2>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-amber-100 hover:text-amber-300 transition-all hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] hover:scale-110"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Home</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-900/30 hover:bg-red-900/50 border-2 border-red-500/50 text-red-300 hover:text-red-200 px-4 py-2 rounded-full transition-all backdrop-blur-xl shadow-xl"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 rounded-3xl p-8 mb-8 animate-scaleIn shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-t-3xl"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 flex items-center justify-center text-white text-3xl font-bold shadow-2xl border-4 border-amber-300/50">
              {user.name.charAt(0).toUpperCase()}
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 mb-2 animate-gradient">
                {user.name}
              </h1>
              <div className="flex flex-col md:flex-row items-center gap-4 text-orange-200/80">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Joined Dec 2024</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center bg-orange-950/40 px-6 py-4 rounded-2xl border-2 border-orange-400/30">
                <div className="text-3xl font-bold text-amber-400">{savedComparisons.length}</div>
                <div className="text-xs text-orange-200/80">Comparisons</div>
              </div>
              <div className="text-center bg-orange-950/40 px-6 py-4 rounded-2xl border-2 border-orange-400/30">
                <div className="text-3xl font-bold text-orange-400">0</div>
                <div className="text-xs text-orange-200/80">Saved Items</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 animate-slideInLeft overflow-x-auto" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-2xl border-2 border-amber-300/50"
                : "bg-orange-900/30 text-amber-100 hover:bg-orange-900/50 border-2 border-orange-400/30"
            }`}
          >
            <Activity className="w-5 h-5" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("comparisons")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === "comparisons"
                ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-2xl border-2 border-amber-300/50"
                : "bg-orange-900/30 text-amber-100 hover:bg-orange-900/50 border-2 border-orange-400/30"
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            My Comparisons
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === "settings"
                ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-2xl border-2 border-amber-300/50"
                : "bg-orange-900/30 text-amber-100 hover:bg-orange-900/50 border-2 border-orange-400/30"
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Welcome Card */}
              <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                  <h2 className="text-2xl font-bold text-amber-100">Welcome Back!</h2>
                </div>
                <p className="text-orange-200/80 text-lg mb-6">
                  Ready to find your perfect cookware match?
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/compare')}
                    className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-amber-400 hover:via-orange-400 hover:to-red-400 transition-all transform hover:scale-105 shadow-xl border-2 border-amber-300/50"
                  >
                    Start New Comparison
                  </button>
                  <button
                    onClick={() => navigate('/home')}
                    className="w-full bg-orange-900/40 text-amber-100 py-3 rounded-xl font-semibold hover:bg-orange-900/60 transition-all border-2 border-orange-400/30"
                  >
                    Browse Products
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="w-6 h-6 text-amber-400" />
                  <h2 className="text-2xl font-bold text-amber-100">Your Activity</h2>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-500/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-orange-200">Total Comparisons</span>
                      <span className="text-2xl font-bold text-amber-400">{savedComparisons.length}</span>
                    </div>
                    <div className="w-full bg-orange-950/50 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all" 
                        style={{ width: `${Math.min((savedComparisons.length / 10) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-500/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-orange-200">Account Status</span>
                      <span className="text-lg font-bold text-orange-400">Active</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-red-500/20 to-amber-500/20 border-2 border-red-500/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-orange-200">Member Since</span>
                      <span className="text-lg font-bold text-red-400">Dec 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comparisons Tab */}
          {activeTab === "comparisons" && (
            <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <ShoppingBag className="w-6 h-6 text-amber-400" />
                <h2 className="text-2xl font-bold text-amber-100">Saved Comparisons</h2>
              </div>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 animate-pulse">⏳</div>
                  <p className="text-orange-200/80">Loading your comparisons...</p>
                </div>
              ) : savedComparisons.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-amber-100 text-xl font-bold mb-2">No comparisons yet</h3>
                  <p className="text-orange-200/80 mb-6">Start comparing products to see them here!</p>
                  <button
                    onClick={() => navigate('/compare')}
                    className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-semibold hover:from-amber-400 hover:via-orange-400 hover:to-red-400 transition-all transform hover:scale-105 shadow-xl"
                  >
                    Start Comparing
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedComparisons.map((comparison, index) => (
                    <div
                      key={comparison._id}
                      className="bg-gradient-to-r from-orange-950/50 to-red-950/50 rounded-2xl p-4 md:p-6 border-2 border-orange-400/30 hover:border-amber-400/50 transition-all cursor-pointer animate-fadeInUp"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex flex-col md:flex-row items-center gap-4">
                        {/* Product 1 */}
                        <div className="flex items-center gap-3 flex-1">
                          <img
                            src={getImage(comparison.product1?.image)}
                            alt={comparison.product1?.title}
                            className="w-16 h-16 object-contain rounded-lg bg-white/10 p-2"
                            onError={(e) => {
                              e.target.src = "/placeholder.png";
                            }}
                          />
                          <div className="text-left">
                            <p className="text-amber-100 font-semibold text-sm md:text-base">
                              {comparison.product1?.title || comparison.product1?.brand}
                            </p>
                            <p className="text-orange-200/60 text-xs">
                              {formatPrice(comparison.product1?.price)}
                            </p>
                          </div>
                        </div>

                        {/* VS Badge */}
                        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shadow-xl border-2 border-amber-300/50">
                          VS
                        </div>

                        {/* Product 2 */}
                        <div className="flex items-center gap-3 flex-1 md:flex-row-reverse">
                          <img
                            src={getImage(comparison.product2?.image)}
                            alt={comparison.product2?.title}
                            className="w-16 h-16 object-contain rounded-lg bg-white/10 p-2"
                            onError={(e) => {
                              e.target.src = "/placeholder.png";
                            }}
                          />
                          <div className="text-left md:text-right">
                            <p className="text-amber-100 font-semibold text-sm md:text-base">
                              {comparison.product2?.title || comparison.product2?.brand}
                            </p>
                            <p className="text-orange-200/60 text-xs">
                              {formatPrice(comparison.product2?.price)}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-4 md:mt-0">
                          <button
                            onClick={() => handleViewComparison(comparison)}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteComparison(comparison._id)}
                            className="bg-red-900/40 text-red-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-900/60 transition-all border-2 border-red-500/30"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Account Settings */}
              <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-6 h-6 text-amber-400" />
                  <h2 className="text-2xl font-bold text-amber-100">Account Settings</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-orange-200 mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      className="w-full px-4 py-3 rounded-xl bg-orange-950/40 border-2 border-orange-400/30 text-amber-100 focus:border-amber-400 focus:outline-none transition-all placeholder-orange-300/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-orange-200 mb-2">Email Address</label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full px-4 py-3 rounded-xl bg-orange-950/40 border-2 border-orange-400/30 text-amber-100 focus:border-amber-400 focus:outline-none transition-all placeholder-orange-300/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-orange-200 mb-2">Change Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 rounded-xl bg-orange-950/40 border-2 border-orange-400/30 text-amber-100 placeholder-orange-300/50 focus:border-amber-400 focus:outline-none transition-all"
                    />
                  </div>
                  <button className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-amber-400 hover:via-orange-400 hover:to-red-400 transition-all shadow-xl border-2 border-amber-300/50">
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Settings className="w-6 h-6 text-amber-400" />
                  <h2 className="text-2xl font-bold text-amber-100">Preferences</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-orange-950/30 rounded-xl border-2 border-orange-400/20">
                    <div>
                      <p className="text-amber-100 font-medium">Email Notifications</p>
                      <p className="text-orange-200/60 text-sm">Receive updates about new products</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-orange-950/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-orange-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-amber-500 peer-checked:to-orange-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-orange-950/30 rounded-xl border-2 border-orange-400/20">
                    <div>
                      <p className="text-amber-100 font-medium">Price Alerts</p>
                      <p className="text-orange-200/60 text-sm">Get notified of price drops</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-orange-950/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-orange-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-amber-500 peer-checked:to-orange-500"></div>
                    </label>
                  </div>

                  <div className="p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl">
                    <p className="text-red-400 font-medium mb-2">Danger Zone</p>
                    <p className="text-orange-200/60 text-sm mb-3">Permanently delete your account and all data</p>
                    <button className="bg-red-900/40 hover:bg-red-900/60 border-2 border-red-500/50 text-red-300 px-4 py-2 rounded-lg text-sm font-semibold transition-all">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
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
        .animate-slideInLeft { animation: slideInLeft 0.8s ease-out both; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out both; }
      `}</style>
    </div>
  );
}