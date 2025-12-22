// ProductDetails.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Package, Info, Flame } from "lucide-react";
import logo from "./Assets/logo.png";
import { formatPrice, getImage } from "./utils/formatters";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedImage, setSelectedImage] = useState(0);

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
    // Fetch product details from backend
    fetch(`http://localhost:5000/api/cookware/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-900 to-red-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6 animate-bounce">🍳</div>
          <p className="text-amber-100 text-xl">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-900 to-red-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">❌</div>
          <p className="text-amber-100 text-xl mb-4">Product not found</p>
          <button
            onClick={() => navigate('/home')}
            className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-semibold hover:from-amber-400 hover:via-orange-400 hover:to-red-400 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

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
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.6s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.8s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out both; }
      `}</style>

      {/* Animated background blobs */}
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

      {/* Navigation Header */}
      <nav className="relative z-20 flex justify-between items-center px-8 py-6 animate-slideDown">
        <div className="flex items-center gap-3">
          <img 
            src={logo} 
            alt="Cookware Matrix logo" 
            className="w-16 h-16 drop-shadow-2xl hover:scale-110 transition-transform duration-300 cursor-pointer" 
            onClick={() => navigate('/home')}
          />
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 animate-gradient">
            Cookware Matrix
          </h2>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-semibold hover:from-amber-400 hover:via-orange-400 hover:to-red-400 transition-all transform hover:scale-105 shadow-xl"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image Section */}
          <div className="animate-scaleIn">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-[30px] p-8 border-2 border-orange-300/30 shadow-2xl">
              {/* Main Image */}
              <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-2xl p-8 mb-6 flex items-center justify-center min-h-[400px]">
                <img
                  src={getImage(product.image)}
                  alt={product.title}
                  className="max-w-full max-h-[400px] object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                    e.target.onerror = null;
                  }}
                />
              </div>

              {/* Image Gallery (if multiple images available) */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl p-3 border-2 transition-all ${
                        selectedImage === index 
                          ? 'border-amber-400' 
                          : 'border-orange-400/30 hover:border-orange-400/60'
                      }`}
                    >
                      <img
                        src={getImage(img)}
                        alt={`${product.title} ${index + 1}`}
                        className="w-20 h-20 object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="animate-fadeInUp space-y-6">
            {/* Title and Brand */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-[30px] p-8 border-2 border-orange-300/30 shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-t-[30px]"></div>
              
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 mb-4">
                {product.title}
              </h1>
              
              {product.brand && (
                <p className="text-orange-200 text-lg mb-4">
                  Brand: <span className="text-amber-300 font-semibold">{product.brand}</span>
                </p>
              )}

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-orange-300/30'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-amber-100 text-xl font-semibold">
                    {product.rating}
                  </span>
                  {product.reviews && (
                    <span className="text-orange-200/80">
                      ({product.reviews} reviews)
                    </span>
                  )}
                </div>
              )}

              {/* Price */}
              <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 rounded-2xl p-6 border-2 border-amber-400/40">
                <p className="text-orange-200 text-sm mb-2">Price</p>
                <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>

            {/* Product Specifications */}
            {(product.material || product.capacity || product.size || product.weight) && (
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-[30px] p-8 border-2 border-orange-300/30 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Package className="w-6 h-6 text-amber-400" />
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400">
                    Specifications
                  </h2>
                </div>
                
                <div className="space-y-4">
                  {product.material && (
                    <div className="flex justify-between items-center border-b border-orange-400/30 pb-3">
                      <span className="text-orange-200">Material</span>
                      <span className="text-amber-100 font-semibold">{product.material}</span>
                    </div>
                  )}
                  {product.capacity && (
                    <div className="flex justify-between items-center border-b border-orange-400/30 pb-3">
                      <span className="text-orange-200">Capacity</span>
                      <span className="text-amber-100 font-semibold">{product.capacity}</span>
                    </div>
                  )}
                  {product.size && (
                    <div className="flex justify-between items-center border-b border-orange-400/30 pb-3">
                      <span className="text-orange-200">Size</span>
                      <span className="text-amber-100 font-semibold">{product.size}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex justify-between items-center border-b border-orange-400/30 pb-3">
                      <span className="text-orange-200">Weight</span>
                      <span className="text-amber-100 font-semibold">{product.weight}</span>
                    </div>
                  )}
                  {product.category && (
                    <div className="flex justify-between items-center border-b border-orange-400/30 pb-3">
                      <span className="text-orange-200">Category</span>
                      <span className="text-amber-100 font-semibold">{product.category}</span>
                    </div>
                  )}
                  {product.color && (
                    <div className="flex justify-between items-center">
                      <span className="text-orange-200">Color</span>
                      <span className="text-amber-100 font-semibold">{product.color}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-[30px] p-8 border-2 border-orange-300/30 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Info className="w-6 h-6 text-amber-400" />
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400">
                    Description
                  </h2>
                </div>
                <p className="text-amber-100 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-[30px] p-8 border-2 border-orange-300/30 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Flame className="w-6 h-6 text-amber-400" />
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400">
                    Key Features
                  </h2>
                </div>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-amber-400 text-xl mt-1">•</span>
                      <span className="text-amber-100">{feature}</span>
                    </li>
                  ))}
                </ul>
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