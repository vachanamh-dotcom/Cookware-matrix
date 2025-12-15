import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft, Filter, Star, ShoppingCart, Heart, Loader } from "lucide-react";
import { formatPrice, getImage } from "./utils/formatters";

export default function CategoryPage() {
  const location = useLocation();
  const selectedCategory = location.state?.category || "Fry Pan";
  
  const [selectedMaterial, setSelectedMaterial] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from your database
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

  // Calculate material counts dynamically from products
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

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    // Material filter
    const materialMatch = selectedMaterial === "All" || product.material === selectedMaterial;
    
    // Price filter (prices stored in rupees)
    let priceMatch = true;
    if (priceFilter !== "All") {
      const selectedRange = priceRanges.find(range => range.range === priceFilter);
      if (selectedRange) {
        priceMatch = product.price >= selectedRange.min && product.price <= selectedRange.max;
      }
    }
    
    return materialMatch && priceMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-sans relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Navigation */}
      <nav className="relative z-20 px-8 py-6 animate-slideDown">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white hover:text-emerald-400 transition-all hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </button>
          <div className="flex gap-8 text-white text-base font-medium">
            <a href="/" className="hover:text-emerald-400 transition-all">Home</a>
            <a href="/compare" className="hover:text-emerald-400 transition-all">Compare</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-12 animate-scaleIn">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-6xl font-bold mb-4">
            {selectedCategory}
          </h1>
          <p className="text-slate-300 text-xl">
            {loading ? "Loading products..." : `Explore ${filteredProducts.length} products across different materials`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-fadeInUp">
            <Loader className="w-12 h-12 text-emerald-400 animate-spin mb-4" />
            <p className="text-slate-300 text-lg">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-8 animate-fadeInUp">
            <p className="text-red-400">⚠️ {error}</p>
            <p className="text-slate-400 text-sm mt-2">Please make sure the backend server is running on port 5000.</p>
          </div>
        )}

        {!loading && (
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-72 flex-shrink-0 animate-slideInLeft">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-emerald-400" />
                <h2 className="text-white font-bold text-xl">Filters</h2>
              </div>

              {/* Material Filter */}
              <div className="mb-8">
                <h3 className="text-slate-300 font-semibold mb-4 text-sm uppercase tracking-wide">Material</h3>
                <div className="space-y-2">
                  {materials.map((material, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedMaterial(material.name)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                        selectedMaterial === material.name
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                          : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{material.name}</span>
                        <span className="text-sm opacity-75">({material.count})</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="text-slate-300 font-semibold mb-4 text-sm uppercase tracking-wide">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range, index) => (
                    <button
                      key={index}
                      onClick={() => setPriceFilter(range.range)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                        priceFilter === range.range
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                          : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                      }`}
                    >
                      <span className="font-medium">{range.name}</span>
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
                  className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all transform hover:scale-[1.02] hover:shadow-2xl cursor-pointer animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Actions */}
                  <div className="flex justify-end items-start mb-4">
                    <button className="text-slate-400 hover:text-red-400 transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Product Image */}
                  <div className="text-center mb-6">
                    <img 
                      src={getImage(product.image)} 
                      alt={product.title}
                      className="w-32 h-32 object-contain mx-auto mb-4 transform group-hover:scale-110 transition-transform"
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                        e.target.onerror = null;
                      }}
                    />
                    {product.material && (
                      <span className="inline-block bg-slate-700/50 text-slate-300 text-xs px-3 py-1 rounded-full">
                        {product.material}
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-white font-bold text-lg leading-tight mb-1">
                        {product.title}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {product.brand} {product.dimensions && `• ${product.dimensions}`}
                      </p>
                    </div>

                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-white font-semibold ml-1">{product.rating}</span>
                        </div>
                      </div>
                    )}

                    {/* Price and Actions */}
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-emerald-400 font-bold text-2xl">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2.5 rounded-xl font-semibold hover:from-emerald-400 hover:to-teal-400 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                        <button className="px-4 bg-slate-700/50 text-white rounded-xl hover:bg-slate-600/50 transition-all">
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-white text-2xl font-bold mb-2">No products found</h3>
                <p className="text-slate-400">Try adjusting your filters or check if products exist for this category</p>
              </div>
            )}
          </div>
        </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.8s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out both;
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out both;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out both;
        }
      `}</style>
    </div>
  );
}