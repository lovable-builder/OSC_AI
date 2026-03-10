import { useState, useEffect } from "react";

export default function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black pt-20">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-600/40 to-transparent rounded-full blur-3xl animate-pulse" style={{
          animation: 'float 8s ease-in-out infinite',
        }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-blue-600/40 to-transparent rounded-full blur-3xl" style={{
          animation: 'float 10s ease-in-out infinite 2s',
        }} />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-l from-purple-600/30 to-transparent rounded-full blur-3xl" style={{
          animation: 'float 12s ease-in-out infinite 4s',
        }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
      </div>

      {/* Parallax mouse gradient */}
      <div
        className="absolute pointer-events-none opacity-30"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255,107,43,0.3) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          transition: 'all 0.1s ease-out',
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center py-20">
        {/* Badge */}
        <div className="mb-8 animate-fadeInDown" style={{
          animation: 'fadeInDown 0.8s ease-out 0.2s both',
        }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-950/20 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-sm font-medium text-orange-300">Light Automation Reimagined</span>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="mb-6 text-center" style={{
          animation: 'fadeInUp 1s ease-out 0.4s both',
        }}>
          <span className="block text-5xl sm:text-7xl font-bold tracking-tight">
            <span className="text-white">Control Your</span>
            {" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-red-600">
                Lighting
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-orange-500 to-red-600 blur-2xl opacity-30" />
            </span>
            {" "}
            <span className="text-white">with AI</span>
          </span>
        </h1>

        {/* Subheading */}
        <p className="mb-12 max-w-2xl text-center text-lg sm:text-xl text-slate-300" style={{
          animation: 'fadeInUp 1s ease-out 0.6s both',
        }}>
          Voice-controlled fixture patching, real-time cue management, and AI-powered console navigation for professional lighting technicians.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16" style={{
          animation: 'fadeInUp 1s ease-out 0.8s both',
        }}>
          <button
            onClick={onGetStarted}
            className="group relative px-8 py-4 rounded-lg font-semibold text-lg text-black transition-all duration-300 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #FF6B2B 0%, #FF8C42 100%)',
              boxShadow: '0 0 30px rgba(255, 107, 43, 0.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 50px rgba(255, 107, 43, 0.7), 0 0 80px rgba(255, 107, 43, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 107, 43, 0.4)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Started
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>

          <button
            className="px-8 py-4 rounded-lg font-semibold text-lg text-orange-400 border-2 border-orange-500/50 hover:border-orange-400 hover:bg-orange-950/30 transition-all duration-300 backdrop-blur-sm"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Learn More
          </button>
        </div>

        {/* Floating cards showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl" style={{
          animation: 'fadeInUp 1s ease-out 1s both',
        }}>
          {[
            { icon: "🎤", label: "Voice Control", desc: "AI-powered commands" },
            { icon: "⚡", label: "Real-time Patching", desc: "Instant fixture setup" },
            { icon: "🎨", label: "Smart Presets", desc: "Save & recall rigs" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group p-4 rounded-lg border border-orange-500/20 bg-gradient-to-br from-slate-900/50 to-slate-950/50 backdrop-blur-xl hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20"
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <h3 className="font-semibold text-white mb-1">{item.label}</h3>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
      `}</style>
    </section>
  );
}
