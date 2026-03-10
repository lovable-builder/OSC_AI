import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function AnimatedHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-orange-500/10">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/50 group-hover:shadow-orange-500/80 transition-all duration-300">
            <span className="text-white font-bold text-lg">⚡</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight">ETC Bridge</h1>
            <p className="text-xs text-orange-400/80">AI Lighting Control</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Features", href: "#features" },
            { label: "Guide", href: "#guide" },
            { label: "Console", href: "#console" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-slate-300 hover:text-orange-400 font-medium transition-colors duration-200 relative group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <button className="hidden md:block px-6 py-2 rounded-lg font-semibold text-white transition-all duration-300 relative group overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #FF6B2B 0%, #FF8C42 100%)',
          }}>
          <span className="relative z-10">Launch Console</span>
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-slate-900/50 rounded-lg transition-colors duration-200"
        >
          {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-orange-500/10">
          <div className="px-4 py-4 space-y-4">
            {[
              { label: "Features", href: "#features" },
              { label: "Guide", href: "#guide" },
              { label: "Console", href: "#console" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block text-slate-300 hover:text-orange-400 font-medium py-2 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <button className="w-full mt-4 px-6 py-2 rounded-lg font-semibold text-white transition-all duration-300" style={{
              background: 'linear-gradient(135deg, #FF6B2B 0%, #FF8C42 100%)',
            }}>
              Launch Console
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
