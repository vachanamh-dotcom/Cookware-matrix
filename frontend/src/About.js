import React from "react";
import { Link } from "react-router-dom";
import logo from "./Assets/logo.png";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center font-sans p-8 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Main card with glassmorphism */}
      <div className="relative w-[90%] max-w-[1200px] bg-white/10 backdrop-blur-xl rounded-[50px] shadow-2xl p-16 border border-white/20 animate-scaleIn">
        {/* Page Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 text-5xl font-bold mb-2">About Us</h1>
          <p className="text-slate-300 text-lg">Learn who we are and what we stand for</p>
        </div>

        {/* Header with logo and navigation */}
        <div className="flex justify-between items-start mb-12 pb-6 border-b border-slate-600/30 animate-slideDown">
          {/* Logo */}
          <img src={logo} alt="Cookware Matrix logo" className="w-16 h-16 drop-shadow-lg" />
          
          {/* Navigation */}
          <nav className="flex gap-8 text-slate-300 text-base font-medium">
            <Link to="/home" className="hover:text-emerald-400 transition-all hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-emerald-400 after:transition-all hover:after:w-full">Home</Link>
            <Link to="/about" className="hover:text-emerald-400 transition-all hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-emerald-400">About</Link>
            <Link to="/help" className="hover:text-emerald-400 transition-all hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-emerald-400 after:transition-all hover:after:w-full">Help</Link>
          </nav>
        </div>

        {/* Our Story Section */}
        <section className="mb-16 animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">✨</span>
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 text-4xl font-bold tracking-tight">Our Story</h2>
          </div>
          <div className="text-slate-200 text-lg leading-relaxed space-y-4 max-w-4xl">
            <p className="font-semibold text-slate-100">
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
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-600/50 to-transparent mb-16"></div>

        {/* How We Work Section */}
        <section className="mb-16 animate-slideInLeft" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">⚙️</span>
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 text-4xl font-bold tracking-tight">How We Work</h2>
          </div>
          <div className="text-slate-200 text-lg leading-relaxed space-y-4 max-w-4xl">
            <p>Our process is built on transparency and a passion for great kitchen tools.</p>
            <ol className="space-y-6 mt-6">
              <li className="flex gap-4 p-4 rounded-xl bg-slate-700/30 border-l-4 border-emerald-500 hover:bg-slate-700/50 transition-all">
                <span className="text-2xl flex-shrink-0">🔍</span>
                <div>
                  <strong className="text-emerald-300 text-xl">In-Depth Research:</strong>
                  <p className="mt-2 text-slate-300">We meticulously research and analyze cookware brands, materials, and 
                  specific products. We look at everything from durability and heat conductivity to non-stick 
                  properties and user feedback.</p>
                </div>
              </li>
              <li className="flex gap-4 p-4 rounded-xl bg-slate-700/30 border-l-4 border-teal-500 hover:bg-slate-700/50 transition-all">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <strong className="text-teal-300 text-xl">The "Matrix" System:</strong>
                  <p className="mt-2 text-slate-300">We break down our findings into an easy-to-read "matrix." This unique 
                  system allows you to directly compare products side-by-side on key factors like price, 
                  material, and performance, helping you see the pros and cons at a glance.</p>
                </div>
              </li>
              <li className="flex gap-4 p-4 rounded-xl bg-slate-700/30 border-l-4 border-cyan-500 hover:bg-slate-700/50 transition-all">
                <span className="text-2xl flex-shrink-0">✓</span>
                <div>
                  <strong className="text-cyan-300 text-xl">Unbiased Insights:</strong>
                  <p className="mt-2 text-slate-300">We are not affiliated with any cookware brands. Our reviews and 
                  comparisons are based on objective data and a commitment to helping you make the best 
                  choice for your unique needs.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-600/50 to-transparent mb-16"></div>

        {/* Our Promise Section */}
        <section className="mb-16 animate-slideInLeft" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🤝</span>
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 text-4xl font-bold tracking-tight">Our Promise</h2>
          </div>
          <div className="text-slate-200 text-lg leading-relaxed space-y-4 max-w-4xl">
            <p>
              Whether you're looking for your first set of pans or a specific skillet to perfect a recipe, Cookware 
              Matrix is here to guide you. We promise to keep our information current, our comparisons honest, 
              and our recommendations focused on helping you cook smarter and with more confidence. 
              Thank you for trusting us to be your kitchen resource.
            </p>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-600/50 to-transparent mb-16"></div>

        {/* Our Team Section */}
        <section className="animate-slideInLeft" style={{ animationDelay: '0.8s' }}>
          <div className="flex items-center gap-3 mb-10">
            <span className="text-3xl">👥</span>
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 text-4xl font-bold tracking-tight">Our Team</h2>
          </div>
          <div className="grid grid-cols-3 gap-8 mb-12">
            {/* Member 1 */}
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-slate-600/30 shadow-xl hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                M1
              </div>
              <p className="text-xl font-semibold text-white mb-2">member1</p>
              <p className="text-sm text-slate-300 mb-1">rollnumber</p>
              <p className="text-sm text-slate-400">course</p>
            </div>
            
            {/* Member 2 */}
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-slate-600/30 shadow-xl hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-500/20 transition-all duration-300">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                M2
              </div>
              <p className="text-xl font-semibold text-white mb-2">member2</p>
              <p className="text-sm text-slate-300 mb-1">rollnumber</p>
              <p className="text-sm text-slate-400">course</p>
            </div>
            
            {/* Member 3 */}
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-slate-600/30 shadow-xl hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                M3
              </div>
              <p className="text-xl font-semibold text-white mb-2">member3</p>
              <p className="text-sm text-slate-300 mb-1">rollnumber</p>
              <p className="text-sm text-slate-400">course</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center mt-16 pt-12 border-t border-slate-600/30 animate-fadeInUp" style={{ animationDelay: '1s' }}>
          <p className="text-slate-200 text-xl mb-6">Ready to explore cookware?</p>
          <Link to="/home">
            <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-12 py-4 rounded-full text-lg font-semibold shadow-2xl hover:from-emerald-400 hover:to-teal-400 transition-all transform hover:scale-110 hover:shadow-emerald-500/50">
              Start Your Journey →
            </button>
          </Link>
        </section>
      </div>

      <style>{`
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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
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

        .animate-scaleIn {
          animation: scaleIn 0.8s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out both;
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out both;
        }
      `}</style>
    </div>
  );
}