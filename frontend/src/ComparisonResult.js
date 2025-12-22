import React, { useState, useEffect, memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "./Assets/logo.png";
import { formatPrice, getImage } from "./utils/formatters";

// Comparison data structure
const comparisonData = [
  { 
    label: "Release Date", 
    field: "releaseYear",
    type: "year",
    higherIsBetter: true,
    icon: "📅"
  },
  { 
    label: "Material", 
    field: "material",
    type: "text",
    icon: "🔨"
  },
  { 
    label: "Dimensions", 
    field: "dimensions",
    type: "text",
    icon: "📏"
  },
  { 
    label: "Weight", 
    field: "weight",
    type: "weight",
    higherIsBetter: false,
    icon: "⚖️"
  },
  { 
    label: "Heat Compatibility", 
    field: "heatCompatibility",
    type: "text",
    icon: "🔥"
  },
  { 
    label: "Durability/Longevity", 
    field: "durability",
    type: "text",
    icon: "💪"
  },
  { 
    label: "Energy Efficiency", 
    field: "efficiency",
    type: "grade",
    icon: "⚡"
  },
  { 
    label: "Price", 
    field: "price",
    type: "price",
    higherIsBetter: false,
    icon: "💰"
  },
  { 
    label: "User Ratings", 
    field: "rating",
    type: "rating",
    higherIsBetter: true,
    icon: "⭐"
  }
];

// Reusable Comparison Row Component
const ComparisonRow = memo(({ item, product1, product2, isLast }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const value1 = product1?.[item.field] || "N/A";
  const value2 = product2?.[item.field] || "N/A";

  const displayValue1 = item.type === "price" && typeof value1 === "number" 
    ? formatPrice(value1) 
    : value1;
  const displayValue2 = item.type === "price" && typeof value2 === "number" 
    ? formatPrice(value2) 
    : value2;

  const getBadge = (isProduct1) => {
    if (value1 === "N/A" || value2 === "N/A") return "➖";
    if (value1 === value2) return "➖";
    
    let product1Better = false;
    
    if (item.type === "year" || item.type === "rating") {
      product1Better = parseFloat(value1) > parseFloat(value2);
    } else if (item.type === "weight") {
      product1Better = parseFloat(value1) < parseFloat(value2);
    } else if (item.type === "price") {
      product1Better = parseFloat(value1) < parseFloat(value2);
    } else if (item.type === "grade") {
      const grades = ["C", "B", "A", "A+", "A++"];
      product1Better = grades.indexOf(value1) > grades.indexOf(value2);
    }
    
    if (isProduct1) {
      return product1Better ? "✨" : "➖";
    } else {
      return !product1Better ? "✨" : "➖";
    }
  };

  const getCellClass = (isProduct1) => {
    const badge = getBadge(isProduct1);
    if (badge === "✨") return "bg-gradient-to-br from-amber-100/50 to-orange-100/50 border-amber-300/50";
    return "bg-gradient-to-br from-orange-900/20 to-red-900/20";
  };

  return (
    <div 
      className={`transition-all duration-500 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${!isLast ? 'border-b-2 border-orange-400/30' : ''}`}
    >
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 py-4 px-4 md:px-8">
        <p className="text-white text-sm md:text-base font-semibold text-center flex items-center justify-center gap-2">
          <span className="text-lg">{item.icon}</span>
          {item.label}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className={`${getCellClass(true)} py-5 px-4 md:px-8 md:border-r-2 border-orange-400/30 transition-all duration-300 backdrop-blur-sm`}>
          <p className="text-amber-100 text-sm md:text-base text-center font-semibold">
            <span className="text-xl mr-2">{getBadge(true)}</span>
            {displayValue1}
          </p>
          <p className="text-xs text-orange-200/80 text-center mt-1 md:hidden">{product1?.brand} - {product1?.title}</p>
        </div>
        <div className={`${getCellClass(false)} py-5 px-4 md:px-8 transition-all duration-300 border-t-2 md:border-t-0 border-orange-400/30 backdrop-blur-sm`}>
          <p className="text-amber-100 text-sm md:text-base text-center font-semibold">
            <span className="text-xl mr-2">{getBadge(false)}</span>
            {displayValue2}
          </p>
          <p className="text-xs text-orange-200/80 text-center mt-1 md:hidden">{product2?.brand} - {product2?.title}</p>
        </div>
      </div>
    </div>
  );
});

// Product Card Component
const ProductCard = memo(({ product, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200 * index);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div 
      className={`bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 rounded-3xl p-6 md:p-8 flex flex-col items-center shadow-2xl transition-all duration-700 transform hover:scale-105 hover:border-amber-400/60 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-t-3xl"></div>
      <img 
        src={getImage(product?.image)} 
        alt={`${product?.brand} ${product?.category}`} 
        className="w-32 h-32 md:w-48 md:h-48 object-contain mb-4 md:mb-6 transition-transform duration-300 hover:scale-110 cursor-pointer drop-shadow-2xl"
        onError={(e) => {
          e.target.src = "/placeholder.png";
          e.target.onerror = null;
        }}
      />
      <p className="text-amber-100 text-base md:text-xl font-bold text-center mb-2">{product?.title || `${product?.brand} ${product?.category}`}</p>
      <p className="text-orange-200/80 text-sm text-center">{product?.brand}</p>
      {product?.rating && (
        <div className="mt-3 bg-orange-950/50 px-3 py-1 rounded-full flex items-center gap-1">
          <span className="text-yellow-400">★</span>
          <span className="text-amber-100 font-semibold text-sm">{product.rating}</span>
        </div>
      )}
    </div>
  );
});

// Sticky Header Component
const StickyHeader = memo(({ product1, product2 }) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const display1 = product1?.title || `${product1?.brand} ${product1?.category}`;
  const display2 = product2?.title || `${product2?.brand} ${product2?.category}`;

  return (
    <div className={`sticky top-0 z-50 transition-all duration-300 ${
      isSticky ? 'shadow-2xl' : ''
    }`}>
      <div className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 py-4 md:py-6 px-4 md:px-12 flex items-center gap-2 md:gap-6 rounded-t-[30px]">
        <img src={logo} alt="Cookware Matrix logo" className="w-12 h-12 md:w-16 md:h-16 drop-shadow-2xl hover:scale-110 transition-transform" />
        <h1 className="text-white text-xl md:text-4xl font-bold flex-1 text-center drop-shadow-lg">
          {isSticky ? (
            <span className="text-base md:text-2xl animate-gradient">{display1} ⚡ {display2}</span>
          ) : (
            <span className="animate-gradient">Discover Your Perfect Match</span>
          )}
        </h1>
        <nav className="hidden md:flex gap-6 text-amber-100 text-sm font-semibold">
          <Link to="/home" className="hover:text-white transition-all hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] hover:scale-110">Home</Link>
          <Link to="/about" className="hover:text-white transition-all hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] hover:scale-110">About</Link>
          <Link to="/help" className="hover:text-white transition-all hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] hover:scale-110">Help</Link>
        </nav>
      </div>
    </div>
  );
});

// Breadcrumb Component
const Breadcrumb = () => (
  <div className="mb-6 flex items-center gap-2 text-sm text-orange-200/80 animate-fadeIn">
    <Link to="/" className="hover:text-amber-300 transition-all hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">Home</Link>
    <span className="text-amber-400">›</span>
    <Link to="/compare" className="hover:text-amber-300 transition-all hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">Compare</Link>
    <span className="text-amber-400">›</span>
    <Link to="/select-products" className="hover:text-amber-300 transition-all hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">Select Products</Link>
    <span className="text-amber-400">›</span>
    <span className="text-amber-100 font-semibold">Results</span>
  </div>
);

// Conclusion Card Component
const ConclusionCard = memo(({ product1, product2 }) => {
  const calculateScore = (product) => {
    let score = 5;
    if (product.rating) score += parseFloat(product.rating) / 2;
    if (product.efficiency === "A++" || product.efficiency === "A+") score += 1;
    if (product.durability === "High") score += 0.5;
    return Math.min(score, 10).toFixed(1);
  };

  const score1 = calculateScore(product1);
  const score2 = calculateScore(product2);
  const winner = parseFloat(score1) > parseFloat(score2) ? product1 : 
                 parseFloat(score1) < parseFloat(score2) ? product2 : null;

  const display1 = product1?.title || `${product1?.brand} ${product1?.category}`;
  const display2 = product2?.title || `${product2?.brand} ${product2?.category}`;

  return (
    <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-xl rounded-3xl p-6 md:p-8 mb-8 shadow-2xl border-2 border-amber-400/50 animate-scaleIn">
      <h3 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 mb-6 flex items-center gap-3 animate-gradient">
        {winner ? `🏆 Winner: ${winner?.title || winner?.brand}` : '🤝 It\'s a Tie!'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 backdrop-blur-sm rounded-2xl p-5 shadow-lg border-2 border-orange-400/30 hover:scale-105 transition-transform">
          <p className="text-lg font-semibold text-amber-100 mb-2">{display1}</p>
          <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">{score1}/10</p>
        </div>
        <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 backdrop-blur-sm rounded-2xl p-5 shadow-lg border-2 border-orange-400/30 hover:scale-105 transition-transform">
          <p className="text-lg font-semibold text-amber-100 mb-2">{display2}</p>
          <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">{score2}/10</p>
        </div>
      </div>
      {winner && (
        <div className="space-y-3 text-amber-100 bg-orange-950/30 rounded-2xl p-5 border border-orange-400/30">
          <p className="font-bold text-lg text-amber-200">Why {winner?.title || winner?.brand} wins:</p>
          <ul className="space-y-2 text-sm md:text-base">
            {winner?.rating && <li className="flex items-center gap-2">✨ Higher user rating ({winner.rating}★)</li>}
            {winner?.efficiency && <li className="flex items-center gap-2">⚡ Better energy efficiency ({winner.efficiency})</li>}
            {winner?.durability && <li className="flex items-center gap-2">💪 Superior durability ({winner.durability})</li>}
            {winner?.price && <li className="flex items-center gap-2">💰 Competitive pricing ({formatPrice(winner.price)})</li>}
          </ul>
        </div>
      )}
    </div>
  );
});

export default function ComparisonResult() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { 
    product1: directProduct1, 
    product2: directProduct2, 
    category, 
    brand1, 
    brand2, 
    product1Id, 
    product2Id 
  } = location.state || {};

  const [product1, setProduct1] = useState(directProduct1 || null);
  const [product2, setProduct2] = useState(directProduct2 || null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, success, error
  const [saveMessage, setSaveMessage] = useState('');
  const [user, setUser] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

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
    const fetchProducts = async () => {
      if (product1Id && !directProduct1) {
        setLoading(true);
        try {
          const res = await fetch(`http://localhost:5000/api/cookware/${product1Id}`);
          const data = await res.json();
          setProduct1(data);
        } catch (error) {
          console.error("Error fetching product1:", error);
        }
      }

      if (product2Id && !directProduct2) {
        setLoading(true);
        try {
          const res = await fetch(`http://localhost:5000/api/cookware/${product2Id}`);
          const data = await res.json();
          setProduct2(data);
        } catch (error) {
          console.error("Error fetching product2:", error);
        }
      }
      
      setLoading(false);
    };

    fetchProducts();
  }, [product1Id, product2Id, directProduct1, directProduct2]);

  useEffect(() => {
    if (!loading && !product1 && !product2 && !product1Id && !product2Id) {
      navigate("/compare");
    }
  }, [product1, product2, product1Id, product2Id, loading, navigate]);

  useEffect(() => {
    if (product1 && product2) {
      const isSameProduct = 
        (product1._id && product2._id && product1._id === product2._id) ||
        (product1.id && product2.id && product1.id === product2.id) ||
        (product1.title === product2.title && 
         product1.brand === product2.brand && 
         product1.price === product2.price);
      
      if (isSameProduct) {
        alert("Cannot compare identical products. Please select different products.");
        navigate("/select-products", { state: { category } });
      }
    }
  }, [product1, product2, category, navigate]);

  const handleSaveComparison = async () => {
    if (!user) {
      setSaveStatus('error');
      setSaveMessage('⚠️ Please login to save comparisons');
      setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage('');
        navigate('/auth');
      }, 2000);
      return;
    }

    if (!product1?._id || !product2?._id) {
      setSaveStatus('error');
      setSaveMessage('❌ Cannot save: Product IDs missing');
      setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage('');
      }, 3000);
      return;
    }

    setSaveStatus('saving');
    setSaveMessage('💾 Saving comparison...');

    try {
      const res = await fetch("http://localhost:5000/api/comparisons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user._id || user.id,
          product1: product1._id,
          product2: product2._id,
          category: category || product1.category
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSaveStatus('success');
        setSaveMessage('✅ Comparison saved successfully!');
        setTimeout(() => {
          setSaveStatus('idle');
          setSaveMessage('');
        }, 3000);
      } else {
        setSaveStatus('error');
        setSaveMessage(data.message || '❌ Save failed');
        setTimeout(() => {
          setSaveStatus('idle');
          setSaveMessage('');
        }, 3000);
      }
    } catch (err) {
      console.error("Save error:", err);
      setSaveStatus('error');
      setSaveMessage('❌ Network error. Please try again.');
      setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage('');
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-900 to-red-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">⚡</div>
          <div className="text-amber-100 text-2xl font-bold">Loading comparison...</div>
        </div>
      </div>
    );
  }

  if (!product1 || !product2) {
    return null;
  }

  const handleShare = () => {
    const text = `Check out this comparison: ${product1.title || product1.brand} vs ${product2.title || product2.brand}`;
    if (navigator.share) {
      navigator.share({ title: 'Cookware Comparison', text });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setSaveStatus('success');
      setSaveMessage('📋 Link copied to clipboard!');
      setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage('');
      }, 3000);
    }
  };

  const displayTitle = `${product1.title || product1.brand} vs ${product2.title || product2.brand}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-900 to-red-950 font-sans relative overflow-hidden flex flex-col items-center justify-center p-2 md:p-4">
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
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-red-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Floating cookware icons */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-floatSlow">🍳</div>
      <div className="absolute top-32 right-20 text-5xl opacity-15 animate-floatMedium" style={{ animationDelay: '1s' }}>⚖️</div>
      <div className="absolute bottom-20 left-32 text-7xl opacity-10 animate-floatSlow" style={{ animationDelay: '2s' }}>🏆</div>

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
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.8s ease-out;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }
      `}</style>

      {/* Save Status Alert */}
      {saveStatus !== 'idle' && (
        <div className={`fixed top-20 right-4 px-6 py-4 rounded-2xl shadow-2xl z-50 animate-slideDown border-2 backdrop-blur-xl flex items-center gap-3 ${
          saveStatus === 'success' ? 'bg-green-900/40 border-green-500/50 text-green-300' :
          saveStatus === 'error' ? 'bg-red-900/40 border-red-500/50 text-red-300' :
          'bg-orange-900/40 border-orange-500/50 text-orange-300'
        }`}>
          {saveStatus === 'success' && <span className="text-xl">✅</span>}
          {saveStatus === 'error' && <span className="text-xl">⚠️</span>}
          {saveStatus === 'saving' && (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          )}
          <span className="font-semibold">{saveMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1400px] bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-xl rounded-[20px] md:rounded-[40px] shadow-2xl overflow-hidden border-2 border-orange-400/40">
        {/* Sticky Header */}
        <StickyHeader product1={product1} product2={product2} />

        {/* Main Content */}
        <div className="p-4 md:p-12">
          {/* Breadcrumb */}
          <Breadcrumb />

          {/* Comparison Title Bar */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl py-4 md:py-5 px-4 md:px-8 mb-6 shadow-2xl border-2 border-amber-300/50 animate-scaleIn">
            <h2 className="text-white text-base md:text-2xl font-bold text-center flex items-center justify-center gap-3">
              <span className="text-2xl">⚡</span>
              {displayTitle}
              <span className="text-2xl">⚡</span>
            </h2>
          </div>

          {/* Product Images Section */}
          <div className="bg-gradient-to-br from-orange-950/40 to-red-950/40 backdrop-blur-sm rounded-3xl p-4 md:p-8 mb-8 border-2 border-orange-400/30 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <ProductCard product={product1} index={0} />
              <ProductCard product={product2} index={1} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center md:justify-start">
            <button 
              onClick={handleSaveComparison}
              disabled={saveStatus === 'saving' || saveStatus === 'success'}
              className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold shadow-2xl transition-all transform border-2 ${
                saveStatus === 'success' 
                  ? 'bg-green-900/40 border-green-500/50 text-green-300 cursor-not-allowed'
                  : saveStatus === 'saving'
                  ? 'bg-orange-900/40 border-orange-500/50 text-orange-300 cursor-wait'
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 border-purple-300/50 text-white hover:from-purple-500 hover:via-pink-500 hover:to-rose-500 hover:scale-110'
              }`}
            >
              {saveStatus === 'success' ? (
                <>
                  <span className="text-lg">✅</span> Saved
                </>
              ) : saveStatus === 'saving' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <span className="text-lg">💾</span> Save Comparison
                </>
              )}
            </button>

            <button 
              onClick={handleShare}
              className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white px-8 py-3 rounded-full text-sm font-bold shadow-2xl hover:from-blue-500 hover:via-cyan-500 hover:to-teal-500 transition-all transform hover:scale-110 flex items-center gap-2 border-2 border-blue-300/50"
            >
              <span className="text-lg">🔗</span> Share
            </button>
          </div>

          {/* Conclusion Card */}
          <ConclusionCard product1={product1} product2={product2} />

          {/* Comparison Table */}
          <div className="bg-gradient-to-br from-orange-950/40 to-red-950/40 backdrop-blur-xl rounded-3xl overflow-hidden mb-8 shadow-2xl border-2 border-orange-400/40">
            <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 py-4 px-4 md:px-8 border-b-2 border-amber-300/50">
              <h3 className="text-white text-base md:text-xl font-bold flex items-center justify-center gap-2">
                📊 Detailed Comparison
              </h3>
            </div>
            {comparisonData.map((item, index) => (
              <ComparisonRow
                key={item.label}
                item={item}
                product1={product1}
                product2={product2}
                isLast={index === comparisonData.length - 1}
              />
            ))}
          </div>

          {/* Compare Others Button */}
          <div className="flex justify-center">
            <Link to="/compare">
              <button className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white px-12 md:px-20 py-4 rounded-full text-base md:text-lg font-bold shadow-2xl hover:from-amber-500 hover:via-orange-500 hover:to-red-500 transition-all transform hover:scale-110 border-2 border-amber-300/50 flex items-center gap-3">
                🔄 Compare Others
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}