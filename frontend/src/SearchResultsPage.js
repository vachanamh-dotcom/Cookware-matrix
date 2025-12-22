import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Filter, Star, SlidersHorizontal, Grid, List, X } from "lucide-react";
import logo from "./Assets/logo.png";
import { formatPrice, getImage } from "./utils/formatters";

export default function SearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchQuery = location.state?.query || "";
  
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showFilters, setShowFilters] = useState(false);

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

  useEffect(() => {
    if (!searchQuery) return;

    fetch(`http://localhost:5000/api/cookware/search?q=${encodeURIComponent(searchQuery)}`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => setProducts([]));
  }, [searchQuery]);

  const brands = ["All", ...new Set(products.map(p => p.brand))];
  
  const priceRanges = [
    { name: "All", min: 0, max: Infinity },
    { name: "Under ₹1000", min: 0, max: 1000 },
    { name: "₹1000 - ₹2000", min: 1000, max: 2000 },
    { name: "₹2000 - ₹3000", min: 2000, max: 3000 },
    { name: "Above ₹3000", min: 3000, max: Infinity }
  ];

  const ratingOptions = ["All", "4★ & above", "3★ & above"];

  // Apply filters
  const filteredProducts = products.filter(product => {
    const brandMatch = selectedBrand === "All" || product.brand === selectedBrand;
    
    let priceMatch = true;
    if (priceFilter !== "All") {
      const range = priceRanges.find(r => r.name === priceFilter);
      priceMatch = product.price >= range.min && product.price <= range.max;
    }

    let ratingMatch = true;
    if (ratingFilter === "4★ & above") ratingMatch = product.rating >= 4;
    if (ratingFilter === "3★ & above") ratingMatch = product.rating >= 3;

    return brandMatch && priceMatch && ratingMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0; // relevance
  });

  const handleProductView = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-900 to-red-950 font-sans relative overflow-hidden">
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

      {/* Navigation */}
      <nav className="relative z-20 flex justify-between items-center px-8 py-6 animate-slideDown">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/home')}>
            <img src={logo} alt="Cookware Matrix logo" className="w-16 h-16 drop-shadow-2xl hover:scale-110 transition-transform duration-300" />
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 animate-gradient">
              Cookware Matrix
            </h2>
          </div>
        </div>
        <button 
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-semibold hover:from-amber-400 hover:via-orange-400 hover:to-red-400 transition-all transform hover:scale-105 shadow-xl"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-scaleIn">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 text-4xl md:text-5xl font-bold mb-3 animate-gradient">
            Search Results for "{searchQuery}"
          </h1>
          <p className="text-amber-100 text-lg">
            {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-2 border-orange-300/30 rounded-2xl p-4 animate-fadeInUp shadow-2xl">
          <div className="flex items-center gap-4">
            <SlidersHorizontal className="w-5 h-5 text-amber-400" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gradient-to-br from-orange-900/50 to-red-900/50 text-amber-100 px-4 py-2 rounded-lg border-2 border-orange-400/40 focus:outline-none focus:border-amber-400 transition-all backdrop-blur-xl"
            >
              <option value="relevance">Sort by: Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-semibold transition-all"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white" : "bg-orange-900/50 text-amber-100 hover:bg-orange-900/70"}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white" : "bg-orange-900/50 text-amber-100 hover:bg-orange-900/70"}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className={`w-64 flex-shrink-0 animate-slideInLeft ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-2 border-orange-300/30 rounded-2xl p-6 sticky top-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-amber-400" />
                  <h2 className="text-amber-100 font-bold text-lg">Filters</h2>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-amber-100 hover:text-amber-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h3 className="text-orange-200 font-semibold mb-3 text-sm uppercase">Brand</h3>
                <div className="space-y-2">
                  {brands.map((brand, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedBrand(brand)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                        selectedBrand === brand
                          ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-semibold"
                          : "bg-orange-900/30 text-amber-100 hover:bg-orange-900/50 border border-orange-400/20"
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h3 className="text-orange-200 font-semibold mb-3 text-sm uppercase">Price</h3>
                <div className="space-y-2">
                  {priceRanges.map((range, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPriceFilter(range.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                        priceFilter === range.name
                          ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-semibold"
                          : "bg-orange-900/30 text-amber-100 hover:bg-orange-900/50 border border-orange-400/20"
                      }`}
                    >
                      {range.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h3 className="text-orange-200 font-semibold mb-3 text-sm uppercase">Rating</h3>
                <div className="space-y-2">
                  {ratingOptions.map((rating, idx) => (
                    <button
                      key={idx}
                      onClick={() => setRatingFilter(rating)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                        ratingFilter === rating
                          ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-semibold"
                          : "bg-orange-900/30 text-amber-100 hover:bg-orange-900/50 border border-orange-400/20"
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="flex-1 animate-slideInRight">
            {sortedProducts.length === 0 ? (
              <div className="text-center py-20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-2 border-orange-300/30 rounded-2xl shadow-2xl">
                <div className="text-7xl mb-6 animate-pulse">🔍</div>
                <h3 className="text-amber-100 text-3xl font-bold mb-3">No products found</h3>
                <p className="text-orange-200">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {sortedProducts.map((product, index) => (
                  viewMode === "grid" ? (
                    // Grid View
                    <div
                      key={product._id}
                      onClick={() => handleProductView(product._id)}
                      className="group relative bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 rounded-2xl p-6 hover:border-amber-400/60 hover:from-orange-900/70 hover:to-red-900/70 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20 cursor-pointer animate-fadeInUp flex flex-col"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-t-2xl"></div>

                      {/* Product Image */}
                      <div className="text-center mb-4 mt-2">
                        <div className="h-40 flex items-center justify-center mb-3">
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
                        <h3 className="text-amber-100 font-bold text-lg leading-tight mb-2 group-hover:text-amber-200 transition-colors min-h-[3.5rem]">{product.title}</h3>
                        <p className="text-orange-200/80 text-sm mb-3">{product.brand}</p>
                        
                        {/* Rating */}
                        {product.rating && (
                          <div className="flex items-center mb-4">
                            <div className="flex items-center bg-orange-950/50 px-2 py-1 rounded-full">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="text-amber-100 font-semibold ml-1">{product.rating}</span>
                            </div>
                          </div>
                        )}

                        {/* Price and Button */}
                        <div className="flex items-center justify-between pt-3 mt-auto border-t border-orange-400/30">
                          <span className="text-amber-400 font-bold text-xl">
                            {formatPrice(product.price)}
                          </span>
                          <button className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-amber-400 hover:via-orange-400 hover:to-red-400 transition-all transform hover:scale-105 shadow-lg">
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // List View
                    <div
                      key={product._id}
                      onClick={() => handleProductView(product._id)}
                      className="group bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 rounded-2xl p-6 hover:border-amber-400/60 hover:from-orange-900/70 hover:to-red-900/70 transition-all cursor-pointer animate-fadeInUp flex gap-6 relative hover:shadow-2xl hover:shadow-amber-500/20"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-t-2xl"></div>
                      
                      <div className="flex-shrink-0 w-32 h-32 flex items-center justify-center mt-2">
                        <img
                          src={getImage(product.image)}
                          alt={product.title}
                          className="w-full h-full object-contain transform group-hover:scale-110 transition-transform drop-shadow-xl"
                          onError={(e) => {
                            e.target.src = "/placeholder.png";
                            e.target.onerror = null;
                          }}
                        />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-amber-100 font-bold text-xl mb-2 group-hover:text-amber-200 transition-colors">{product.title}</h3>
                          <p className="text-orange-200/80 text-sm mb-3">{product.brand}</p>
                          
                          {product.rating && (
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center">
                                <span className="text-yellow-400 text-xl">★</span>
                                <span className="text-amber-100 font-semibold ml-1 text-lg">{product.rating}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-orange-400/30">
                          <span className="text-amber-400 font-bold text-2xl">
                            {formatPrice(product.price)}
                          </span>
                          <button className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-6 py-2 rounded-full font-semibold hover:from-amber-400 hover:via-orange-400 hover:to-red-400 transition-all transform hover:scale-105 shadow-lg">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                ))}
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