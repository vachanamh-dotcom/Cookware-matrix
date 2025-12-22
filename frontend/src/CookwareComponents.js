import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// --- 1. Utility Components ---

// Reusable loader component
const Loader = () => (
  <div className="flex flex-col justify-center items-center p-8 animate-fadeIn">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-orange-200 border-t-amber-500 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl">🍳</span>
      </div>
    </div>
    <span className="mt-4 text-amber-100 font-semibold text-lg">Loading Amazing Cookware...</span>
  </div>
);

// Reusable full-page content container
const ContentPage = ({ title, children }) => (
  <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 p-8 rounded-3xl shadow-2xl animate-scaleIn">
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-t-3xl"></div>
    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 mb-6 pb-3 border-b-2 border-orange-400/30 animate-gradient">
      {title}
    </h1>
    <div className="space-y-4 text-amber-100">
      {children}
    </div>
  </div>
);

// Reusable component for displaying basic product placeholders
const ProductDisplay = ({ title, emoji }) => (
  <div className="group relative bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 rounded-2xl p-6 flex flex-col items-center justify-center shadow-xl hover:scale-110 hover:border-amber-400/60 transition-all duration-300 cursor-pointer">
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-t-2xl"></div>
    <div className="text-5xl mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">{emoji}</div>
    <p className="text-sm font-semibold text-amber-100 text-center">{title}</p>
  </div>
);

// Component for selection dropdowns
const SelectionBox = ({ label, options }) => (
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-semibold text-amber-200 flex items-center gap-2">
      <span className="text-lg">🔍</span>
      {label}
    </label>
    <select className="p-3 bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 rounded-xl shadow-lg text-amber-100 font-medium focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all hover:border-amber-400/60">
      {options.map((option, index) => (
        <option key={index} value={option} className="bg-orange-950">
          {option}
        </option>
      ))}
    </select>
  </div>
);

// Component for displaying a single product card
const ProductCard = ({ product, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className={`relative group bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 rounded-3xl p-5 text-center shadow-2xl hover:border-amber-400/60 hover:scale-105 transition-all duration-300 transform ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-t-3xl"></div>
      
      <div className="w-full h-24 bg-gradient-to-br from-orange-800/30 to-red-800/30 rounded-xl mb-3 flex items-center justify-center border border-orange-400/20 group-hover:scale-110 transition-transform">
        <div className="text-5xl group-hover:rotate-12 transition-transform duration-300">🍳</div>
      </div>
      
      <p className="text-base font-bold text-amber-100 mb-1">{product.title}</p>
      <p className="text-sm text-orange-200/80 mb-2">{product.brand}</p>
      <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 mb-3">
        ₹{product.price}
      </p>
      
      <Link 
        to={`/compare/${product._id}`} 
        className="inline-block bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-xs font-bold hover:from-amber-400 hover:via-orange-400 hover:to-red-400 transition-all transform hover:scale-105 shadow-lg border border-amber-300/50"
      >
        View Details →
      </Link>
    </div>
  );
};

const ComparisonHeader = ({ title, subtitle }) => (
  <div className="text-center bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 rounded-2xl p-4 shadow-xl">
    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">{title}</h2>
    <p className="text-sm text-orange-200/80 mt-1">{subtitle}</p>
  </div>
);

// --- 2. Page Components (Main UI) ---

// Home Page (Main Landing Page)
export const HomePage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  return (
    <div className="relative text-center p-12 bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 rounded-3xl shadow-2xl overflow-hidden animate-scaleIn">
      {/* Background blobs */}
      <div 
        className="absolute top-10 left-10 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse"
        style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
      ></div>
      <div 
        className="absolute bottom-10 right-10 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: '1s', transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)` }}
      ></div>

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-t-3xl"></div>
      
      <div className="relative z-10">
        <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 mb-6 tracking-wider animate-gradient drop-shadow-2xl">
          COOKWARE MATRIX
        </h1>
        <p className="text-xl text-amber-100 max-w-2xl mx-auto mb-8 drop-shadow-lg">
          Discover your perfect match for kitchen gadgets and cookware based on brand, features, and budget.
        </p>
        
        <div className="mt-8">
          <Link 
            to="/products"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white py-4 px-10 text-lg font-bold rounded-full shadow-2xl hover:from-amber-400 hover:via-orange-400 hover:to-red-400 transition-all duration-300 transform hover:scale-110 border-2 border-amber-300/50"
          >
            <span className="text-2xl">🚀</span>
            Let's Get Started
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <ProductDisplay title="Pressure Cooker" emoji="🍲" />
          <ProductDisplay title="Rice Cooker" emoji="🍚" />
          <ProductDisplay title="Induction Top" emoji="🔥" />
        </div>
      </div>

      <style>{`
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
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

// Products Page (Let's Get Started - Selection Page)
export const ProductsPage = () => {
  const [cookwareList, setCookwareList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
    const fetchCookware = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cookware');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setCookwareList(data);
      } catch (e) {
        console.error("Failed to fetch cookware:", e);
        setError("Failed to load products. Is the backend server running?");
      } finally {
        setLoading(false);
      }
    };

    fetchCookware();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader />
    </div>
  );
  
  if (error) return (
    <div className="text-center p-8 bg-red-900/30 border-2 border-red-500/50 rounded-2xl backdrop-blur-xl animate-fadeIn">
      <p className="text-red-300 font-semibold text-lg">⚠️ {error}</p>
    </div>
  );

  return (
    <div className="relative bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 p-6 rounded-3xl shadow-2xl overflow-hidden animate-scaleIn">
      {/* Background blobs */}
      <div 
        className="absolute top-10 left-10 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse"
        style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
      ></div>
      <div 
        className="absolute bottom-10 right-10 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: '1s', transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)` }}
      ></div>

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-t-3xl"></div>
      
      <div className="relative z-10">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 mb-6 pb-2 border-b-2 border-orange-400/30 animate-gradient flex items-center gap-3">
          <span className="text-3xl">✨</span>
          Discover Your Perfect Match
        </h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-gradient-to-br from-orange-950/40 to-red-950/40 backdrop-blur-sm p-6 rounded-2xl border border-orange-400/30">
          <SelectionBox label="Select Item" options={['All', 'Frying Pan', 'Pressure Cooker']} />
          <SelectionBox label="Select Brand" options={['All', 'Prestige', 'Hawkins', 'Pigeon']} />
          <button className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-8 rounded-xl shadow-2xl hover:from-amber-400 hover:via-orange-400 hover:to-red-400 self-end h-12 font-bold transition-all transform hover:scale-105 border-2 border-amber-300/50 flex items-center gap-2 justify-center">
            <span className="text-lg">🔍</span>
            Filter
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {cookwareList.length > 0 ? (
            cookwareList.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))
          ) : (
            <div className="col-span-5 text-center p-12 bg-gradient-to-br from-orange-950/40 to-red-950/40 backdrop-blur-sm rounded-2xl border-2 border-orange-400/30">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-amber-100 text-lg font-semibold">No products found</p>
              <p className="text-orange-200/80 text-sm mt-2">Did you run the /api/cookware/seed endpoint?</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
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
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

// Comparison Page (Side-by-Side Matrix)
export const ComparePage = () => {
  const attributes = [
    { label: 'Title', value1: 'Prestige Cooker', value2: 'Pigeon Cooker', icon: '📝' },
    { label: 'Brand', value1: 'Prestige', value2: 'Pigeon', icon: '🏷️' },
    { label: 'Price (Approx)', value1: '₹1500', value2: '₹1200', icon: '💰' },
    { label: 'Material', value1: 'Stainless Steel', value2: 'Aluminium', icon: '🔨' },
    { label: 'Weight', value1: '2.5kg', value2: '2.2kg', icon: '⚖️' },
    { label: 'Heat Compatibility', value1: 'Gas, Electric', value2: 'Gas, Induction', icon: '🔥' },
    { label: 'Durability', value1: 'High', value2: 'Medium', icon: '💪' },
    { label: 'Special Features', value1: 'Ergonomic Handle', value2: 'Safety Valve', icon: '✨' },
  ];

  return (
    <div className="relative bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 p-6 rounded-3xl shadow-2xl animate-scaleIn overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-t-3xl"></div>
      
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 mb-6 pb-2 border-b-2 border-orange-400/30 animate-gradient flex items-center gap-3">
        <span className="text-3xl">⚡</span>
        Comparison Matrix
      </h1>
      
      <div className="flex flex-col md:flex-row justify-around items-center gap-4 mb-8 bg-gradient-to-br from-orange-950/40 to-red-950/40 backdrop-blur-sm p-6 rounded-2xl border border-orange-400/30">
        <ComparisonHeader title="Product 1" subtitle="Current Selection" />
        <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 animate-pulse">VS</div>
        <ComparisonHeader title="Product 2" subtitle="Current Selection" />
      </div>

      <div className="w-full rounded-2xl overflow-hidden border-2 border-orange-400/30 shadow-xl">
        {attributes.map((attr, index) => (
          <div 
            key={index} 
            className={`flex flex-col md:flex-row ${
              index % 2 === 0 
                ? 'bg-gradient-to-br from-orange-950/30 to-red-950/30' 
                : 'bg-gradient-to-br from-orange-900/20 to-red-900/20'
            } border-b border-orange-400/20 last:border-b-0 backdrop-blur-sm hover:bg-orange-800/30 transition-all`}
          >
            <div className="w-full md:w-1/3 p-4 font-bold text-amber-200 flex items-center gap-2 border-b md:border-b-0 md:border-r border-orange-400/20">
              <span className="text-xl">{attr.icon}</span>
              {attr.label}
            </div>
            <div className="w-full md:w-1/3 p-4 text-amber-100 font-semibold border-b md:border-b-0 md:border-r border-orange-400/20">{attr.value1}</div>
            <div className="w-full md:w-1/3 p-4 text-amber-100 font-semibold">{attr.value2}</div>
          </div>
        ))}
      </div>

      <style>{`
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
      `}</style>
    </div>
  );
};

// About Page
export const AboutPage = () => (
  <ContentPage title="About Cookware Matrix">
    <p className="text-lg leading-relaxed">
      Welcome to Cookware Matrix, where we believe in fostering right cookware appreciation and usage. 
      Our mission is to simplify the complex buying process for kitchen enthusiasts and beginners alike. 
      We provide unbiased comparisons on essential attributes like material quality, heat conductivity, and durability.
    </p>
    <h3 className="text-2xl font-bold mt-8 mb-4 text-amber-200 flex items-center gap-2">
      <span className="text-2xl">🎯</span>
      Our Core Principles
    </h3>
    <ul className="space-y-4">
      <li className="flex items-start gap-3 bg-orange-950/30 p-4 rounded-xl border border-orange-400/20">
        <span className="text-2xl">♻️</span>
        <div>
          <span className="font-bold text-amber-200">Sustainability:</span> Promoting durable cookware to reduce environmental waste.
        </div>
      </li>
      <li className="flex items-start gap-3 bg-orange-950/30 p-4 rounded-xl border border-orange-400/20">
        <span className="text-2xl">🔍</span>
        <div>
          <span className="font-bold text-amber-200">Transparency:</span> Providing clear, verifiable data for honest comparison.
        </div>
      </li>
      <li className="flex items-start gap-3 bg-orange-950/30 p-4 rounded-xl border border-orange-400/20">
        <span className="text-2xl">✨</span>
        <div>
          <span className="font-bold text-amber-200">Usability:</span> Creating an intuitive interface, even for non-tech-savvy users.
        </div>
      </li>
    </ul>
    
    <style>{`
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
    `}</style>
  </ContentPage>
);

// Help Page
export const HelpPage = () => (
  <ContentPage title="Help & User Guide">
    <h3 className="text-2xl font-bold mb-4 text-amber-200 flex items-center gap-2">
      <span className="text-2xl">📖</span>
      How to Use the Matrix
    </h3>
    <ul className="space-y-4">
      <li className="flex items-start gap-3 bg-orange-950/30 p-4 rounded-xl border border-orange-400/20">
        <span className="text-2xl font-bold text-amber-400">1</span>
        <div>
          <span className="font-bold text-amber-200">Select Products:</span> Use the "Let's Get Started" page to search and select the two products you want to compare.
        </div>
      </li>
      <li className="flex items-start gap-3 bg-orange-950/30 p-4 rounded-xl border border-orange-400/20">
        <span className="text-2xl font-bold text-amber-400">2</span>
        <div>
          <span className="font-bold text-amber-200">Compare:</span> Navigate to the "Comparison" page to view the side-by-side matrix of specifications and features.
        </div>
      </li>
      <li className="flex items-start gap-3 bg-orange-950/30 p-4 rounded-xl border border-orange-400/20">
        <span className="text-2xl">📊</span>
        <div>
          <span className="font-bold text-amber-200">Data Sources:</span> Our information is sourced manually from product specifications and user reviews, validated by our internal team.
        </div>
      </li>
    </ul>
    
    <h3 className="text-2xl font-bold mt-8 mb-4 text-amber-200 flex items-center gap-2">
      <span className="text-2xl">📧</span>
      Contact Support
    </h3>
    <div className="bg-orange-950/30 p-6 rounded-xl border border-orange-400/20">
      <p className="mb-3">
        If you find any discrepancies in the data or require technical assistance, please email us at:
      </p>
      <a 
        href="mailto:support@cookwarematrix.com" 
        className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-bold hover:from-amber-400 hover:via-orange-400 hover:to-red-400 transition-all transform hover:scale-105 shadow-lg border border-amber-300/50"
      >
        <span className="text-lg">✉️</span>
        support@cookwarematrix.com
      </a>
    </div>
    
    <style>{`
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
    `}</style>
  </ContentPage>
);