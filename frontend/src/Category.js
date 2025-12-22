import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Filter, Star, Sparkles, X } from "lucide-react";
import { formatPrice, getImage } from "./utils/formatters";

export default function CategoryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCategory = location.state?.category || "Fry Pan";
  
  const [selectedMaterial, setSelectedMaterial] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

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
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/cookware?category=${encodeURIComponent(selectedCategory)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError("Unable to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const priceRanges = [
    { name: "All", range: "All", min: 0, max: Infinity },
    { name: "Under ₹1000", range: "0-1000", min: 0, max: 1000 },
    { name: "₹1000 - ₹2500", range: "1000-2500", min: 1000, max: 2500 },
    { name: "₹2500 - ₹5000", range: "2500-5000", min: 2500, max: 5000 },
    { name: "Above ₹5000", range: "5000+", min: 5000, max: Infinity }
  ];

  const getMaterialCounts = () => {
    const counts = {};
    products.forEach(product => {
      counts[product.material] = (counts[product.material] || 0) + 1;
    });
    
    const materials = [
      { name: "All", count: products.length }
    ];
    
    Object.entries(counts).forEach(([material, count]) => {
      materials.push({ name: material, count });
    });
    
    return materials;
  };

  const materials = getMaterialCounts();

  const filteredProducts = products.filter(product => {
    const materialMatch = selectedMaterial === "All" || product.material === selectedMaterial;
    
    let priceMatch = true;
    if (priceFilter !== "All") {
      const selectedRange = priceRanges.find(range => range.range === priceFilter);
      if (selectedRange) {
        priceMatch = product.price >= selectedRange.min && product.price <= selectedRange.max;
      }
    }
    
    return materialMatch && priceMatch;
  });

  const handleProductView = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-900 to-red-950 font-sans relative overflow-hidden">
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
      <div className="absolute top-32 right-20 text-5xl opacity-15 animate-floatMedium" style={{ animationDelay: '1s' }}>🍲</div>
      <div className="absolute bottom-20 left-32 text-7xl opacity-10 animate-floatSlow" style={{ animationDelay: '2s' }}>🥘</div>
      <div className="absolute top-1/2 right-10 text-4xl opacity-15 animate-floatMedium" style={{ animationDelay: '1.5s' }}>🫕</div>

      {/* Navigation */}
      <nav className="relative z-20 px-4 md:px-8 py-6 animate-slideDown">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-amber-100 hover:text-amber-300 transition-all hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] hover:scale-110"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Home</span>
          </button>
          <div className="hidden md:flex gap-8 text-amber-100 text-base font-semibold">
            <a href="/home" className="hover:text-amber-300 transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] hover:scale-110 relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-300 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="/compare" className="hover:text-amber-300 transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] hover:scale-110 relative group">
              Compare
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-300 group-hover:w-full transition-all duration-300"></span>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="mb-12 animate-scaleIn">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-amber-400 animate-pulse" />
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 text-5xl md:text-6xl font-bold animate-gradient">
              {selectedCategory}
            </h1>
          </div>
          <p className="text-amber-100 text-lg md:text-xl drop-shadow-lg">
            {loading ? "Loading products..." : `Discover ${filteredProducts.length} premium products`}
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="md:hidden mb-6 animate-fadeInUp">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-xl"
          >
            <Filter className="w-5 h-5" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-fadeInUp">
            <div className="text-8xl mb-6 animate-bounce">🍳</div>
            <p className="text-amber-100 text-lg">Loading amazing products...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-900/30 border-2 border-red-500/50 backdrop-blur-xl rounded-2xl p-6 mb-8 animate-fadeInUp">
            <p className="text-red-300 font-semibold">⚠️ {error}</p>
            <p className="text-orange-200/80 text-sm mt-2">Please make sure the backend server is running on port 5000.</p>
          </div>
        )}

        {!loading && (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-72 flex-shrink-0 animate-slideInLeft`}>
            <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 rounded-3xl p-6 sticky top-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-amber-400" />
                  <h2 className="text-amber-100 font-bold text-xl">Filters</h2>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="md:hidden text-amber-300 hover:text-amber-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Material Filter */}
              <div className="mb-8">
                <h3 className="text-amber-200 font-semibold mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
                  <span className="text-lg">🔨</span> Material
                </h3>
                <div className="space-y-2">
                  {materials.map((material, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedMaterial(material.name);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all transform hover:scale-105 ${
                        selectedMaterial === material.name
                          ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-xl border-2 border-amber-300/50"
                          : "bg-orange-800/30 text-amber-100 hover:bg-orange-700/40 border-2 border-orange-400/20"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{material.name}</span>
                        <span className="text-sm opacity-90 bg-orange-950/40 px-2 py-1 rounded-full">
                          {material.count}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="text-amber-200 font-semibold mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
                  <span className="text-lg">💰</span> Price Range
                </h3>
                <div className="space-y-2">
                  {priceRanges.map((range, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setPriceFilter(range.range);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all transform hover:scale-105 ${
                        priceFilter === range.range
                          ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-xl border-2 border-amber-300/50"
                          : "bg-orange-800/30 text-amber-100 hover:bg-orange-700/40 border-2 border-orange-400/20"
                      }`}
                    >
                      <span className="font-semibold">{range.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 animate-slideInRight">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product._id}
                  onClick={() => handleProductView(product._id)}
                  className="group relative bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 rounded-3xl p-6 hover:border-amber-400/60 hover:from-orange-900/70 hover:to-red-900/70 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20 cursor-pointer animate-fadeInUp flex flex-col"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-t-3xl"></div>

                  {/* Product Image */}
                  <div className="text-center mb-4 mt-4">
                    <div className="h-40 flex items-center justify-center mb-4">
                      <img 
                        src={getImage(product.image)} 
                        alt={product.title}
                        className="max-w-full max-h-40 object-contain transform group-hover:scale-110 transition-transform drop-shadow-xl"
                        onError={(e) => {
                          e.target.src = "/placeholder.png";
                          e.target.onerror = null;
                        }}
                      />
                    </div>
                    {product.material && (
                      <span className="inline-block bg-orange-800/50 text-amber-200 text-xs px-3 py-1 rounded-full border border-orange-400/30">
                        {product.material}
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col flex-grow">
                    <h3 className="text-amber-100 font-bold text-lg leading-tight mb-2 group-hover:text-amber-200 transition-colors min-h-[3.5rem]">
                      {product.title}
                    </h3>
                    <p className="text-orange-200/80 text-sm mb-4">
                      {product.brand}
                    </p>

                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center bg-orange-950/50 px-2 py-1 rounded-full">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-amber-100 font-semibold ml-1">{product.rating}</span>
                        </div>
                      </div>
                    )}

                    {/* Price and Actions */}
                    <div className="pt-4 border-t border-orange-400/30 mt-auto">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-400 font-bold text-2xl drop-shadow-lg">
                          {formatPrice(product.price)}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductView(product._id);
                          }}
                          className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-amber-400 hover:via-orange-400 hover:to-red-400 transition-all transform hover:scale-105 shadow-xl"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-20 bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 rounded-3xl animate-fadeInUp">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-amber-100 text-2xl font-bold mb-2">No products found</h3>
                <p className="text-orange-200/80 mb-4">Try adjusting your filters</p>
                <button
                  onClick={() => {
                    setSelectedMaterial("All");
                    setPriceFilter("All");
                  }}
                  className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-semibold hover:from-amber-400 hover:via-orange-400 hover:to-red-400 transition-all transform hover:scale-105 shadow-xl"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
        )}
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
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.6s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.8s ease-out; }
        .animate-slideInLeft { animation: slideInLeft 0.8s ease-out both; }
        .animate-slideInRight { animation: slideInRight 0.8s ease-out both; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out both; }
      `}</style>
    </div>
  );
}