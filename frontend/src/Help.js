import React, { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import logo from "./Assets/logo.png";

// Step icons (using emoji as placeholders - replace with actual icons/images)
const stepIcons = {
  start: "🚀",
  filter: "🔍",
  compare: "⚖️",
  insights: "💡",
  choice: "✅"
};

// Help steps data structure
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
    tips: ["Compare up to 4 products at once", "Visual highlights show the winner"],
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

// FAQ data
const faqs = [
  {
    question: "How many products can I compare at once?",
    answer: "You can compare up to 4 products side-by-side for the best viewing experience."
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

// Step Component
const HelpStep = memo(({ step, index, isOpen, toggleOpen }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100 * index);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div 
      className={`bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden transition-all duration-500 transform border border-slate-700/50 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${isOpen ? 'ring-2 ring-emerald-500/50' : ''}`}
    >
      {/* Step Header */}
      <button
        onClick={toggleOpen}
        className="w-full flex items-center gap-4 p-6 hover:bg-slate-700/30 transition-colors text-left"
      >
        {/* Step Number Circle */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
          {step.id}
        </div>
        
        {/* Icon */}
        <div className="text-4xl">{step.icon}</div>
        
        {/* Title & Description */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-100 mb-1">{step.title}</h3>
          <p className="text-sm text-slate-400">{step.shortDesc}</p>
        </div>
        
        {/* Expand Icon */}
        <div className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </div>
      </button>

      {/* Step Content (Collapsible) */}
      {isOpen && (
        <div className="px-6 pb-6 space-y-4 animate-slide-down">
          <p className="text-slate-300 leading-relaxed">{step.content}</p>
          
          {/* Bullet Points */}
          {step.bulletPoints && (
            <ul className="space-y-2 bg-slate-900/40 rounded-lg p-4 border border-slate-700/30">
              {step.bulletPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300">
                  <span className="text-emerald-400 mt-1">●</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
          
          {/* Tips */}
          {step.tips && (
            <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border-l-4 border-emerald-500 rounded-lg p-4">
              <p className="font-semibold text-emerald-300 mb-2 flex items-center gap-2">
                💡 Pro Tips:
              </p>
              <ul className="space-y-1 text-sm text-emerald-200">
                {step.tips.map((tip, idx) => (
                  <li key={idx}>• {tip}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Action Button */}
          {step.linkTo && (
            <Link to={step.linkTo}>
              <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:from-emerald-500 hover:to-teal-500 transition-all transform hover:scale-105">
                Try it now →
              </button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
});

// Progress Stepper
const ProgressStepper = memo(({ currentStep, onStepClick }) => (
  <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-8 border border-slate-700/50">
    <div className="flex items-center justify-between">
      {helpSteps.map((step, index) => (
        <React.Fragment key={step.id}>
          <button
            onClick={() => onStepClick(index)}
            className={`flex flex-col items-center gap-2 transition-all ${
              currentStep === index ? 'scale-110' : 'opacity-60 hover:opacity-100'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all ${
              currentStep === index 
                ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg' 
                : 'bg-slate-700'
            }`}>
              {step.icon}
            </div>
            <span className="text-xs font-medium text-slate-300 text-center hidden md:block">{step.title}</span>
          </button>
          {index < helpSteps.length - 1 && (
            <div className={`flex-1 h-1 mx-2 rounded transition-all ${
              currentStep > index ? 'bg-emerald-500' : 'bg-slate-700'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
));

// FAQ Component
const FAQItem = memo(({ faq, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-slate-800/60 backdrop-blur-md rounded-lg shadow hover:shadow-lg transition-all border border-slate-700/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/30 transition-colors"
      >
        <span className="font-semibold text-slate-200">{faq.question}</span>
        <span className={`text-emerald-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-slate-300 animate-slide-down">
          {faq.answer}
        </div>
      )}
    </div>
  );
});

// Search Bar
const SearchBar = memo(({ searchQuery, setSearchQuery }) => (
  <div className="mb-8">
    <div className="relative">
      <input
        type="text"
        placeholder="Search help topics... (e.g., 'filter', 'compare', 'price')"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-6 py-4 pr-12 rounded-full border-2 border-slate-700/50 bg-slate-800/60 backdrop-blur-md focus:border-emerald-500 focus:outline-none text-slate-200 shadow-sm placeholder-slate-500"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">🔍</span>
    </div>
  </div>
));

export default function Help() {
  const [openStep, setOpenStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter steps based on search
  const filteredSteps = helpSteps.filter(step =>
    step.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    step.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    step.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStepClick = (index) => {
    setOpenStep(index);
    // Scroll to step
    const element = document.getElementById(`step-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center font-sans p-4 md:p-8 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <style>{`
        @keyframes slide-down {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 2000px; }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>

      {/* Main card - glassmorphism style */}
      <div className="relative w-full max-w-[1200px] bg-white/5 backdrop-blur-xl rounded-[30px] md:rounded-[50px] shadow-2xl p-6 md:p-16 border border-white/10 z-10">
        {/* Header with logo and navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-8 gap-4">
          <img src={logo} alt="Cookware Matrix logo" className="w-16 h-16 drop-shadow-2xl" />
          
          <nav className="flex gap-4 md:gap-8 text-slate-300 text-sm md:text-base font-medium">
            <Link to="/home" className="hover:text-emerald-400 transition-all hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">Home</Link>
            <Link to="/about" className="hover:text-emerald-400 transition-all hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">About</Link>
            <Link to="/help" className="hover:text-emerald-400 transition-all hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">Help</Link>
          </nav>
        </div>

        {/* Main Heading */}
        <section className="mb-10 text-center md:text-left">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-3xl md:text-4xl font-bold mb-6">
            How to Use Cookware Matrix
          </h1>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-3xl">
            Welcome to the Help page! Our goal is to make your search for the perfect cookware as easy as 
            possible. Follow these simple steps to get the most out of our website.
          </p>
        </section>

        {/* Search Bar */}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Progress Stepper */}
        {!searchQuery && <ProgressStepper currentStep={openStep} onStepClick={handleStepClick} />}

        {/* Steps */}
        <section className="mb-12 space-y-4">
          {filteredSteps.map((step, index) => (
            <div key={step.id} id={`step-${index}`}>
              <HelpStep 
                step={step} 
                index={index}
                isOpen={openStep === index || searchQuery !== ""}
                toggleOpen={() => setOpenStep(openStep === index ? -1 : index)}
              />
            </div>
          ))}
        </section>

        {/* FAQ Section */}
        <section className="mb-8">
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-2xl md:text-3xl font-bold mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <FAQItem key={index} faq={faq} index={index} />
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-center shadow-2xl">
          <h3 className="text-white text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-white/90 mb-6">Begin comparing cookware and find your perfect match today!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <button className="bg-white text-emerald-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-slate-100 transition-all transform hover:scale-105">
                Go to Homepage
              </button>
            </Link>
            <Link to="/home">
              <button className="bg-slate-800 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-slate-900 transition-all transform hover:scale-105">
                Start Your Journey
              </button>
            </Link>
          </div>
        </section>
      </div>

      {/* Floating Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white w-14 h-14 rounded-full shadow-2xl hover:from-emerald-500 hover:to-teal-500 transition-all transform hover:scale-110 flex items-center justify-center text-2xl z-50"
        title="Back to top"
      >
        ↑
      </button>
    </div>
  );
}