import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./Assets/logo.png";

export default function Compare() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // State for fetched data
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingBrands, setLoadingBrands] = useState(false);
  
  // State for dropdowns
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand1, setSelectedBrand1] = useState("");
  const [selectedBrand2, setSelectedBrand2] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showBrand1Dropdown, setShowBrand1Dropdown] = useState(false);
  const [showBrand2Dropdown, setShowBrand2Dropdown] = useState(false);
  const [isComparing, setIsComparing] = useState(false);

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

  // Fetch categories on mount
  useEffect(() => {
    fetch("http://localhost:5000/api/cookware")
      .then(res => res.json())
      .then(data => {
        const uniqueCategories = [...new Set(data.map(p => p.category))].filter(Boolean);
        setCategories(uniqueCategories);
        setLoadingCategories(false);
      })
      .catch(() => {
        setLoadingCategories(false);
      });
  }, []);

  // Fetch recommended comparisons
  useEffect(() => {
    fetch("http://localhost:5000/api/cookware/recommended")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecommended(data);
        } else {
          console.error("Recommended data is not an array:", data);
          setRecommended([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching recommended:", error);
        setRecommended([]);
      });
  }, []);

  // Fetch brands when category changes
  useEffect(() => {
    if (!selectedCategory) {
      setBrands([]);
      return;
    }

    setLoadingBrands(true);
    fetch(`http://localhost:5000/api/cookware`)
      .then(res => res.json())
      .then(data => {
        const filteredData = data.filter(p => p.category === selectedCategory);
        const uniqueBrands = [...new Set(filteredData.map(p => p.brand))].filter(Boolean);
        setBrands(uniqueBrands);
        setLoadingBrands(false);
      })
      .catch(() => {
        setBrands([]);
        setLoadingBrands(false);
      });
  }, [selectedCategory]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
    setSelectedBrand1("");
    setSelectedBrand2("");
  };

  const handleBrand1Select = (brand) => {
    setSelectedBrand1(brand);
    setShowBrand1Dropdown(false);
  };

  const handleBrand2Select = (brand) => {
    setSelectedBrand2(brand);
    setShowBrand2Dropdown(false);
  };

  const handleSwapBrands = () => {
    const temp = selectedBrand1;
    setSelectedBrand1(selectedBrand2);
    setSelectedBrand2(temp);
  };

  const handleCompare = () => {
    if (!selectedCategory || !selectedBrand1 || !selectedBrand2) {
      alert('Please select a product category and both brands to compare!');
      return;
    }
    
    setIsComparing(true);
    setTimeout(() => {
      navigate('/select-products', {
        state: {
          category: selectedCategory,
          brand1: selectedBrand1,
          brand2: selectedBrand2
        }
      });
    }, 500);
  };

  const currentStep = !selectedCategory ? 1 : !selectedBrand1 ? 2 : !selectedBrand2 ? 3 : 4;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-900 to-red-950 font-sans relative">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-orange-950/50 z-50">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Animated background blobs with mouse tracking */}
      <div 
        className="absolute top-20 left-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse pointer-events-none"
        style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
      ></div>
      <div 
        className="absolute bottom-20 right-40 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" 
        style={{ animationDelay: '1s', transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)` }}
      ></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-red-500/15 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

      {/* Floating cookware icons */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-floatSlow pointer-events-none">⚖️</div>
      <div className="absolute top-32 right-20 text-5xl opacity-15 animate-floatMedium pointer-events-none" style={{ animationDelay: '1s' }}>🍳</div>
      <div className="absolute bottom-20 left-32 text-7xl opacity-10 animate-floatSlow pointer-events-none" style={{ animationDelay: '2s' }}>🥘</div>
      <div className="absolute top-1/2 right-10 text-4xl opacity-15 animate-floatMedium pointer-events-none" style={{ animationDelay: '1.5s' }}>🍲</div>

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
            <Link to="/home" className="hover:text-amber-300 transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] hover:scale-110 relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/about" className="hover:text-amber-300 transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] hover:scale-110 relative group">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/help" className="hover:text-amber-300 transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] hover:scale-110 relative group">
              Help
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-300"></span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-8 md:pt-16 pb-12">
        <div className="text-center mb-12 animate-scaleIn">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 text-5xl md:text-6xl font-bold leading-tight drop-shadow-lg animate-gradient mb-4">
            Compare Cookware
          </h1>
          <p className="text-amber-100 text-xl md:text-2xl font-light drop-shadow-lg">
            Find the perfect match for your kitchen
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center gap-4 mb-12 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                currentStep >= step 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' 
                  : 'bg-orange-900/50 text-orange-300/50 backdrop-blur-xl'
              }`}>
                {step}
              </div>
              {step < 4 && (
                <div className={`w-16 h-1 rounded transition-all ${
                  currentStep > step ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-orange-900/50'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Compare Section */}
        <div className="relative z-50 animate-slideInLeft bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-[30px] p-6 md:p-10 border-2 border-orange-300/30 shadow-2xl mb-8" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-3 mb-8">
            <span className="text-4xl">🍳</span>
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 animate-gradient">
              Select Products to Compare
            </h2>
          </div>
          
          {/* Select The Product */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🔍</span>
              <h3 className="text-amber-100 text-lg font-semibold">Step 1: Select The Product Category</h3>
            </div>
            <div className="flex justify-center relative">
              <button 
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                disabled={loadingCategories}
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-20 py-4 rounded-full text-base font-semibold shadow-xl hover:from-amber-400 hover:via-orange-400 hover:to-red-400 transition-all hover:scale-105 active:scale-95 relative disabled:opacity-50"
              >
                {loadingCategories ? "Loading..." : (selectedCategory || "Select A Product Category")}
              </button>
              
              {/* Category Dropdown */}
              {showCategoryDropdown && !loadingCategories && (
                <div className="absolute top-full mt-2 bg-gradient-to-br from-orange-900/95 to-red-900/95 backdrop-blur-xl border-2 border-orange-400/40 rounded-xl shadow-2xl z-[9999] w-72 max-h-80 overflow-y-auto animate-fadeIn">
                  {categories.length === 0 ? (
                    <div className="px-6 py-4 text-orange-300 text-center">No categories available</div>
                  ) : (
                    categories.map((category, index) => (
                      <button
                        key={index}
                        onClick={() => handleCategorySelect(category)}
                        className="w-full text-left px-6 py-4 hover:bg-orange-800/50 transition-all text-amber-100 text-base border-b border-orange-400/30 last:border-b-0 flex items-center gap-3"
                      >
                        <span className="text-2xl">🍴</span>
                        <span>{category}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Select Brands */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🏪</span>
              <h3 className="text-amber-100 text-lg font-semibold">Step 2 & 3: Select Brands to Compare</h3>
            </div>
            <div className="flex flex-col items-center gap-6">
              {/* Two product selectors with VS and Swap */}
              <div className="flex items-center gap-4">
                {/* Brand 1 Selector */}
                <div className="relative">
                  <button 
                    onClick={() => selectedCategory && setShowBrand1Dropdown(!showBrand1Dropdown)}
                    disabled={!selectedCategory || loadingBrands}
                    className={`${!selectedCategory || loadingBrands ? 'bg-orange-900/30 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:via-orange-400 hover:to-red-400 hover:scale-105 active:scale-95'} text-white px-16 py-4 rounded-full text-base font-semibold shadow-xl transition-all`}
                  >
                    {loadingBrands ? "Loading..." : (selectedBrand1 || "Brand 1")}
                  </button>
                  
                  {/* Brand 1 Dropdown */}
                  {showBrand1Dropdown && selectedCategory && !loadingBrands && (
                    <div className="absolute top-full mt-2 bg-gradient-to-br from-orange-900/95 to-red-900/95 backdrop-blur-xl border-2 border-orange-400/40 rounded-xl shadow-2xl z-[9999] w-72 max-h-80 overflow-y-auto animate-fadeIn">
                      {brands.length === 0 ? (
                        <div className="px-6 py-4 text-orange-300 text-center">No brands available</div>
                      ) : (
                        brands.map((brand, index) => (
                          <button
                            key={index}
                            onClick={() => handleBrand1Select(brand)}
                            className="w-full text-left px-6 py-4 hover:bg-orange-800/50 transition-all text-amber-100 text-base border-b border-orange-400/30 last:border-b-0"
                          >
                            {brand}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* VS Badge with Swap Button */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`${selectedCategory && selectedBrand1 && selectedBrand2 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-orange-900/50'} text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-base shadow-lg transition-all`}>
                    VS
                  </div>
                  {selectedBrand1 && selectedBrand2 && (
                    <button
                      onClick={handleSwapBrands}
                      className="text-amber-400 text-sm hover:text-amber-300 transition-all flex items-center gap-1"
                      title="Swap brands"
                    >
                      <span>🔄</span> Swap
                    </button>
                  )}
                </div>

                {/* Brand 2 Selector */}
                <div className="relative">
                  <button 
                    onClick={() => selectedCategory && setShowBrand2Dropdown(!showBrand2Dropdown)}
                    disabled={!selectedCategory || loadingBrands}
                    className={`${!selectedCategory || loadingBrands ? 'bg-orange-900/30 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:via-orange-400 hover:to-red-400 hover:scale-105 active:scale-95'} text-white px-16 py-4 rounded-full text-base font-semibold shadow-xl transition-all`}
                  >
                    {loadingBrands ? "Loading..." : (selectedBrand2 || "Brand 2")}
                  </button>
                  
                  {/* Brand 2 Dropdown */}
                  {showBrand2Dropdown && selectedCategory && !loadingBrands && (
                    <div className="absolute top-full mt-2 bg-gradient-to-br from-orange-900/95 to-red-900/95 backdrop-blur-xl border-2 border-orange-400/40 rounded-xl shadow-2xl z-[9999] w-72 max-h-80 overflow-y-auto animate-fadeIn">
                      {brands.length === 0 ? (
                        <div className="px-6 py-4 text-orange-300 text-center">No brands available</div>
                      ) : (
                        brands.map((brand, index) => (
                          <button
                            key={index}
                            onClick={() => handleBrand2Select(brand)}
                            className="w-full text-left px-6 py-4 hover:bg-orange-800/50 transition-all text-amber-100 text-base border-b border-orange-400/30 last:border-b-0"
                          >
                            {brand}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Compare Now Button */}
              <button 
                onClick={handleCompare}
                disabled={isComparing}
                className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white px-20 py-4 rounded-full text-lg font-semibold shadow-xl hover:from-amber-500 hover:via-orange-500 hover:to-red-500 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
              >
                {isComparing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Comparing...
                  </>
                ) : (
                  <>
                    Compare Now
                    <span>⚖️</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Recommended Comparisons */}
        <div className="relative z-10 animate-slideInRight bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-[30px] p-6 md:p-10 border-2 border-orange-300/30 shadow-2xl" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl">✨</span>
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 animate-gradient">
              Recommended Comparisons
            </h2>
          </div>

          {recommended.length === 0 ? (
            <div className="text-center text-orange-300 py-8">
              <div className="text-5xl mb-4 animate-pulse">⚖️</div>
              <p>No recommendations available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommended.map((item, index) => (
                <div
                  key={index}
                  onClick={() =>
                    navigate("/comparison-result", {
                      state: {
                        category: item.category,
                        brand1: item.product1.brand,
                        brand2: item.product2.brand,
                        product1Id: item.product1._id,
                        product2Id: item.product2._id
                      }
                    })
                  }
                  className="group bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 rounded-2xl p-6 hover:border-amber-400/60 hover:from-orange-900/70 hover:to-red-900/70 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20 cursor-pointer animate-fadeInUp"
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product1.image}
                        className="w-12 h-12 object-contain bg-white/10 rounded-lg p-1"
                        alt=""
                      />
                      <div className="text-amber-100">
                        <p className="font-semibold text-sm">{item.product1.brand}</p>
                        <p className="text-xs text-orange-300/80">{item.category}</p>
                      </div>
                    </div>

                    <span className="text-amber-400 font-bold">VS</span>

                    <div className="flex items-center gap-3">
                      <div className="text-right text-amber-100">
                        <p className="font-semibold text-sm">{item.product2.brand}</p>
                        <p className="text-xs text-orange-300/80">{item.category}</p>
                      </div>
                      <img
                        src={item.product2.image}
                        className="w-12 h-12 object-contain bg-white/10 rounded-lg p-1"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              ))}
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
    </div>
  );
}