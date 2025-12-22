import React, { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import logo from "./Assets/logo.png";

const stepIcons = {
  start: "🚀",
  filter: "🔍",
  compare: "⚖️",
  insights: "💡",
  choice: "✅"
};

const helpSteps = [
  {
    id: 1,
    title: "Get Started",
    icon: stepIcons.start,
    shortDesc: "Begin your cookware journey",
    content: "From the homepage, simply click the \"Compare\" button. This will take you to our main comparison page, where you'll find a wide range of cookware products and brands ready to be explored.",
    tips: ["Quick access from any page", "Registration required"],
    linkTo: "/home"
  },
  {
    id: 2,
    title: "Browse & Filter",
    icon: stepIcons.filter,
    shortDesc: "Find exactly what you need",
    content: "On the main comparison page, you'll see a list of products. To find exactly what you're looking for, use the filter options on the sidebar.",
    bulletPoints: [
      "Product Type: Pans, pots, skillets, woks, and more",
      "Material: Stainless steel, cast iron, non-stick, ceramic, etc.",
      "Brand: Search for specific brands you trust",
      "Price Range: Set a budget that works for you",
      "Features: Oven-safe handles, glass lids, induction compatibility"
    ],
    tips: ["Use multiple filters for precise results", "Save your favorite filters"],
    linkTo: "/compare"
  },
  {
    id: 3,
    title: "Compare Products",
    icon: stepIcons.compare,
    shortDesc: "Side-by-side comparison",
    content: "Found a few products you like? You can add them to a side-by-side comparison. Simply select the products you're interested in, and a \"Compare\" button will appear. Clicking it will show you a detailed matrix, laying out all the specifications, pros, and cons of each item side-by-side.",
    tips: ["Compare up to 2 products at once", "Visual highlights show the winner"],
    linkTo: "/compare"
  },
  {
    id: 4,
    title: "Read the Insights",
    icon: stepIcons.insights,
    shortDesc: "Expert analysis and ratings",
    content: "For each product, we provide a detailed description and an analysis of its performance.",
    bulletPoints: [
      "Our Rating: Overall score based on durability, performance, and value",
      "Pros & Cons: Quick summary of strengths and areas for improvement",
      "Key Features: Breakdown of the most important specifications"
    ],
    tips: ["Check user ratings too", "Read recent reviews for latest insights"]
  },
  {
    id: 5,
    title: "Make Your Choice!",
    icon: stepIcons.choice,
    shortDesc: "Find your perfect cookware",
    content: "Once you've compared all the options and feel confident in your decision, you're ready to find your next favorite piece of cookware.",
    tips: ["Save comparisons for later", "Share with family or friends"],
    linkTo: "/"
  }
];

const faqs = [
  {
    question: "How many products can I compare at once?",
    answer: "You can compare up to 2 products side-by-side for the best viewing experience."
  },
  {
    question: "Are the ratings updated regularly?",
    answer: "Yes! Our ratings are updated monthly based on new user reviews and product testing."
  },
  {
    question: "Can I save my comparisons?",
    answer: "Absolutely! Use the 'Save' button on any comparison page to store it in your browser."
  },
  {
    question: "Do you include user reviews?",
    answer: "Yes, we aggregate user ratings and reviews from multiple trusted sources."
  }
];

const HelpStep = memo(({ step, index, isOpen, toggleOpen }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100 * index);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div 
      className={`relative bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden transition-all duration-500 transform border-2 border-orange-400/40 hover:border-amber-400/60 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${isOpen ? 'ring-2 ring-amber-400/60 shadow-2xl shadow-amber-500/20' : ''}`}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>
      
      <button
        onClick={toggleOpen}
        className="w-full flex items-center gap-4 p-6 hover:bg-orange-800/40 transition-all duration-300 text-left group"
      >
        <div className="relative flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 group-hover:shadow-amber-500/50 transition-all duration-300">
          {step.id}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
        </div>
        
        <div className="text-5xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 drop-shadow-lg">{step.icon}</div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-amber-100 mb-1 group-hover:text-amber-200 transition-colors flex items-center gap-2">
            {step.title}
            <span className="text-xs text-orange-300 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </h3>
          <p className="text-sm text-orange-200/90 font-medium">{step.shortDesc}</p>
        </div>
        
        <div className={`text-amber-300 transition-all duration-300 text-xl ${isOpen ? 'rotate-180 scale-110' : ''} group-hover:text-amber-200`}>
          ▼
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 space-y-5 animate-slide-down">
          <div className="h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent"></div>
          
          <p className="text-amber-50 leading-relaxed text-base">{step.content}</p>
          
          {step.bulletPoints && (
            <div className="bg-gradient-to-br from-amber-950/60 to-orange-950/60 rounded-xl p-5 border border-orange-500/40 shadow-inner">
              <div className="space-y-3">
                {step.bulletPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-amber-100 group/item hover:translate-x-1 transition-transform duration-200">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mt-0.5">
                      <span className="text-white text-xs font-bold">{idx + 1}</span>
                    </div>
                    <span className="flex-1">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {step.tips && (
            <div className="relative bg-gradient-to-br from-amber-900/50 to-orange-900/50 border-2 border-amber-500/50 rounded-xl p-5 shadow-lg overflow-hidden">
              <div className="absolute top-0 right-0 text-6xl opacity-10">💡</div>
              <p className="relative font-bold text-amber-300 mb-3 flex items-center gap-2 text-lg">
                <span className="text-2xl">💡</span>
                Pro Tips:
              </p>
              <ul className="relative space-y-2 text-sm text-amber-100">
                {step.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 hover:text-amber-200 transition-colors">
                    <span className="text-amber-400 mt-0.5">✦</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {step.linkTo && (
            <Link to={step.linkTo}>
              <button className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-bold shadow-xl hover:from-amber-400 hover:via-orange-400 hover:to-red-400 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50 overflow-hidden group w-full sm:w-auto">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Try it now 
                  <span className="inline-block group-hover:translate-x-2 transition-transform duration-300 text-xl">→</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
});

const ProgressStepper = memo(({ currentStep, onStepClick }) => (
  <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl rounded-2xl shadow-xl p-8 mb-8 border-2 border-orange-400/40">
    <h3 className="text-amber-100 font-semibold mb-6 text-center text-lg flex items-center justify-center gap-2">
      <span className="text-2xl">🗺️</span>
      Your Progress
    </h3>
    <div className="flex items-center justify-between">
      {helpSteps.map((step, index) => (
        <React.Fragment key={step.id}>
          <button
            onClick={() => onStepClick(index)}
            className={`flex flex-col items-center gap-3 transition-all duration-300 ${
              currentStep === index ? 'scale-110' : 'opacity-60 hover:opacity-100 hover:scale-105'
            }`}
          >
            <div className={`relative w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${
              currentStep === index 
                ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 shadow-2xl shadow-orange-500/60' 
                : 'bg-orange-800/60 hover:bg-orange-700/60'
            }`}>
              {step.icon}
              {currentStep === index && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent animate-pulse"></div>
              )}
            </div>
            <span className={`text-xs font-semibold text-center hidden md:block transition-colors ${
              currentStep === index ? 'text-amber-300' : 'text-orange-200'
            }`}>{step.title}</span>
          </button>
          {index < helpSteps.length - 1 && (
            <div className="relative flex-1 mx-3">
              <div className="h-2 bg-orange-800/50 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${
                  currentStep > index 
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 w-full' 
                    : 'w-0'
                }`}></div>
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
));

const FAQItem = memo(({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-orange-400/40 hover:border-amber-400/60 group overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-orange-800/40 transition-all duration-300"
      >
        <span className="font-bold text-amber-100 group-hover:text-amber-200 transition-colors flex items-center gap-3 flex-1 pr-4">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-lg shadow-lg">
            ❓
          </span>
          <span>{faq.question}</span>
        </span>
        <span className={`text-amber-400 transition-all duration-300 text-lg flex-shrink-0 ${isOpen ? 'rotate-180 scale-110' : 'group-hover:scale-110'}`}>▼</span>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 animate-slide-down">
          <div className="h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent mb-4"></div>
          <div className="flex items-start gap-3">
            <span className="text-amber-400 text-2xl flex-shrink-0 mt-1">💬</span>
            <p className="text-amber-50 leading-relaxed flex-1">{faq.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
});

const SearchBar = memo(({ searchQuery, setSearchQuery }) => (
  <div className="mb-8">
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full blur-xl opacity-0 group-focus-within:opacity-30 transition-opacity duration-500"></div>
      <input
        type="text"
        placeholder="Search help topics... (e.g., 'filter', 'compare', 'price')"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="relative w-full px-6 py-4 pr-14 rounded-full border-2 border-orange-400/40 bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl focus:border-amber-400 focus:outline-none text-amber-100 shadow-lg placeholder-orange-300/60 transition-all duration-300 focus:shadow-2xl focus:shadow-orange-500/30 font-medium"
      />
      <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <span className="text-orange-300 text-xl group-focus-within:text-amber-300 group-focus-within:scale-110 transition-all duration-300">🔍</span>
      </div>
    </div>
    {searchQuery && (
      <div className="mt-3 text-sm text-amber-200 flex items-center gap-2 animate-fade-in">
        <span className="text-amber-400">✓</span>
        Found {helpSteps.filter(step =>
          step.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          step.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          step.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
        ).length} results
      </div>
    )}
  </div>
));

export default function Help() {
  const [openStep, setOpenStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredSteps = helpSteps.filter(step =>
    step.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    step.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    step.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStepClick = (index) => {
    setOpenStep(index);
    const element = document.getElementById(`step-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-900 to-red-950 flex items-center justify-center font-sans p-4 md:p-8 relative overflow-hidden">
      <div className="fixed top-0 left-0 right-0 h-1 bg-orange-950/50 z-50">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      <div 
        className="absolute top-20 left-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"
        style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
      ></div>
      <div 
        className="absolute bottom-20 right-40 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl animate-pulse" 
        style={{ animationDelay: '1s', transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)` }}
      ></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-red-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-floatSlow">🍳</div>
      <div className="absolute top-32 right-20 text-5xl opacity-15 animate-floatMedium" style={{ animationDelay: '1s' }}>🍲</div>
      <div className="absolute bottom-20 left-32 text-7xl opacity-10 animate-floatSlow" style={{ animationDelay: '2s' }}>🥘</div>
      <div className="absolute top-1/2 right-10 text-4xl opacity-15 animate-floatMedium" style={{ animationDelay: '1.5s' }}>🫕</div>

      <style>{`
        @keyframes slide-down {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 2000px; }
        }
        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
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
      `}</style>

      <div className="relative w-full max-w-[1200px] bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl rounded-[30px] md:rounded-[50px] shadow-2xl p-6 md:p-16 border-2 border-orange-300/30 z-10 hover:border-amber-300/50 transition-all duration-500">
        
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-10 gap-4">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Cookware Matrix logo" className="w-20 h-20 drop-shadow-2xl hover:scale-110 transition-transform duration-300 cursor-pointer" />
            <div className="hidden md:block">
              <div className="text-amber-100 font-bold text-xl">Help Center</div>
              <div className="text-orange-300/80 text-sm">We're here to assist you</div>
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
              className="hover:text-amber-300 transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] hover:scale-110 relative group"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/help" 
              className="text-amber-300 hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] hover:scale-110 relative"
            >
              Help
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-300"></span>
            </Link>
          </nav>
        </div>

        <section className="mb-10 text-center md:text-left">
          <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 text-3xl md:text-5xl font-bold animate-gradient">
              How to Use Cookware Matrix
            </h1>
          </div>
          <p className="text-amber-100 text-base md:text-lg leading-relaxed max-w-3xl mx-auto md:mx-0">
            Welcome to the Help page! Our goal is to make your search for the perfect cookware as easy as 
            possible. Follow these simple steps to get the most out of our website.
          </p>
        </section>

        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {!searchQuery && <ProgressStepper currentStep={openStep} onStepClick={handleStepClick} />}

        <section className="mb-12 space-y-5">
          {filteredSteps.length > 0 ? (
            filteredSteps.map((step, index) => (
              <div key={step.id} id={`step-${index}`}>
                <HelpStep 
                  step={step} 
                  index={index}
                  isOpen={openStep === index || searchQuery !== ""}
                  toggleOpen={() => setOpenStep(openStep === index ? -1 : index)}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-amber-200 text-lg">No results found for "{searchQuery}"</p>
              <p className="text-orange-300/80 text-sm mt-2">Try a different search term</p>
            </div>
          )}
        </section>

        <section className="mb-10">
          <div className="flex items-center gap-4 mb-6 justify-center">
            <span className="text-4xl">❓</span>
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 text-2xl md:text-3xl font-bold animate-gradient">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} faq={faq} />
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-2xl p-10 text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <div className="absolute top-4 right-4 text-6xl opacity-10">🎯</div>
          <div className="absolute bottom-4 left-4 text-5xl opacity-10">🚀</div>
          
          <h3 className="relative z-10 text-white text-3xl font-bold mb-3 flex items-center gap-3 justify-center">
            <span>🎉</span>
            Ready to Get Started?
          </h3>
          <p className="relative z-10 text-white/95 mb-8 text-lg">Begin comparing cookware and find your perfect match today!</p>
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <button className="bg-white text-orange-700 px-10 py-4 rounded-full font-bold shadow-xl hover:bg-amber-50 transition-all transform hover:scale-105 hover:shadow-2xl flex items-center gap-2">
                <span>🏠</span>
                Go to Homepage
              </button>
            </Link>
            <Link to="/home">
              <button className="bg-amber-950 text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-amber-900 transition-all transform hover:scale-105 hover:shadow-2xl flex items-center gap-2">
                Start Your Journey
                <span className="text-xl">→</span>
              </button>
            </Link>
          </div>
        </section>
      </div>

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