import React, { useState, useEffect, memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "./Assets/logo.png";
import { formatPrice, getImage } from "./utils/formatters";

// Random value generators for missing data
const randomRating = () => (Math.random() * 2 + 3).toFixed(1); // 3.0 – 5.0
const randomYear = () => Math.floor(Math.random() * 3) + 2022; // 2022–2024
const randomWeight = () => `${(Math.random() * 1.5 + 1).toFixed(1)} kg`;
const randomText = (options) =>
  options[Math.floor(Math.random() * options.length)];

// Comparison data structure (fallback)
const comparisonData = [
  { 
    label: "Release Date", 
    brand1: null, 
    brand2: null,
    type: "year",
    higherIsBetter: true,
    random: "year"
  },
  { 
    label: "Material", 
    brand1: "Stainless Steel", 
    brand2: "Aluminum",
    type: "text",
    brand1Better: true
  },
  { 
    label: "Dimensions", 
    brand1: "25 x 25 x 15 cm", 
    brand2: "24 x 24 x 14 cm",
    type: "text",
    brand1Better: true
  },
  { 
    label: "Weight", 
    brand1: null, 
    brand2: null,
    type: "weight",
    higherIsBetter: false,
    random: "weight"
  },
  { 
    label: "Heat Conductivity", 
    brand1: "Excellent", 
    brand2: "Very Good",
    type: "rating",
    brand1Better: true
  },
  { 
    label: "Heat Retention", 
    brand1: "High", 
    brand2: "Medium",
    type: "rating",
    brand1Better: true
  },
  { 
    label: "Stovetop/Oven compatibility", 
    brand1: "Gas, Induction, Oven", 
    brand2: "Gas, Induction",
    type: "text",
    brand1Better: true
  },
  { 
    label: "Durability/Longevity", 
    brand1: "10+ years", 
    brand2: "5-7 years",
    type: "text",
    brand1Better: true
  },
  { 
    label: "Energy Efficiency", 
    brand1: "A+", 
    brand2: "A",
    type: "grade",
    brand1Better: true
  },
  { 
    label: "Price", 
    brand1: "₹3,500", 
    brand2: "₹2,800",
    type: "price",
    higherIsBetter: false
  },
  { 
    label: "User Ratings", 
    brand1: null, 
    brand2: null,
    type: "rating",
    brand1Better: true,
    random: "rating"
  }
];

// Product images - replace with actual product images
const redCooker = "https://via.placeholder.com/150x150/C85A54/FFFFFF?text=Red+Cooker";
const blackCooker = "https://via.placeholder.com/150x150/3C3C3C/FFFFFF?text=Black+Cooker";

// Reusable Comparison Row Component
const ComparisonRow = memo(({ item, brand1Name, brand2Name, isLast }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getBadge = (isBrand1) => {
    if (item.type === "text" && !item.brand1Better) return "➖";
    
    const brand1Better = item.brand1Better || 
      (item.type === "year" && parseInt(item.brand1) > parseInt(item.brand2)) ||
      (item.type === "weight" && parseFloat(item.brand1) < parseFloat(item.brand2)) ||
      (item.type === "price" && parseInt(item.brand1.replace(/[^0-9]/g, "")) < parseInt(item.brand2.replace(/[^0-9]/g, "")));
    
    if (isBrand1) {
      return brand1Better ? "✔️" : "➖";
    } else {
      return !brand1Better ? "✔️" : "➖";
    }
  };

  const getCellClass = (isBrand1) => {
    const badge = getBadge(isBrand1);
    if (badge === "✔️") return "bg-green-50 border-green-200";
    if (badge === "❌") return "bg-red-50 border-red-200";
    return "bg-slate-50";
  };

  return (
    <div 
      className={`transition-all duration-500 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${!isLast ? 'border-b border-gray-200' : ''}`}
    >
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 py-3 px-4 md:px-8">
        <p className="text-white text-sm md:text-base font-medium text-center">{item.label}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className={`${getCellClass(true)} py-4 px-4 md:px-8 md:border-r border-gray-200 transition-all duration-300`}>
          <p className="text-slate-700 text-sm md:text-base text-center font-medium">
            {getBadge(true)} {item.brand1}
          </p>
          <p className="text-xs text-slate-500 text-center mt-1 md:hidden">{brand1Name}</p>
        </div>
        <div className={`${getCellClass(false)} py-4 px-4 md:px-8 transition-all duration-300 border-t md:border-t-0 border-gray-200`}>
          <p className="text-slate-700 text-sm md:text-base text-center font-medium">
            {getBadge(false)} {item.brand2}
          </p>
          <p className="text-xs text-slate-500 text-center mt-1 md:hidden">{brand2Name}</p>
        </div>
      </div>
    </div>
  );
});

// Product Card Component
const ProductCard = memo(({ image, brand, category, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200 * index);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div 
      className={`bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-4 md:p-8 flex flex-col items-center shadow-lg transition-all duration-700 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <img 
        src={image} 
        alt={`${brand} ${category}`} 
        className="w-32 h-32 md:w-40 md:h-40 object-contain mb-4 md:mb-6 transition-transform duration-300 hover:scale-110 cursor-pointer"
        onError={(e) => {
          e.target.src = "/placeholder.png";
          e.target.onerror = null;
        }}
      />
      <p className="text-white text-base md:text-lg font-semibold text-center">{brand} {category}</p>
    </div>
  );
});

// Sticky Header Component
const StickyHeader = memo(({ brand1, brand2, category }) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`sticky top-0 z-50 transition-all duration-300 ${
      isSticky ? 'shadow-2xl' : ''
    }`}>
      <div className="w-full bg-gradient-to-r from-slate-800 to-slate-900 py-4 md:py-8 px-4 md:px-12 flex items-center gap-2 md:gap-6 rounded-t-[30px]">
        <img src={logo} alt="Cookware Matrix logo" className="w-12 h-12 md:w-16 md:h-16" />
        <h1 className="text-white text-xl md:text-4xl font-bold flex-1 text-center">
          {isSticky ? `${brand1} vs ${brand2}` : 'Discover Your Perfect Match'}
        </h1>
        <nav className="hidden md:flex gap-6 text-white text-sm font-medium">
          <Link to="/home" className="hover:text-emerald-400 transition-colors">Home</Link>
          <Link to="/about" className="hover:text-emerald-400 transition-colors">About</Link>
          <Link to="/help" className="hover:text-emerald-400 transition-colors">Help</Link>
        </nav>
      </div>
    </div>
  );
});

// Breadcrumb Component
const Breadcrumb = () => (
  <div className="mb-6 flex items-center gap-2 text-sm text-slate-600 animate-fade-in">
    <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
    <span>›</span>
    <Link to="/compare" className="hover:text-emerald-600 transition-colors">Compare</Link>
    <span>›</span>
    <span className="text-slate-800 font-medium">Results</span>
  </div>
);

// Conclusion Card Component
const ConclusionCard = memo(({ brand1, brand2, category }) => {
  const brand1Score = 8.5;
  const brand2Score = 7.2;
  const winner = brand1Score > brand2Score ? brand1 : brand2;

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 md:p-8 mb-8 shadow-lg border-2 border-emerald-200 animate-fade-in">
      <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        🏆 Winner: {winner} {category}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-lg font-semibold text-slate-700">{brand1}</p>
          <p className="text-3xl font-bold text-emerald-600">{brand1Score}/10</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-lg font-semibold text-slate-700">{brand2}</p>
          <p className="text-3xl font-bold text-teal-600">{brand2Score}/10</p>
        </div>
      </div>
      <div className="space-y-2 text-slate-700">
        <p className="font-medium">Key Advantages:</p>
        <ul className="list-disc list-inside space-y-1 text-sm md:text-base">
          <li>Superior durability (10+ years)</li>
          <li>Better heat conductivity and retention</li>
          <li>Oven-safe compatibility</li>
          <li>Higher energy efficiency rating</li>
        </ul>
      </div>
    </div>
  );
});

export default function ComparisonResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { category, brand1, brand2 } = location.state || {
    category: "Pressure Cooker",
    brand1: "Prestige",
    brand2: "Pigeon"
  };

  const [products, setProducts] = useState([]);
  const [dynamicComparison, setDynamicComparison] = useState([]);
  const [showToast, setShowToast] = useState(false);

  // Redirect if no data
  useEffect(() => {
    if (!category || !brand1 || !brand2) {
      navigate('/compare');
    }
  }, [category, brand1, brand2, navigate]);

  // Maps display labels to MongoDB fields
  const fieldMap = {
    "Release Date": "releaseYear",
    "Material": "material",
    "Dimensions": "dimensions",
    "Weight": "weight",
    "Heat Conductivity": "heatCompatibility",
    "Heat Retention": "durability",
    "Stovetop/Oven compatibility": "heatCompatibility",
    "Durability/Longevity": "durability",
    "Energy Efficiency": "efficiency",
    "Price": "price",
    "User Ratings": "rating",
  };

  // Fetch Data from Backend
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/cookware/compare?brand1=${brand1}&brand2=${brand2}&category=${category}`
        );
        const data = await res.json();

        // Safety check
        if (!Array.isArray(data)) {
          setProducts([]);
          return;
        }

        setProducts(data);

        // Build comparison values dynamically with proper field mapping
        const extracted = comparisonData.map(row => {
          let brand1Value = data[0]?.[fieldMap[row.label]] ?? row.brand1;
          let brand2Value = data[1]?.[fieldMap[row.label]] ?? row.brand2;

          // Format price values using formatPrice utility
          if (row.label === "Price" && data[0]?.price && data[1]?.price) {
            brand1Value = formatPrice(data[0].price);
            brand2Value = formatPrice(data[1].price);
          }

          return {
            ...row,
            brand1: brand1Value,
            brand2: brand2Value,
          };
        });

        setDynamicComparison(extracted);
        
      } catch (err) {
        console.log("Fetch error:", err);
        setProducts([]);
      }
    }

    fetchData();
  }, [brand1, brand2, category]);

  if (!category || !brand1 || !brand2) {
    return null;
  }

  const handleShare = () => {
    const text = `Check out this comparison: ${brand1} vs ${brand2} ${category}`;
    if (navigator.share) {
      navigator.share({ title: 'Cookware Comparison', text });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem('savedComparisons') || '[]');
    saved.push({ category, brand1, brand2, date: new Date().toISOString() });
    localStorage.setItem('savedComparisons', JSON.stringify(saved));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-2 md:p-4">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-2xl z-50 animate-slide-up">
          ✓ Action completed successfully!
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-[1400px] bg-gradient-to-br from-slate-100 to-gray-50 rounded-[20px] md:rounded-[40px] shadow-2xl overflow-hidden">
        {/* Sticky Header */}
        <StickyHeader brand1={brand1} brand2={brand2} category={category} />

        {/* Main Content */}
        <div className="p-4 md:p-12">
          {/* Breadcrumb */}
          <Breadcrumb />

          {/* Comparison Title Bar */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-t-2xl py-3 md:py-4 px-4 md:px-8 mb-0 shadow-lg">
            <h2 className="text-white text-base md:text-xl font-semibold text-center md:text-left">
              {brand1} {category} vs {brand2} {category}
            </h2>
          </div>

          {/* Product Images Section */}
          <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-b-2xl p-4 md:p-8 mb-8 border-l border-r border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {Array.isArray(products) && products.length > 0 ? (
                products.map((p, i) => (
                  <ProductCard
                    key={i}
                    image={getImage(p.image)}
                    brand={p.brand}
                    category={category}
                    index={i}
                  />
                ))
              ) : (
                <>
                  <ProductCard image={redCooker} brand={brand1} category={category} index={0} />
                  <ProductCard image={blackCooker} brand={brand2} category={category} index={1} />
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6 justify-center md:justify-start">
            <button 
              onClick={handleShare}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105"
            >
              📤 Share
            </button>
            <button 
              onClick={handleSave}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105"
            >
              💾 Save
            </button>
          </div>

          {/* Conclusion Card */}
          <ConclusionCard brand1={brand1} brand2={brand2} category={category} />

          {/* Comparison Table */}
          <div className="bg-white rounded-2xl overflow-hidden mb-8 shadow-lg border border-gray-200">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 py-3 px-4 md:px-8">
              <h3 className="text-white text-base md:text-lg font-semibold">Detailed Comparison</h3>
            </div>
            {(dynamicComparison.length > 0 ? dynamicComparison : comparisonData).map((item, index) => (
              <ComparisonRow
                key={item.label}
                item={item}
                brand1Name={brand1}
                brand2Name={brand2}
                isLast={index === (dynamicComparison.length > 0 ? dynamicComparison : comparisonData).length - 1}
              />
            ))}
          </div>

          {/* Compare Others Button */}
          <div className="flex justify-center">
            <Link to="/compare">
              <button className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-12 md:px-16 py-3 rounded-full text-sm md:text-base font-medium shadow-lg hover:from-slate-800 hover:to-slate-900 transition-all transform hover:scale-105">
                Compare Others
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Back Button */}
      <Link to="/compare">
        <button 
          className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-110 flex items-center justify-center text-2xl z-50"
          title="Back to Compare"
        >
          ⤴
        </button>
      </Link>
    </div>
  );
}