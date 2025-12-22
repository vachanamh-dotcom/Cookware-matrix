// Materials.js
import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Sparkles, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Snowfall from "react-snowfall";
import logo from "./Assets/logo.png";

export default function MaterialsPage() {
  const navigate = useNavigate();
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const detailsRef = useRef(null);

  const handleMaterialClick = (material) => {
    setSelectedMaterial(material);
    // Scroll to details section after a short delay to allow state to update
    setTimeout(() => {
      if (detailsRef.current) {
        detailsRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  };

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

  const materials = [
    {
      id: 1,
      name: "Stainless Steel",
      icon: "🔩",
      gradient: "from-gray-400 to-gray-600",
      description: "Durable and versatile metal alloy commonly used in cookware",
      advantages: [
        "Extremely durable and long-lasting",
        "Resistant to rust and corrosion",
        "Non-reactive with acidic foods",
        "Dishwasher safe and easy to clean",
        "Maintains heat well for even cooking",
        "Professional appearance"
      ],
      disadvantages: [
        "Can be expensive, especially high-grade steel",
        "Food may stick if not properly preheated",
        "Poor heat conductor without aluminum/copper core",
        "Can discolor over time with high heat"
      ],
      bestFor: "Sautéing, browning, and deglazing"
    },
    {
      id: 2,
      name: "Cast Iron",
      icon: "⚫",
      gradient: "from-zinc-700 to-zinc-900",
      description: "Heavy-duty iron cookware known for excellent heat retention",
      advantages: [
        "Exceptional heat retention and distribution",
        "Naturally non-stick when seasoned properly",
        "Can go from stovetop to oven",
        "Lasts for generations with proper care",
        "Adds small amounts of dietary iron to food",
        "Affordable compared to other materials"
      ],
      disadvantages: [
        "Very heavy and difficult to handle",
        "Requires regular seasoning and maintenance",
        "Can rust if not dried properly",
        "Slow to heat up",
        "Reactive with acidic foods (can affect taste)",
        "Not dishwasher safe"
      ],
      bestFor: "Searing, frying, and slow-cooking"
    },
    {
      id: 3,
      name: "Non-Stick (PTFE/Teflon)",
      icon: "✨",
      gradient: "from-slate-400 to-slate-600",
      description: "Coating that prevents food from sticking during cooking",
      advantages: [
        "Food slides off easily, minimal sticking",
        "Requires less oil or butter for cooking",
        "Very easy to clean",
        "Lightweight and easy to handle",
        "Great for delicate foods like eggs and fish",
        "Affordable"
      ],
      disadvantages: [
        "Coating can scratch and degrade over time",
        "Not suitable for high-heat cooking",
        "Cannot use metal utensils",
        "Coating may release harmful fumes if overheated",
        "Typically needs replacement every 3-5 years",
        "Not oven-safe at high temperatures"
      ],
      bestFor: "Low-heat cooking, eggs, and delicate foods"
    },
    {
      id: 4,
      name: "Copper",
      icon: "🟤",
      gradient: "from-orange-400 to-orange-700",
      description: "Premium metal with superior heat conductivity",
      advantages: [
        "Best heat conductor of all cookware materials",
        "Heats up and cools down quickly",
        "Precise temperature control",
        "Beautiful aesthetic appearance",
        "Even heat distribution prevents hot spots",
        "Professional chef's choice"
      ],
      disadvantages: [
        "Very expensive",
        "Requires regular polishing to maintain appearance",
        "Can react with acidic foods (needs lining)",
        "Typically lined with tin or stainless steel",
        "Heavy and requires careful handling",
        "Not dishwasher safe"
      ],
      bestFor: "Sauces, caramel, and temperature-sensitive dishes"
    },
    {
      id: 5,
      name: "Aluminum",
      icon: "⚪",
      gradient: "from-slate-300 to-slate-500",
      description: "Lightweight metal with good heat conductivity",
      advantages: [
        "Excellent heat conductor",
        "Lightweight and easy to handle",
        "Heats up quickly",
        "Affordable",
        "Even heat distribution",
        "Good for everyday cooking"
      ],
      disadvantages: [
        "Can react with acidic and alkaline foods",
        "Not as durable as other materials",
        "Can warp at high temperatures",
        "May discolor over time",
        "Concerns about aluminum leaching into food",
        "Cannot be used on induction cooktops (unless magnetic base)"
      ],
      bestFor: "Boiling water, everyday cooking tasks"
    },
    {
      id: 6,
      name: "Ceramic",
      icon: "🏺",
      gradient: "from-amber-300 to-amber-600",
      description: "Natural non-stick coating made from sand-derived materials",
      advantages: [
        "PTFE and PFOA-free (safer alternative to Teflon)",
        "Non-stick surface without synthetic chemicals",
        "Can withstand higher heat than traditional non-stick",
        "Easy to clean",
        "Beautiful, often colorful designs",
        "Eco-friendly option"
      ],
      disadvantages: [
        "Non-stick properties degrade faster than PTFE",
        "Can chip or crack if dropped",
        "Not as durable as metal cookware",
        "Sensitive to thermal shock",
        "Cannot use metal utensils",
        "Hand washing recommended despite claims"
      ],
      bestFor: "Moderate-heat cooking and aesthetic presentation"
    },
    {
      id: 7,
      name: "Carbon Steel",
      icon: "⬛",
      gradient: "from-gray-600 to-gray-800",
      description: "Similar to cast iron but lighter and more responsive",
      advantages: [
        "Lighter than cast iron",
        "Heats up faster than cast iron",
        "Develops natural non-stick patina",
        "Highly durable and long-lasting",
        "Can handle very high heat",
        "Preferred by professional chefs for woks and pans"
      ],
      disadvantages: [
        "Requires seasoning like cast iron",
        "Can rust if not maintained properly",
        "Reactive with acidic foods initially",
        "Needs hand washing",
        "May require learning curve for proper use",
        "Can discolor over time"
      ],
      bestFor: "Stir-frying, high-heat searing, and wok cooking"
    },
    {
      id: 8,
      name: "Hard-Anodized Aluminum",
      icon: "🔘",
      gradient: "from-gray-500 to-gray-700",
      description: "Electrochemically hardened aluminum with enhanced durability",
      advantages: [
        "Harder than stainless steel surface",
        "Non-reactive with acidic foods",
        "Excellent heat conduction",
        "Scratch and corrosion resistant",
        "Lightweight compared to cast iron",
        "More durable than regular aluminum"
      ],
      disadvantages: [
        "Cannot be used on induction without magnetic base",
        "More expensive than regular aluminum",
        "Dark color can make it hard to see food browning",
        "Not dishwasher safe",
        "Can lose non-stick properties over time",
        "Cannot be repaired if coating is damaged"
      ],
      bestFor: "Everyday cooking and sautéing"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-900 to-red-950 font-sans relative overflow-hidden">
      {/* Snowfall Effect */}
      <Snowfall
        color="#fbbf24"
        snowflakeCount={100}
        speed={[0.5, 1.5]}
        wind={[-0.5, 1.0]}
        radius={[0.5, 2.0]}
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          zIndex: 1
        }}
      />

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
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-red-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Floating cookware icons */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-floatSlow">🍳</div>
      <div className="absolute top-32 right-20 text-5xl opacity-15 animate-floatMedium" style={{ animationDelay: '1s' }}>🔩</div>
      <div className="absolute bottom-20 left-32 text-7xl opacity-10 animate-floatSlow" style={{ animationDelay: '2s' }}>⚫</div>
      <div className="absolute top-1/2 right-10 text-4xl opacity-15 animate-floatMedium" style={{ animationDelay: '1.5s' }}>🏺</div>

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
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slideDown { animation: slideDown 0.6s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.8s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out both; }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
      `}</style>

      {/* Navigation */}
      <nav className="relative z-20 flex flex-col md:flex-row justify-between items-center px-4 md:px-8 py-6 animate-slideDown gap-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Cookware Matrix logo" className="w-16 h-16 drop-shadow-2xl hover:scale-110 transition-transform duration-300 cursor-pointer" />
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 animate-gradient">
            Cookware Materials
          </h2>
        </div>
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-amber-100 hover:text-amber-300 transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] hover:scale-110 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16 animate-scaleIn">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Sparkles className="w-16 h-16 text-amber-400 animate-pulse" />
              <div className="absolute inset-0 blur-xl bg-amber-400/30 animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 text-5xl md:text-6xl font-bold leading-tight mb-4 drop-shadow-lg animate-gradient">
            Know Your Materials
          </h1>
          <p className="text-amber-100 text-lg md:text-xl font-light max-w-3xl mx-auto leading-relaxed">
            Understanding cookware materials helps you make informed decisions for your kitchen. Each material has unique properties, advantages, and ideal use cases.
          </p>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {materials.map((material, index) => (
            <button
              key={material.id}
              onClick={() => handleMaterialClick(material)}
              className={`group relative bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 rounded-2xl p-6 md:p-8 hover:from-orange-900/70 hover:to-red-900/70 transition-all transform hover:scale-105 hover:shadow-2xl animate-fadeInUp text-left ${
                selectedMaterial?.id === material.id 
                  ? 'border-amber-400/60 shadow-2xl shadow-amber-500/30' 
                  : 'border-orange-400/40 hover:border-amber-400/60'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>
              <div className="text-5xl md:text-6xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">{material.icon}</div>
              <h3 className="text-amber-100 font-bold text-xl mb-2 group-hover:text-amber-200 transition-colors">{material.name}</h3>
              <p className="text-orange-200/80 text-sm leading-relaxed mb-4">{material.description}</p>
              <div className="flex items-center gap-2 text-amber-400 font-semibold group-hover:gap-3 transition-all">
                <span>Learn More</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          ))}
        </div>

        {/* Detailed View */}
        {selectedMaterial && (
          <div ref={detailsRef} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border-2 border-orange-300/40 rounded-[30px] p-6 md:p-12 animate-fadeIn shadow-2xl scroll-mt-20">
            <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
              <div className="text-6xl md:text-7xl animate-floatMedium">{selectedMaterial.icon}</div>
              <div className="flex-1">
                <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 text-3xl md:text-4xl font-bold mb-2 animate-gradient">
                  {selectedMaterial.name}
                </h2>
                <p className="text-amber-100 text-lg leading-relaxed">{selectedMaterial.description}</p>
              </div>
              <button
                onClick={() => setSelectedMaterial(null)}
                className="md:ml-auto bg-orange-500/20 hover:bg-orange-500/30 border-2 border-orange-400/50 rounded-full p-2 transition-all"
                title="Close details"
              >
                <span className="text-amber-300 text-xl">✕</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {/* Advantages */}
              <div className="bg-gradient-to-br from-emerald-900/40 to-green-900/40 border-2 border-emerald-500/40 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/20 transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-emerald-400 font-bold text-2xl">Advantages</h3>
                </div>
                <ul className="space-y-3">
                  {selectedMaterial.advantages.map((advantage, idx) => (
                    <li key={idx} className="flex items-start gap-3 group hover:translate-x-1 transition-transform">
                      <span className="text-emerald-400 mt-1 font-bold">✓</span>
                      <span className="text-emerald-50 leading-relaxed">{advantage}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disadvantages */}
              <div className="bg-gradient-to-br from-red-900/40 to-rose-900/40 border-2 border-red-500/40 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:shadow-red-500/20 transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <XCircle className="w-6 h-6 text-red-400" />
                  <h3 className="text-red-400 font-bold text-2xl">Disadvantages</h3>
                </div>
                <ul className="space-y-3">
                  {selectedMaterial.disadvantages.map((disadvantage, idx) => (
                    <li key={idx} className="flex items-start gap-3 group hover:translate-x-1 transition-transform">
                      <span className="text-red-400 mt-1 font-bold">✗</span>
                      <span className="text-red-50 leading-relaxed">{disadvantage}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Best For */}
            <div className="mt-6 md:mt-8 bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-2 border-purple-500/40 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <h3 className="text-purple-400 font-bold text-xl">Best Used For</h3>
              </div>
              <p className="text-purple-50 text-lg leading-relaxed">{selectedMaterial.bestFor}</p>
            </div>
          </div>
        )}

        {/* No Selection Prompt */}
        {!selectedMaterial && (
          <div className="text-center py-16 animate-fadeIn">
            <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border-2 border-orange-400/40 rounded-2xl p-12 max-w-2xl mx-auto shadow-xl">

              <p className="text-amber-100 text-xl leading-relaxed">
                Click on any material above to learn more about its properties, advantages, and best uses
              </p>
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
    </div>
  );
}