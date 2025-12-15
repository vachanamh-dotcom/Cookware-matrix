import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./Assets/logo.png";

// Placeholder images - replace with actual product images
const redCooker = "https://via.placeholder.com/60x60/C85A54/FFFFFF?text=Red";
const blackCooker = "https://via.placeholder.com/60x60/3C3C3C/FFFFFF?text=Black";

// Popular comparisons - keeping static for MVP
const popularComparisons = [
  { brand1: "Prestige", brand2: "Pigeon", category: "Pressure Cooker" },
  { brand1: "Hawkins", brand2: "Butterfly", category: "Pressure Cooker" },
  { brand1: "Prestige", brand2: "Meyer", category: "Frying Pan" },
  { brand1: "Pigeon", brand2: "Cello", category: "Frying Pan" },
  { brand1: "Vinod", brand2: "Butterfly", category: "Sauce Pan" },
  { brand1: "Prestige", brand2: "Hawkins", category: "Wok" },
  { brand1: "Pigeon", brand2: "Vinod", category: "Kadhai" },
  { brand1: "Prestige", brand2: "Cello", category: "Tawa" },
];

// Reusable Comparison Card Component
function ComparisonCard({ brand1, brand2, category, onClick, delay }) {
  return (
    <div 
      onClick={onClick}
      className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl px-6 py-4 flex items-center justify-between shadow-lg cursor-pointer hover:from-slate-600 hover:to-slate-700 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 animate-slideUpStagger"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2">
        <img src={redCooker} alt={`${brand1} ${category}`} className="w-10 h-10 rounded-lg" />
        <div className="text-white">
          <p className="font-semibold text-sm">{brand1}</p>
          <p className="text-xs text-gray-300">{category}</p>
        </div>
      </div>
      <div className="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md">
        ⚡
      </div>
      <div className="flex items-center gap-2">
        <img src={blackCooker} alt={`${brand2} ${category}`} className="w-10 h-10 rounded-lg" />
        <div className="text-white">
          <p className="font-semibold text-sm">{brand2}</p>
          <p className="text-xs text-gray-300">{category}</p>
        </div>
      </div>
    </div>
  );
}

export default function Compare() {
  const navigate = useNavigate();
  
  // State for fetched data
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
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
    
    if (selectedBrand1 === selectedBrand2) {
      alert('Please select two different brands to compare!');
      return;
    }
    
    setIsComparing(true);
    setTimeout(() => {
      navigate('/comparison-result', {
        state: {
          category: selectedCategory,
          brand1: selectedBrand1,
          brand2: selectedBrand2
        }
      });
    }, 500);
  };

  const handlePopularComparisonClick = (comparison) => {
    navigate('/comparison-result', {
      state: {
        category: comparison.category,
        brand1: comparison.brand1,
        brand2: comparison.brand2
      }
    });
  };

  const currentStep = !selectedCategory ? 1 : !selectedBrand1 ? 2 : !selectedBrand2 ? 3 : 4;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Main Container */}
      <div className="w-full max-w-[1400px] bg-white/10 backdrop-blur-xl rounded-[40px] shadow-2xl overflow-hidden pt-6 px-6 pb-6 border border-white/20 animate-fadeInUp">
        {/* Header Section with rounded top */}
        <div className="w-full bg-gradient-to-r from-slate-700/50 to-slate-800/50 backdrop-blur-sm py-8 px-12 flex items-center justify-between rounded-t-[30px] border-b border-slate-600/30">
          {/* Logo and Title */}
          <div className="flex items-center gap-6">
            <img src={logo} alt="Cookware Matrix logo" className="w-16 h-16 drop-shadow-lg" />
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 text-4xl font-bold">Discover Your Perfect Match</h1>
          </div>
          
          {/* Navigation */}
          <nav className="flex gap-8 text-slate-300 text-base font-medium">
            <Link to="/home" className="hover:text-emerald-400 transition-all hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">Home</Link>
            <Link to="/about" className="hover:text-emerald-400 transition-all hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">About</Link>
            <Link to="/help" className="hover:text-emerald-400 transition-all hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">Help</Link>
          </nav>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center gap-4 py-6 px-12">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                currentStep >= step 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' 
                  : 'bg-slate-600/50 text-slate-400'
              }`}>
                {step}
              </div>
              {step < 4 && (
                <div className={`w-16 h-1 rounded transition-all ${
                  currentStep > step ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-slate-600/50'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="p-12">
          {/* Compare Cookware Section */}
          <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm rounded-3xl p-12 mb-8 border border-slate-600/30 shadow-lg">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-4xl">🍳</span>
              <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 text-4xl font-bold tracking-tight">Compare Cookware</h2>
            </div>
            
            {/* Select The Product */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🔍</span>
                <h3 className="text-slate-200 text-lg font-semibold">Step 1: Select The Product</h3>
              </div>
              <div className="flex justify-center relative">
                <button 
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  disabled={loadingCategories}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-20 py-4 rounded-full text-base font-semibold shadow-xl hover:from-emerald-400 hover:to-teal-400 transition-all hover:scale-105 active:scale-95 relative disabled:opacity-50"
                >
                  {loadingCategories ? "Loading..." : (selectedCategory || "Select A Product Category")}
                </button>
                
                {/* Category Dropdown */}
                {showCategoryDropdown && !loadingCategories && (
                  <div className="absolute top-full mt-2 bg-white rounded-xl shadow-2xl z-50 w-72 max-h-80 overflow-y-auto border border-gray-200 animate-dropdownOpen">
                    {categories.length === 0 ? (
                      <div className="px-6 py-4 text-slate-500 text-center">No categories available</div>
                    ) : (
                      categories.map((category, index) => (
                        <button
                          key={index}
                          onClick={() => handleCategorySelect(category)}
                          className="w-full text-left px-6 py-4 hover:bg-emerald-50 hover:pl-8 transition-all text-slate-700 text-base border-b border-gray-100 last:border-b-0 flex items-center gap-3 group"
                        >
                          <span className="text-2xl opacity-70 group-hover:opacity-100 transition-opacity">🍴</span>
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
                <h3 className="text-slate-200 text-lg font-semibold">Step 2 & 3: Select Brands to Compare</h3>
              </div>
              <div className="flex flex-col items-center gap-6">
                {/* Two product selectors with VS and Swap */}
                <div className="flex items-center gap-4">
                  {/* Brand 1 Selector */}
                  <div className="relative">
                    <button 
                      onClick={() => selectedCategory && setShowBrand1Dropdown(!showBrand1Dropdown)}
                      disabled={!selectedCategory || loadingBrands}
                      className={`${!selectedCategory || loadingBrands ? 'bg-gray-500/50 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 hover:scale-105 active:scale-95'} text-white px-16 py-4 rounded-full text-base font-semibold shadow-xl transition-all`}
                    >
                      {loadingBrands ? "Loading..." : (selectedBrand1 || "Brand 1")}
                    </button>
                    
                    {/* Brand 1 Dropdown */}
                    {showBrand1Dropdown && selectedCategory && !loadingBrands && (
                      <div className="absolute top-full mt-2 bg-white rounded-xl shadow-2xl z-50 w-72 max-h-80 overflow-y-auto border border-gray-200 animate-dropdownOpen">
                        {brands.length === 0 ? (
                          <div className="px-6 py-4 text-slate-500 text-center">No brands available</div>
                        ) : (
                          brands.map((brand, index) => (
                            <button
                              key={index}
                              onClick={() => handleBrand1Select(brand)}
                              className="w-full text-left px-6 py-4 hover:bg-emerald-50 hover:pl-8 transition-all text-slate-700 text-base border-b border-gray-100 last:border-b-0"
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
                    <div className={`${selectedCategory && selectedBrand1 && selectedBrand2 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-slate-600/50'} text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-base shadow-lg transition-all`}>
                      VS
                    </div>
                    {selectedBrand1 && selectedBrand2 && (
                      <button
                        onClick={handleSwapBrands}
                        className="text-emerald-400 text-sm hover:text-emerald-300 transition-all flex items-center gap-1"
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
                      className={`${!selectedCategory || loadingBrands ? 'bg-gray-500/50 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 hover:scale-105 active:scale-95'} text-white px-16 py-4 rounded-full text-base font-semibold shadow-xl transition-all`}
                    >
                      {loadingBrands ? "Loading..." : (selectedBrand2 || "Brand 2")}
                    </button>
                    
                    {/* Brand 2 Dropdown */}
                    {showBrand2Dropdown && selectedCategory && !loadingBrands && (
                      <div className="absolute top-full mt-2 bg-white rounded-xl shadow-2xl z-50 w-72 max-h-80 overflow-y-auto border border-gray-200 animate-dropdownOpen">
                        {brands.length === 0 ? (
                          <div className="px-6 py-4 text-slate-500 text-center">No brands available</div>
                        ) : (
                          brands.map((brand, index) => (
                            <button
                              key={index}
                              onClick={() => handleBrand2Select(brand)}
                              className="w-full text-left px-6 py-4 hover:bg-emerald-50 hover:pl-8 transition-all text-slate-700 text-base border-b border-gray-100 last:border-b-0"
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
                  className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-20 py-4 rounded-full text-lg font-semibold shadow-xl hover:from-slate-500 hover:to-slate-600 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
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

          {/* Popular Comparisons Section */}
          <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm rounded-3xl p-12 border border-slate-600/30 shadow-lg">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl">🔥</span>
              <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 text-3xl font-bold tracking-tight">Popular Comparisons</h2>
            </div>
            
            {/* Grid of comparisons - 2 columns, responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularComparisons.map((comparison, index) => (
                <ComparisonCard
                  key={index}
                  brand1={comparison.brand1}
                  brand2={comparison.brand2}
                  category={comparison.category}
                  onClick={() => handlePopularComparisonClick(comparison)}
                  delay={index * 100}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
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

        @keyframes dropdownOpen {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes slideUpStagger {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }

        .animate-dropdownOpen {
          animation: dropdownOpen 0.2s ease-out;
        }

        .animate-slideUpStagger {
          animation: slideUpStagger 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
}