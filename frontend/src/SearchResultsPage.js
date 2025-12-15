import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft, Filter, Star, ShoppingCart, Heart, SlidersHorizontal, Grid, List } from "lucide-react";
import { formatPrice, getImage } from "./utils/formatters";

export default function SearchResultsPage() {
  const location = useLocation();
  const searchQuery = location.state?.query || "";
  
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-sans relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Navigation */}
      <nav className="relative z-20 px-8 py-6 animate-slideDown">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => window.location.href = '/home'}
            className="flex items-center gap-2 text-white hover:text-emerald-400 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </button>
          <div className="flex gap-8 text-white text-base font-medium">
            <a href="/home" className="hover:text-emerald-400 transition-all">Home</a>
            <a href="/compare" className="hover:text-emerald-400 transition-all">Compare</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-scaleIn">
          <h1 className="text-white text-4xl font-bold mb-2">
            Search Results for "{searchQuery}"
          </h1>
          <p className="text-slate-400 text-lg">
            {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 animate-fadeInUp">
          <div className="flex items-center gap-4">
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-800/80 text-white px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="relevance">Sort by: Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-emerald-500 text-white" : "bg-slate-800/80 text-slate-300"}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-emerald-500 text-white" : "bg-slate-800/80 text-slate-300"}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0 animate-slideInLeft">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-emerald-400" />
                <h2 className="text-white font-bold text-lg">Filters</h2>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h3 className="text-slate-300 font-semibold mb-3 text-sm uppercase">Brand</h3>
                <div className="space-y-2">
                  {brands.map((brand, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedBrand(brand)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                        selectedBrand === brand
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                          : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h3 className="text-slate-300 font-semibold mb-3 text-sm uppercase">Price</h3>
                <div className="space-y-2">
                  {priceRanges.map((range, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPriceFilter(range.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                        priceFilter === range.name
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                          : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                      }`}
                    >
                      {range.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h3 className="text-slate-300 font-semibold mb-3 text-sm uppercase">Rating</h3>
                <div className="space-y-2">
                  {ratingOptions.map((rating, idx) => (
                    <button
                      key={idx}
                      onClick={() => setRatingFilter(rating)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                        ratingFilter === rating
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                          : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
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
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-white text-2xl font-bold mb-2">No products found</h3>
                <p className="text-slate-400">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {sortedProducts.map((product, index) => (
                  viewMode === "grid" ? (
                    // Grid View
                    <div
                      key={product._id}
                      className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all transform hover:scale-[1.02] cursor-pointer animate-fadeInUp"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex justify-end items-start mb-3">
                        <button className="text-slate-400 hover:text-red-400 transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-center mb-4">
                        <img
                          src={getImage(product.image)}
                          alt={product.title}
                          className="w-32 h-32 object-contain mx-auto mb-2 transform group-hover:scale-110 transition-transform"
                          onError={(e) => {
                            e.target.src = "/placeholder.png";
                            e.target.onerror = null;
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-white font-bold text-base leading-tight">{product.title}</h3>
                        <p className="text-slate-400 text-xs">
                          {product.brand} {product.dimensions && `• ${product.dimensions}`}
                        </p>
                        
                        {product.rating && (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center bg-green-600 px-2 py-0.5 rounded">
                              <span className="text-white font-semibold text-xs">{product.rating}</span>
                              <Star className="w-3 h-3 text-white fill-white ml-0.5" />
                            </div>
                          </div>
                        )}

                        <div className="pt-3 border-t border-white/10">
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-emerald-400 font-bold text-xl">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                          <button 
                            className="w-full py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 transform hover:scale-105"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // List View
                    <div
                      key={product._id}
                      className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all cursor-pointer animate-fadeInUp flex gap-4"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex-shrink-0 w-32 h-32 flex items-center justify-center">
                        <img
                          src={getImage(product.image)}
                          alt={product.title}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src = "/placeholder.png";
                            e.target.onerror = null;
                          }}
                        />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-white font-bold text-lg mb-1">{product.title}</h3>
                              <p className="text-slate-400 text-sm">
                                {product.brand} {product.dimensions && `• ${product.dimensions}`}
                              </p>
                            </div>
                            <button className="text-slate-400 hover:text-red-400 transition-colors">
                              <Heart className="w-5 h-5" />
                            </button>
                          </div>
                          
                          {product.rating && (
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex items-center bg-green-600 px-2 py-1 rounded">
                                <span className="text-white font-semibold text-sm">{product.rating}</span>
                                <Star className="w-3 h-3 text-white fill-white ml-1" />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-emerald-400 font-bold text-2xl">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                          <button 
                            className="px-6 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
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

      <style>{`
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