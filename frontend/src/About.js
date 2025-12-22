import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "./Assets/logo.png";

export default function About() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-900 to-red-950 flex items-center justify-center font-sans p-4 md:p-8 relative overflow-hidden">
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
      <div className="absolute top-32 right-20 text-5xl opacity-15 animate-floatMedium" style={{ animationDelay: '1s' }}>🍲</div>
      <div className="absolute bottom-20 left-32 text-7xl opacity-10 animate-floatSlow" style={{ animationDelay: '2s' }}>🥘</div>
      <div className="absolute top-1/2 right-10 text-4xl opacity-15 animate-floatMedium" style={{ animationDelay: '1.5s' }}>🫕</div>

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
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out;
        }
      `}</style>

      {/* Main card - enhanced glassmorphism */}
      <div className="relative w-full max-w-[1200px] bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl rounded-[30px] md:rounded-[50px] shadow-2xl p-6 md:p-16 border-2 border-orange-300/30 z-10 hover:border-amber-300/50 transition-all duration-500">
        
        {/* Page Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="flex items-center gap-3 justify-center mb-4">
            <span className="text-5xl">✨</span>
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 text-4xl md:text-5xl font-bold animate-gradient">
              About Us
            </h1>
          </div>
          <p className="text-amber-100 text-lg">Learn who we are and what we stand for</p>
        </div>

        {/* Header with logo and navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-12 pb-6 border-b border-orange-400/30 gap-4">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Cookware Matrix logo" className="w-20 h-20 drop-shadow-2xl hover:scale-110 transition-transform duration-300 cursor-pointer" />
            <div className="hidden md:block">
              <div className="text-amber-100 font-bold text-xl">About Us</div>
              <div className="text-orange-300/80 text-sm">Our mission and team</div>
            </div>
          </div>
          
          <nav className="flex gap-4 md:gap-8 text-amber-100 text-sm md:text-base font-semibold">
            <Link 
              to="/home" 
              className="hover:text-amber-300 transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] hover:scale-110 relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/about" 
              className="text-amber-300 hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] hover:scale-110 relative"
            >
              About
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-300"></span>
            </Link>
            <Link 
              to="/help" 
              className="hover:text-amber-300 transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] hover:scale-110 relative group"
            >
              Help
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>
        </div>

        {/* Our Story Section */}
        <section className="mb-16 animate-slide-in-left">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl">✨</span>
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 text-3xl md:text-4xl font-bold tracking-tight animate-gradient">
              Our Story
            </h2>
          </div>
          <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl rounded-2xl p-8 border-2 border-orange-400/40 shadow-xl">
            <div className="text-amber-50 text-lg leading-relaxed space-y-4">
              <p className="font-semibold text-amber-100">
                Welcome to Cookware Matrix, where we believe that the right cookware can transform any meal. 
              </p>
              <p>
                We started this site because we were tired of the guesswork involved in buying kitchen products. 
                Endless reviews, conflicting information, and confusing jargon made it nearly impossible to know 
                if you were truly getting the best value for your money.
              </p>
              <p>
                We created Cookware Matrix to change that. Our mission is to provide a single, trustworthy 
                source for unbiased, clear, and comprehensive comparisons of cookware products. We do the 
                research so you don't have to.
              </p>
            </div>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent mb-16"></div>

        {/* How We Work Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl">⚙️</span>
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 text-3xl md:text-4xl font-bold tracking-tight animate-gradient">
              How We Work
            </h2>
          </div>
          <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl rounded-2xl p-8 border-2 border-orange-400/40 shadow-xl">
            <div className="text-amber-50 text-lg leading-relaxed space-y-4 mb-6">
              <p>Our process is built on transparency and a passion for great kitchen tools.</p>
            </div>
            <ol className="space-y-6">
              <li className="flex gap-4 p-6 rounded-xl bg-gradient-to-br from-amber-950/60 to-orange-950/60 border-l-4 border-amber-500 hover:from-amber-950/80 hover:to-orange-950/80 transition-all shadow-lg group">
                <span className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">🔍</span>
                <div>
                  <strong className="text-amber-300 text-xl block mb-2">In-Depth Research:</strong>
                  <p className="text-amber-100">We meticulously research and analyze cookware brands, materials, and 
                  specific products. We look at everything from durability and heat conductivity to non-stick 
                  properties and user feedback.</p>
                </div>
              </li>
              <li className="flex gap-4 p-6 rounded-xl bg-gradient-to-br from-amber-950/60 to-orange-950/60 border-l-4 border-orange-500 hover:from-amber-950/80 hover:to-orange-950/80 transition-all shadow-lg group">
                <span className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">📊</span>
                <div>
                  <strong className="text-orange-300 text-xl block mb-2">The "Matrix" System:</strong>
                  <p className="text-amber-100">We break down our findings into an easy-to-read "matrix." This unique 
                  system allows you to directly compare products side-by-side on key factors like price, 
                  material, and performance, helping you see the pros and cons at a glance.</p>
                </div>
              </li>
              <li className="flex gap-4 p-6 rounded-xl bg-gradient-to-br from-amber-950/60 to-orange-950/60 border-l-4 border-red-500 hover:from-amber-950/80 hover:to-orange-950/80 transition-all shadow-lg group">
                <span className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">✓</span>
                <div>
                  <strong className="text-red-300 text-xl block mb-2">Unbiased Insights:</strong>
                  <p className="text-amber-100">We are not affiliated with any cookware brands. Our reviews and 
                  comparisons are based on objective data and a commitment to helping you make the best 
                  choice for your unique needs.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent mb-16"></div>

        {/* Our Promise Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl">🤝</span>
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 text-3xl md:text-4xl font-bold tracking-tight animate-gradient">
              Our Promise
            </h2>
          </div>
          <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl rounded-2xl p-8 border-2 border-orange-400/40 shadow-xl">
            <div className="text-amber-50 text-lg leading-relaxed space-y-4">
              <p>
                Whether you're looking for your first set of pans or a specific skillet to perfect a recipe, Cookware 
                Matrix is here to guide you. We promise to keep our information current, our comparisons honest, 
                and our recommendations focused on helping you cook smarter and with more confidence. 
                Thank you for trusting us to be your kitchen resource.
              </p>
            </div>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent mb-16"></div>

        {/* Our Team Section */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <span className="text-4xl">👥</span>
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 text-3xl md:text-4xl font-bold tracking-tight animate-gradient">
              Our Team
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Member 1 */}
            <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl rounded-2xl p-8 text-center border-2 border-orange-400/40 shadow-xl hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/30 hover:border-amber-400/60 transition-all duration-300 group">
              <div className="relative w-24 h-24 bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                M1
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
              </div>
              <p className="text-xl font-semibold text-amber-100 mb-2">member1</p>
              <p className="text-sm text-orange-200 mb-1">rollnumber</p>
              <p className="text-sm text-orange-300/80">course</p>
            </div>
            
            {/* Member 2 */}
            <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl rounded-2xl p-8 text-center border-2 border-orange-400/40 shadow-xl hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/30 hover:border-amber-400/60 transition-all duration-300 group">
              <div className="relative w-24 h-24 bg-gradient-to-br from-orange-500 via-red-500 to-amber-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                M2
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
              </div>
              <p className="text-xl font-semibold text-amber-100 mb-2">member2</p>
              <p className="text-sm text-orange-200 mb-1">rollnumber</p>
              <p className="text-sm text-orange-300/80">course</p>
            </div>
            
            {/* Member 3 */}
            <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl rounded-2xl p-8 text-center border-2 border-orange-400/40 shadow-xl hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/30 hover:border-amber-400/60 transition-all duration-300 group">
              <div className="relative w-24 h-24 bg-gradient-to-br from-red-500 via-orange-600 to-amber-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                M3
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
              </div>
              <p className="text-xl font-semibold text-amber-100 mb-2">member3</p>
              <p className="text-sm text-orange-200 mb-1">rollnumber</p>
              <p className="text-sm text-orange-300/80">course</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center mt-16 pt-12 border-t border-orange-400/30">
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-2xl p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="absolute top-4 right-4 text-6xl opacity-10">🚀</div>
            <div className="absolute bottom-4 left-4 text-5xl opacity-10">✨</div>
            
            <p className="relative z-10 text-white text-xl mb-6 font-semibold">Ready to explore cookware?</p>
            <Link to="/home">
              <button className="relative z-10 bg-white text-orange-700 px-12 py-4 rounded-full text-lg font-bold shadow-xl hover:bg-amber-50 transition-all transform hover:scale-110 hover:shadow-2xl flex items-center gap-2 mx-auto">
                Start Your Journey
                <span className="text-xl">→</span>
              </button>
            </Link>
          </div>
        </section>
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