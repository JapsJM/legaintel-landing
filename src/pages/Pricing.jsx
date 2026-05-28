import { Link } from 'react-router-dom';
import { Check, ShieldCheck, HelpCircle, Lock } from 'lucide-react';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-[#c5a059] selection:text-black scroll-smooth">
      
      {/* Navigation Header */}
      <nav className="border-b border-white/5 bg-[#0a0c10]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Brand Logo with larger, accented AI */}
          <Link to="/" className="flex items-baseline select-none">
            <span className="text-2xl md:text-3xl font-bold font-serif tracking-tight text-white">leg</span>
            <span className="text-3xl md:text-4xl font-black text-[#c5a059] mx-[1px] leading-none">AI</span>
            <span className="text-2xl md:text-3xl font-bold font-serif tracking-tight text-white">ntel</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-colors">
              Back to Landing
            </Link>
            <Link to="/login" className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#b38f48] text-black text-xs md:text-sm font-bold uppercase tracking-widest rounded-sm transition-all shadow-[0_0_15px_rgba(197,160,89,0.15)]">
              Establish Chamber
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-20 w-full">
        
        {/* Header Introduction */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="px-4 py-1.5 border border-[#c5a059]/30 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-[#c5a059] bg-[#c5a059]/5 mb-6 inline-block">
            PREMIUM CHAMBER TIERS
          </span>
          <h1 className="text-4xl md:text-5.5xl font-bold font-serif tracking-tight mb-6">
            Predictable Plans for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c5a059] to-[#e0c286]">Modern Litigation</span>
          </h1>
          <p className="text-base md:text-lg text-slate-200 leading-relaxed">
            All tiers are built on private, tenant-isolated vault systems. Select the analytical scale that matches your chamber's litigation caseload.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-24">
          
          {/* Free Tier Card */}
          <div className="flex flex-col p-10 bg-[#0a0c10] border border-white/5 rounded-sm hover:border-white/10 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
            <div className="mb-8">
              <span className="text-xs font-serif font-bold text-[#c5a059] tracking-widest uppercase block mb-2">Tier 01</span>
              <h2 className="text-xl font-bold uppercase tracking-wider text-white mb-4">Free Chamber</h2>
              <p className="text-sm text-slate-300 min-h-[48px] leading-relaxed">
                For students, legal researchers, and basic litigation exploration.
              </p>
            </div>
            
            <div className="mb-8">
              <span className="text-4xl font-bold font-serif text-white">$0</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-2">Permanent Access</span>
            </div>

            <div className="border-t border-white/5 pt-8 mb-8 flex-grow">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#c5a059] mb-4">Resource Limits & Features</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-slate-200">
                  <Check className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <span>Up to 10 litigation document uploads</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-200">
                  <Check className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <span>50 citation-verified queries / mo</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-200">
                  <Check className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <span>Basic semantic & concept search</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-200">
                  <Check className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <span>Private isolated database vault</span>
                </li>
              </ul>
            </div>

            <Link to="/register" className="w-full text-center py-4 border border-white/10 hover:border-white/20 text-slate-200 hover:text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-all">
              Establish Basic Chamber
            </Link>
          </div>

          {/* Pro Tier Card */}
          <div className="flex flex-col p-10 bg-[#0c0f14] border-2 border-[#c5a059] rounded-sm transition-all shadow-[0_0_30px_rgba(197,160,89,0.08)] relative">
            <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1 bg-[#c5a059] text-black text-[10px] font-extrabold uppercase tracking-widest rounded-sm">
              Most Popular
            </div>

            <div className="mb-8">
              <span className="text-xs font-serif font-bold text-[#c5a059] tracking-widest uppercase block mb-2">Tier 02</span>
              <h2 className="text-xl font-bold uppercase tracking-wider text-white mb-4">Pro Chamber</h2>
              <p className="text-sm text-slate-200 min-h-[48px] leading-relaxed">
                For active independent counsel and dedicated litigation professionals.
              </p>
            </div>
            
            <div className="mb-8">
              <span className="text-5xl font-bold font-serif text-white">$29</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 ml-2">/ month</span>
            </div>

            <div className="border-t border-[#c5a059]/20 pt-8 mb-8 flex-grow">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#c5a059] mb-4">Resource Limits & Features</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-white font-medium">
                  <Check className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <span>Up to 100 litigation document uploads</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white font-medium">
                  <Check className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <span>1,000 multi-agent queries / mo</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white font-medium">
                  <Check className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <span>Full 5-agent pipeline reasoning</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white font-medium">
                  <Check className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <span>Relational legal graph traversal</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white font-medium">
                  <Check className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <span>Scanned PDF OCR (Gemini 2.5)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white font-medium">
                  <Check className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <span>Priority indexing pipelines</span>
                </li>
              </ul>
            </div>

            <Link to="/register" className="w-full text-center py-4 bg-[#c5a059] hover:bg-[#b38f48] text-black text-xs font-bold uppercase tracking-widest rounded-sm transition-all shadow-[0_0_15px_rgba(197,160,89,0.15)]">
              Establish Pro Chamber
            </Link>
          </div>

          {/* Enterprise Tier Card */}
          <div className="flex flex-col p-10 bg-[#0a0c10] border border-white/5 rounded-sm hover:border-white/10 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
            <div className="mb-8">
              <span className="text-xs font-serif font-bold text-[#c5a059] tracking-widest uppercase block mb-2">Tier 03</span>
              <h2 className="text-xl font-bold uppercase tracking-wider text-white mb-4">Enterprise</h2>
              <p className="text-sm text-slate-300 min-h-[48px] leading-relaxed">
                For larger advocacy chambers, multi-attorney practices, and litigation firms.
              </p>
            </div>
            
            <div className="mb-8">
              <span className="text-5xl font-bold font-serif text-white">$99</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-2">/ month</span>
            </div>

            <div className="border-t border-white/5 pt-8 mb-8 flex-grow">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#c5a059] mb-4">Resource Limits & Features</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-slate-200">
                  <Check className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <span className="font-semibold text-white">Unlimited document uploads</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-200">
                  <Check className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <span className="font-semibold text-white">Unlimited queries / month</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-200">
                  <Check className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <span>Jurisdictional filtering (SCI, GHC)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-200">
                  <Check className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <span>Custom agentic prompt overrides</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-200">
                  <Check className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <span>24h Morning Briefing & contradictions</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-200">
                  <Check className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <span>Custom API gateway keys</span>
                </li>
              </ul>
            </div>

            <Link to="/register" className="w-full text-center py-4 border border-white/10 hover:border-white/20 text-slate-200 hover:text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-all">
              Establish Enterprise Chamber
            </Link>
          </div>

        </div>

        {/* Security Info Bar */}
        <div className="bg-[#0a0c10]/40 border border-white/5 rounded-sm p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mb-24 max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <Lock className="w-10 h-10 text-[#c5a059] shrink-0" />
            <div>
              <h4 className="text-base font-bold text-white uppercase tracking-wider mb-1">Corporate & Advocate Secrecy Guarantees</h4>
              <p className="text-sm text-slate-200">No other chamber, administrator, or AI model can access your vault data. Complete tenant cryptographic segregation is enforced.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059] uppercase tracking-wider border border-[#c5a059]/20 px-4 py-2 bg-[#c5a059]/5 shrink-0">
            <ShieldCheck className="w-4 h-4" />
            <span>Audit-Verified Vaults</span>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-center mb-16 text-white">
            Common Inquiries from Counsel
          </h2>
          
          <div className="space-y-8">
            <div className="p-8 border border-white/5 bg-[#0a0c10]/30 rounded-sm">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-[#c5a059] shrink-0" />
                How does LegAIntel guarantee document privacy?
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed pl-8">
                Every client environment is cryptographically partitioned. All stored files, metadata, vector coordinates in ChromaDB, and entity nodes in Neo4j are stored with isolated tenant keys. Cross-tenant leakage is prevented at the database driver level.
              </p>
            </div>

            <div className="p-8 border border-white/5 bg-[#0a0c10]/30 rounded-sm">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-[#c5a059] shrink-0" />
                What is the "Citation Validator" agent?
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed pl-8">
                The Validator is a specialized agent that cross-checks every generated legal finding against the primary documents uploaded within your chamber. If an analytical statement cannot be verified directly in the source texts, the citation fails, preventing hallucinations.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#030406] py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs md:text-sm text-slate-400 font-sans">
          <p>© {new Date().getFullYear()} LegAIntel. All professional rights reserved.</p>
          <p className="uppercase tracking-widest text-xs text-[#c5a059] font-bold">Built for Modern Litigation Intelligence</p>
        </div>
      </footer>

    </div>
  );
}