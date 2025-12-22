import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import logo from "./Assets/logo.png";

export default function SelectProducts() {
  const location = useLocation();
  const navigate = useNavigate();

  const { category, brand1, brand2 } = location.state || {};

  const [products, setProducts] = useState([]);
  const [selectedProduct1, setSelectedProduct1] = useState(null);
  const [selectedProduct2, setSelectedProduct2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

  const isSameBrand = brand1 === brand2;

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
    if (!category || !brand1 || !brand2) {
      navigate("/compare");
    }
  }, [category, brand1, brand2, navigate]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        if (isSameBrand) {
          const res = await fetch(
            `http://localhost:5000/api/cookware?category=${category}&brand=${brand1}`
          );
          setProducts(await res.json());
        } else {
          const res1 = await fetch(
            `http://localhost:5000/api/cookware?category=${category}&brand=${brand1}`
          );
          const res2 = await fetch(
            `http://localhost:5000/api/cookware?category=${category}&brand=${brand2}`
          );
          const data1 = await res1.json();
          const data2 = await res2.json();
          setProducts([...data1, ...data2]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category, brand1, brand2, isSameBrand]);

  const brand1Products = products.filter(p => p.brand === brand1);
  const brand2Products = isSameBrand 
    ? brand1Products 
    : products.filter(p => p.brand === brand2);

  const handleSelectProduct1 = (product) => {
    if (selectedProduct2?._id === product._id) {
      alert("You've already selected this product. Please choose a different one.");
      return;
    }
    setSelectedProduct1(product);
  };

  const handleSelectProduct2 = (product) => {
    if (selectedProduct1?._id === product._id) {
      alert("You've already selected this product. Please choose a different one.");
      return;
    }
    setSelectedProduct2(product);
  };

  const handleCompare = () => {
    if (!selectedProduct1 || !selectedProduct2) {
      alert("Please select one product from each side!");
      return;
    }

    if (selectedProduct1._id === selectedProduct2._id) {
      alert("Please select two different products to compare!");
      return;
    }

    navigate("/comparison-result", {
      state: {
        product1: selectedProduct1,
        product2: selectedProduct2,
        category,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-900 to-red-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-amber-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🍳</span>
            </div>
          </div>
          <div className="text-amber-100 text-2xl font-bold">Loading products…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-900 to-red-950 p-4 md:p-8 relative overflow-hidden">
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
      <div className="absolute bottom-20 left-32 text-7xl opacity-10 animate-floatSlow" style={{ animationDelay: '2s' }}>🥘</div>

      {/* Main Container */}
      <div className="relative z-10 max-w-[1400px] mx-auto bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-xl rounded-[40px] shadow-2xl overflow-hidden border-2 border-orange-400/40 animate-scaleIn">
        {/* Header */}
        <div className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 py-6 md:py-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between rounded-t-[30px] border-b-2 border-amber-300/50 gap-4">
          <div className="flex items-center gap-4 md:gap-6">
            <img src={logo} alt="Cookware Matrix logo" className="w-12 h-12 md:w-16 md:h-16 drop-shadow-2xl hover:scale-110 transition-transform" />
            <div>
              <h1 className="text-white text-3xl md:text-4xl font-bold drop-shadow-lg flex items-center gap-2">
                <span className="text-2xl">✨</span>
                Select Products
              </h1>
              <p className="text-amber-100 text-xs md:text-sm mt-1">
                {isSameBrand 
                  ? `Choose two different ${brand1} products to compare`
                  : `Choose one product from each brand to compare`
                }
              </p>
            </div>
          </div>
          
          <nav className="flex gap-6 md:gap-8 text-amber-100 text-sm md:text-base font-semibold">
            <Link to="/home" className="hover:text-white transition-all hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] hover:scale-110">Home</Link>
            <Link to="/compare" className="hover:text-white transition-all hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] hover:scale-110">Back</Link>
          </nav>
        </div>

        {/* Category Badge */}
        <div className="px-6 md:px-12 pt-8 pb-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-400/50 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg">
            <span className="text-2xl">🍳</span>
            <span className="text-amber-200 font-bold text-sm md:text-base">{category}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative">
            
            {/* BRAND 1 / PRODUCT 1 COLUMN */}
            <div className="animate-slideInLeft">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 animate-gradient">
                  {isSameBrand ? `${brand1} – Product 1` : brand1}
                </h2>
                {selectedProduct1 && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-400/50 backdrop-blur-sm rounded-full px-4 py-1">
                    <span className="text-amber-200 text-sm font-semibold">✓ Selected</span>
                  </div>
                )}
              </div>
              
              {brand1Products.length === 0 ? (
                <div className="bg-gradient-to-br from-orange-950/40 to-red-950/40 backdrop-blur-sm rounded-2xl p-8 text-center text-orange-200/80 border-2 border-orange-400/30">
                  <div className="text-5xl mb-3">📦</div>
                  <p>No products available for {brand1}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {brand1Products.map((product, index) => (
                    <div
                      key={product._id}
                      onClick={() => handleSelectProduct1(product)}
                      className={`cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 hover:scale-105 animate-fadeInUp ${
                        selectedProduct1?._id === product._id
                          ? "border-amber-400 bg-gradient-to-br from-amber-500/20 to-orange-500/20 shadow-2xl shadow-amber-500/20 backdrop-blur-sm"
                          : selectedProduct2?._id === product._id
                          ? "border-red-500/50 bg-red-500/10 opacity-50 cursor-not-allowed"
                          : "border-orange-400/40 bg-gradient-to-br from-orange-900/30 to-red-900/30 hover:border-amber-400/60 backdrop-blur-sm"
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="relative">
                        {selectedProduct1?._id === product._id && (
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-t-xl"></div>
                        )}
                        <img
                          src={product.image || "/placeholder.png"}
                          alt={product.title}
                          className="w-full h-32 object-contain mb-3 rounded-lg drop-shadow-xl hover:scale-110 transition-transform"
                          onError={(e) => {
                            e.target.src = "/placeholder.png";
                            e.target.onerror = null;
                          }}
                        />
                        {selectedProduct1?._id === product._id && (
                          <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-lg">
                            ✓
                          </div>
                        )}
                        {selectedProduct2?._id === product._id && (
                          <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-lg">
                            ✗
                          </div>
                        )}
                      </div>
                      <h3 className="text-amber-100 text-sm font-bold line-clamp-2 mb-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-orange-200/80 text-xs">{product.material || "N/A"}</p>
                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 font-bold text-sm">
                          ₹{product.price?.toLocaleString() || "N/A"}
                        </p>
                      </div>
                      {product.rating && (
                        <div className="mt-2 flex items-center gap-1 bg-orange-950/50 rounded-full px-2 py-1 w-fit">
                          <span className="text-yellow-400 text-xs">★</span>
                          <span className="text-amber-100 text-xs font-semibold">{product.rating}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* VS Divider */}
            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl shadow-2xl border-4 border-amber-300/50 animate-pulse backdrop-blur-xl">
                VS
              </div>
            </div>

            {/* Mobile VS Divider */}
            <div className="lg:hidden flex justify-center my-4">
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl shadow-2xl border-4 border-amber-300/50 animate-pulse">
                VS
              </div>
            </div>

            {/* BRAND 2 / PRODUCT 2 COLUMN */}
            <div className="animate-slideInRight">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 animate-gradient">
                  {isSameBrand ? `${brand2} – Product 2` : brand2}
                </h2>
                {selectedProduct2 && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-400/50 backdrop-blur-sm rounded-full px-4 py-1">
                    <span className="text-amber-200 text-sm font-semibold">✓ Selected</span>
                  </div>
                )}
              </div>
              
              {brand2Products.length === 0 ? (
                <div className="bg-gradient-to-br from-orange-950/40 to-red-950/40 backdrop-blur-sm rounded-2xl p-8 text-center text-orange-200/80 border-2 border-orange-400/30">
                  <div className="text-5xl mb-3">📦</div>
                  <p>No products available for {brand2}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {brand2Products.map((product, index) => (
                    <div
                      key={product._id}
                      onClick={() => handleSelectProduct2(product)}
                      className={`cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 hover:scale-105 animate-fadeInUp ${
                        selectedProduct2?._id === product._id
                          ? "border-amber-400 bg-gradient-to-br from-amber-500/20 to-orange-500/20 shadow-2xl shadow-amber-500/20 backdrop-blur-sm"
                          : selectedProduct1?._id === product._id
                          ? "border-red-500/50 bg-red-500/10 opacity-50 cursor-not-allowed"
                          : "border-orange-400/40 bg-gradient-to-br from-orange-900/30 to-red-900/30 hover:border-amber-400/60 backdrop-blur-sm"
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="relative">
                        {selectedProduct2?._id === product._id && (
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-t-xl"></div>
                        )}
                        <img
                          src={product.image || "/placeholder.png"}
                          alt={product.title}
                          className="w-full h-32 object-contain mb-3 rounded-lg drop-shadow-xl hover:scale-110 transition-transform"
                          onError={(e) => {
                            e.target.src = "/placeholder.png";
                            e.target.onerror = null;
                          }}
                        />
                        {selectedProduct2?._id === product._id && (
                          <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-lg">
                            ✓
                          </div>
                        )}
                        {selectedProduct1?._id === product._id && (
                          <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-lg">
                            ✗
                          </div>
                        )}
                      </div>
                      <h3 className="text-amber-100 text-sm font-bold line-clamp-2 mb-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-orange-200/80 text-xs">{product.material || "N/A"}</p>
                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 font-bold text-sm">
                          ₹{product.price?.toLocaleString() || "N/A"}
                        </p>
                      </div>
                      {product.rating && (
                        <div className="mt-2 flex items-center gap-1 bg-orange-950/50 rounded-full px-2 py-1 w-fit">
                          <span className="text-yellow-400 text-xs">★</span>
                          <span className="text-amber-100 text-xs font-semibold">{product.rating}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Compare Button */}
          <div className="mt-12 flex justify-center">
            <button
              disabled={
                !selectedProduct1 || 
                !selectedProduct2 || 
                selectedProduct1._id === selectedProduct2._id
              }
              onClick={handleCompare}
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-12 md:px-16 py-4 rounded-full text-base md:text-lg font-bold shadow-2xl hover:from-amber-400 hover:via-orange-400 hover:to-red-400 transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3 border-2 border-amber-300/50"
            >
              <span className="text-xl">⚖️</span>
              Compare Selected Products
            </button>
          </div>
        </div>
      </div>

      {/* Floating Back Button */}
      <Link to="/compare">
        <button 
          className="fixed bottom-8 right-8 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl hover:from-amber-500 hover:via-orange-500 hover:to-red-500 transition-all transform hover:scale-110 flex items-center justify-center text-3xl z-50 group border-2 border-amber-400/50"
          title="Back to Compare"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
        </button>
      </Link>

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
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.8s ease-out;
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out both;
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out both;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out both;
        }
      `}</style>
    </div>
  );
}