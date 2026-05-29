import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  FileText, 
  Check, 
  X, 
  Lock, 
  Layers, 
  Database, 
  Activity, 
  Users, 
  FileCheck,
  Landmark
} from 'lucide-react';

// Custom Advocate's Neckband / Collar Tabs Icon (Watermark)
const AdvocateBands = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.25" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Collar neckband structure */}
    <path d="M5 5h14a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
    {/* Left Advocate Tab (Neckband) */}
    <path d="M8 8v10h3.5V8" fill="currentColor" fillOpacity="0.1" />
    {/* Right Advocate Tab (Neckband) */}
    <path d="M12.5 8v10h3.5V8" fill="currentColor" fillOpacity="0.1" />
  </svg>
);

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-[#c5a059] selection:text-black scroll-smooth">
      
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-[#0a0c10]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo with larger, accented AI */}
          <Link to="/" className="flex items-baseline select-none">
            <span className="text-2xl md:text-3xl font-bold font-serif tracking-tight text-white">leg</span>
            <span className="text-3xl md:text-4xl font-black text-[#c5a059] mx-[1px] leading-none">AI</span>
            <span className="text-2xl md:text-3xl font-bold font-serif tracking-tight text-white">ntel</span>
          </Link>

          {/* Navigation Menu (Pricing updated to smooth scroll anchor) */}
          <div className="hidden md:flex items-center gap-10 text-sm font-bold uppercase tracking-widest text-slate-200">
            <a href="#intelligence" className="hover:text-[#c5a059] transition-colors">Intelligence</a>
            <a href="#capabilities" className="hover:text-[#c5a059] transition-colors">Capabilities</a>
            <a href="#chambers" className="hover:text-[#c5a059] transition-colors">Chambers</a>
            <a href="#security" className="hover:text-[#c5a059] transition-colors">Security</a>
            <a href="#alerts" className="hover:text-[#c5a059] transition-colors">Alerts</a>
            <a href="#enterprise" className="hover:text-[#c5a059] transition-colors">Enterprise</a>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-bold uppercase tracking-widest text-slate-200 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#b38f48] text-black text-xs md:text-sm font-bold uppercase tracking-widest rounded-sm transition-all shadow-[0_0_15px_rgba(197,160,89,0.15)]">
              Establish Chamber
            </Link>
          </div>
        </div>
      </nav>

      {/* Beta Disclaimer Banner */}
      <div className="w-full bg-amber-950/40 border-b border-amber-500/20 px-6 py-2.5 text-center">
        <p className="text-xs text-amber-400/90 font-sans tracking-wide">
          <span className="font-bold uppercase tracking-widest mr-2">Beta</span>
          LegAIntel is an experimental legal research platform. AI outputs are for research purposes only and do not constitute legal advice. Always consult a qualified advocate for legal matters.
        </p>
      </div>

      {/* Fixed Left QR Code — xl screens only */}
      <div className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-2">
        <div className="p-2.5 bg-white rounded-xl shadow-[0_0_20px_rgba(197,160,89,0.15)] border border-[#c5a059]/10">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=https://t.me/LegAIntel_bot%3Fstart%3Dsub&color=000000&bgcolor=ffffff&margin=2"
            alt="Scan to open @LegAIntel_bot on Telegram"
            width="110"
            height="110"
            className="block"
          />
        </div>
        <p className="text-[9px] text-slate-500 text-center uppercase tracking-widest font-sans leading-tight">
          Scan for<br/>Judgment Alerts
        </p>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#229ED9" className="opacity-70">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
        </svg>
      </div>

      {/* Hero Section */}
      <header className="max-w-5xl mx-auto px-6 pt-28 pb-24 text-center flex flex-col justify-center items-center relative min-h-[90vh]">
        
        {/* Huge background watermark with 50% opacity and pointer-events disabled */}
        <AdvocateBands className="absolute w-[350px] h-[350px] md:w-[480px] md:h-[480px] text-[#c5a059] opacity-50 -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        {/* Subtle blur behind the symbol */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#c5a059]/5 rounded-full blur-3xl -z-20 pointer-events-none" />
        
        {/* Badge font scaled 2 points */}
        <span className="relative z-10 px-5 py-2 border border-[#c5a059]/30 rounded-full text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-[#c5a059] bg-[#c5a059]/5 mb-8">
          PRIVATE LEGAL INTELLIGENCE INFRASTRUCTURE
        </span>
        
        <h1 className="relative z-10 text-4xl md:text-6.5xl font-bold font-serif tracking-tight text-white max-w-4xl leading-[1.12] mb-8">
          Next-Generation Litigation Intelligence for <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c5a059] to-[#e0c286]">Modern Counsel</span>
        </h1>
        
        {/* Body fonts scaled 2 points, changed to lighter slate for crisp readability */}
        <p className="relative z-10 text-base md:text-lg text-slate-200 max-w-3xl leading-relaxed font-sans mb-5">
          Transform massive litigation records into structured strategic intelligence using multi-agent legal reasoning, relational precedent analysis, knowledge graphs, and citation-verified AI synthesis.
        </p>

        <p className="relative z-10 text-sm md:text-base text-[#c5a059] max-w-2xl leading-relaxed font-sans font-medium mb-12">
          LegAIntel is engineered for advocates, chambers, firms, and institutional litigation teams handling high-stakes legal complexity.
        </p>

        <div className="relative z-10 flex flex-col sm:flex-row gap-5 mb-16">
          <Link to="/register" className="flex items-center justify-center gap-3 px-8 py-4 bg-[#c5a059] hover:bg-[#b38f48] text-black text-sm font-bold uppercase tracking-widest rounded-sm transition-all shadow-[0_0_20px_rgba(197,160,89,0.25)] group">
            Establish Your Chamber
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/login" className="px-8 py-4 border border-white/10 hover:border-white/20 text-slate-200 hover:text-white text-sm font-bold uppercase tracking-widest rounded-sm transition-all">
            Access Secure Portal
          </Link>
        </div>

        {/* Trust Strip text size increased to 12px / xs */}
        <div className="relative z-10 border-t border-b border-white/5 py-4 w-full max-w-4xl flex flex-wrap justify-center items-center gap-x-10 gap-y-3 text-xs uppercase tracking-[0.2em] text-slate-300 font-bold">
          <span>Private</span>
          <span className="text-[#c5a059]">•</span>
          <span>Citation-Grounded</span>
          <span className="text-[#c5a059]">•</span>
          <span>Multi-Agent</span>
          <span className="text-[#c5a059]">•</span>
          <span>Sovereign</span>
          <span className="text-[#c5a059]">•</span>
          <span>Enterprise-Ready</span>
        </div>
      </header>

      {/* Section — The Problem */}
      <section className="border-t border-white/5 bg-[#08090d]/60 py-28 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#c5a059] text-xs font-bold tracking-[0.25em] uppercase">The Paradigm</span>
            <h2 className="text-3xl md:text-4.5xl font-serif font-bold tracking-tight text-white mt-3">
              Modern Litigation Is No Longer Human-Scalable
            </h2>
          </div>

          {/* Grid text scaled up to base with high-contrast text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-slate-200 text-base leading-relaxed mb-16">
            <div className="flex gap-5">
              <span className="text-[#c5a059] text-xl font-serif font-bold">01.</span>
              <p>Critical evidence remains deeply buried across thousands of pages of unindexed files.</p>
            </div>
            <div className="flex gap-5">
              <span className="text-[#c5a059] text-xl font-serif font-bold">02.</span>
              <p>Precedent chains and jurisdictional authority linkages remain fragmented and unmapped.</p>
            </div>
            <div className="flex gap-5">
              <span className="text-[#c5a059] text-xl font-serif font-bold">03.</span>
              <p>Core case strategy frequently depends on manual recall and fragile physical folders.</p>
            </div>
            <div className="flex gap-5">
              <span className="text-[#c5a059] text-xl font-serif font-bold">04.</span>
              <p>Contradictions hide silently inside disconnected pleadings, scanned records, exhibits, and procedural history.</p>
            </div>
          </div>

          <div className="border-t border-white/5 pt-10 text-center">
            <p className="text-lg text-slate-200 font-medium">
              Modern legal practice demands more than document search. <br/>
              <span className="text-[#c5a059] block mt-2 font-serif text-xl">It demands intelligence continuity.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Section — What LegAIntel Is */}
      <section id="intelligence" className="py-28 px-6 max-w-5xl mx-auto">
        <div className="bg-[#0a0c10]/40 border border-[#c5a059]/10 p-12 md:p-20 rounded-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c5a059]/2 rounded-full blur-3xl -z-10" />
          
          <span className="text-[#c5a059] text-xs font-bold tracking-[0.25em] uppercase">Infrastructure Definition</span>
          <h2 className="text-3.5xl font-serif font-bold tracking-tight text-white mt-3 mb-8">
            A Legal Intelligence Operating System
          </h2>

          <div className="space-y-8 text-white text-base md:text-lg leading-relaxed font-sans">
            <p className="font-extrabold text-[#c5a059] text-xl md:text-2xl font-serif">LegAIntel is not a chatbot.</p>
            
            <p>
              It is a sovereign legal intelligence infrastructure that continuously analyzes, connects, validates, and synthesizes litigation ecosystems.
            </p>
            
            <p>
              Every uploaded pleading, judgment, affidavit, exhibit, statute, transcript, scanned record, and legal note becomes part of a structured intelligence chamber designed for strategic legal reasoning.
            </p>
            
            <p>
              The system builds institutional memory for advocates and chambers — preserving relationships, legal context, citation integrity, and litigation knowledge across the entire lifecycle of a matter.
            </p>
          </div>
        </div>
      </section>

      {/* Section — Core Capabilities (Expanded Layout & Crisp White Fonts) */}
      <section id="capabilities" className="border-t border-white/5 bg-[#08090d]/60 py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-[#c5a059] text-xs font-bold tracking-[0.25em] uppercase">System Architecture</span>
            <h2 className="text-3.5xl font-serif font-bold tracking-tight text-white mt-3">
              Built for Real Litigation Complexity
            </h2>
          </div>

          {/* Grid columns with elevated padding & high-contrast text */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-10 bg-[#0a0c10] border border-white/5 rounded-sm hover:border-[#c5a059]/35 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <span className="text-xs font-serif font-extrabold text-[#c5a059] tracking-widest block mb-5">CAPABILITY 01</span>
              <h3 className="text-base md:text-lg font-bold uppercase tracking-wider text-white mb-4">Multi-Agent Legal Reasoning</h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                Five specialized AI agents collaboratively classify, decompose, validate, synthesize, and verify every legal query before generating a response.
              </p>
            </div>

            <div className="p-10 bg-[#0a0c10] border border-white/5 rounded-sm hover:border-[#c5a059]/35 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <span className="text-xs font-serif font-extrabold text-[#c5a059] tracking-widest block mb-5">CAPABILITY 02</span>
              <h3 className="text-base md:text-lg font-bold uppercase tracking-wider text-white mb-4">Relational Precedent Analysis</h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                Identify hidden legal relationships, authority chains, entity connections, procedural dependencies, and cross-document intelligence through integrated legal graph architecture.
              </p>
            </div>

            <div className="p-10 bg-[#0a0c10] border border-white/5 rounded-sm hover:border-[#c5a059]/35 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <span className="text-xs font-serif font-extrabold text-[#c5a059] tracking-widest block mb-5">CAPABILITY 03</span>
              <h3 className="text-base md:text-lg font-bold uppercase tracking-wider text-white mb-4">Citation-Verified Synthesis</h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                Every response is grounded in retrievable evidence with strict citation validation and hallucination-resistant reasoning controls.
              </p>
            </div>

            <div className="p-10 bg-[#0a0c10] border border-white/5 rounded-sm hover:border-[#c5a059]/35 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <span className="text-xs font-serif font-extrabold text-[#c5a059] tracking-widest block mb-5">CAPABILITY 04</span>
              <h3 className="text-base md:text-lg font-bold uppercase tracking-wider text-white mb-4">Scanned Document & Evidence</h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                Extract intelligence from scanned records, images, handwritten annotations, tables, seals, and evidentiary material using advanced vision processing.
              </p>
            </div>

            <div className="p-10 bg-[#0a0c10] border border-white/5 rounded-sm hover:border-[#c5a059]/35 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <span className="text-xs font-serif font-extrabold text-[#c5a059] tracking-widest block mb-5">CAPABILITY 05</span>
              <h3 className="text-base md:text-lg font-bold uppercase tracking-wider text-white mb-4">Chamber Memory System</h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                Build persistent institutional intelligence across matters, arguments, precedents, litigation strategies, and historical case analysis.
              </p>
            </div>

            <div className="p-10 bg-[#0a0c10] border border-white/5 rounded-sm hover:border-[#c5a059]/35 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <span className="text-xs font-serif font-extrabold text-[#c5a059] tracking-widest block mb-5">CAPABILITY 06</span>
              <h3 className="text-base md:text-lg font-bold uppercase tracking-wider text-white mb-4">Private Digital Chambers</h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                Complete tenant-isolated architecture ensures every chamber operates within its own secured legal intelligence environment.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Section — How It Works */}
      <section className="py-28 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-[#c5a059] text-xs font-bold tracking-[0.25em] uppercase">Pipeline Sequence</span>
          <h2 className="text-3.5xl font-serif font-bold tracking-tight text-white mt-3">
            From Documents to Strategic Intelligence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative">
          
          <div className="relative">
            <div className="flex items-center gap-4 mb-5">
              <span className="w-10 h-10 rounded-full border border-[#c5a059]/30 flex items-center justify-center text-sm font-bold font-serif text-[#c5a059] bg-[#c5a059]/5">1</span>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#c5a059]">Ingest</h3>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              Upload pleadings, judgments, statutes, exhibits, evidence files, scanned records, or research archives.
            </p>
          </div>

          <div className="relative">
            <div className="flex items-center gap-4 mb-5">
              <span className="w-10 h-10 rounded-full border border-[#c5a059]/30 flex items-center justify-center text-sm font-bold font-serif text-[#c5a059] bg-[#c5a059]/5">2</span>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#c5a059]">Structure</h3>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              LegAIntel processes, segments, indexes, relates, and validates every document through multi-layer retrieval and graph intelligence systems.
            </p>
          </div>

          <div className="relative">
            <div className="flex items-center gap-4 mb-5">
              <span className="w-10 h-10 rounded-full border border-[#c5a059]/30 flex items-center justify-center text-sm font-bold font-serif text-[#c5a059] bg-[#c5a059]/5">3</span>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#c5a059]">Reason</h3>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              Multi-agent legal reasoning pipelines analyze factual, relational, comparative, and strategic legal queries.
            </p>
          </div>

          <div className="relative">
            <div className="flex items-center gap-4 mb-5">
              <span className="w-10 h-10 rounded-full border border-[#c5a059]/30 flex items-center justify-center text-sm font-bold font-serif text-[#c5a059] bg-[#c5a059]/5">4</span>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#c5a059]">Synthesize</h3>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              Receive structured legal analysis grounded in verifiable evidence, relational context, and citation-safe reasoning.
            </p>
          </div>

        </div>
      </section>

      {/* Section — Differentiator */}
      <section className="border-t border-white/5 bg-[#08090d]/60 py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-[#c5a059] text-xs font-bold tracking-[0.25em] uppercase">Core Separation</span>
            <h2 className="text-3.5xl font-serif font-bold tracking-tight text-white mt-3">
              Beyond Search. Beyond Chat.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Traditional Software */}
            <div className="bg-[#0a0c10]/40 border border-white/5 p-10 rounded-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-8 pb-3 border-b border-white/5">
                Traditional Legal Software
              </h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4 text-sm text-slate-300">
                  <X className="w-5 h-5 text-red-500/80 shrink-0 mt-0.5" />
                  <span>Static lookup and simple keyword-dependent searching</span>
                </li>
                <li className="flex items-start gap-4 text-sm text-slate-300">
                  <X className="w-5 h-5 text-red-500/80 shrink-0 mt-0.5" />
                  <span>Isolated query structures that ignore surrounding context</span>
                </li>
                <li className="flex items-start gap-4 text-sm text-slate-300">
                  <X className="w-5 h-5 text-red-500/80 shrink-0 mt-0.5" />
                  <span>Manual and fragmented precedent tracking processes</span>
                </li>
                <li className="flex items-start gap-4 text-sm text-slate-300">
                  <X className="w-5 h-5 text-red-500/80 shrink-0 mt-0.5" />
                  <span>No capacity to build institutional memory across matters</span>
                </li>
              </ul>
            </div>

            {/* LegAIntel */}
            <div className="bg-[#0a0c10] border border-[#c5a059]/20 p-10 rounded-sm shadow-[0_0_30px_rgba(197,160,89,0.02)]">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#c5a059] mb-8 pb-3 border-b border-[#c5a059]/10">
                LegAIntel Infrastructure
              </h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4 text-sm text-white font-semibold">
                  <Check className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <span>Strategic legal synthesis of entire document ecosystems</span>
                </li>
                <li className="flex items-start gap-4 text-sm text-white font-semibold">
                  <Check className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <span>Multi-agent legal validation and citation cross-auditing</span>
                </li>
                <li className="flex items-start gap-4 text-sm text-white font-semibold">
                  <Check className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <span>Relational reasoning and connection mapping in graph databases</span>
                </li>
                <li className="flex items-start gap-4 text-sm text-white font-semibold">
                  <Check className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <span>Enduring matter intelligence continuity and litigation memory</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>



      {/* Section — Security */}
      <section id="security" className="py-28 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-14 items-center">
          
          <div className="md:col-span-5">
            <span className="text-[#c5a059] text-xs font-bold tracking-[0.25em] uppercase">Confidentiality Gate</span>
            <h2 className="text-3.5xl font-serif font-bold tracking-tight text-white mt-3 mb-8">
              Engineered for Legal Confidentiality
            </h2>
            <p className="text-sm md:text-base text-slate-200 leading-relaxed mb-8 font-sans">
              LegAIntel is designed with sovereign isolation architecture for legal professionals handling confidential litigation data.
            </p>
            <div className="flex items-center gap-3 text-xs uppercase tracking-widest font-bold text-[#c5a059]">
              <Lock className="w-5 h-5" />
              <span>SECURED VAULT TECHNOLOGY</span>
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-6 border border-white/5 bg-[#0a0c10]/40 rounded-sm">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Isolated Chambers</h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">Cryptographically separate datastores with zero leakage risks.</p>
            </div>
            <div className="p-6 border border-white/5 bg-[#0a0c10]/40 rounded-sm">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Access Controls</h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">Hierarchical role assignment to secure internal workspaces.</p>
            </div>
            <div className="p-6 border border-white/5 bg-[#0a0c10]/40 rounded-sm">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Citation Verification</h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">No external hallucinated elements can bypass the validator.</p>
            </div>
            <div className="p-6 border border-white/5 bg-[#0a0c10]/40 rounded-sm">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Secure Lineage</h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">Audit trailing on all updates, edits, and file version changes.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Section — Enterprise */}
      <section id="enterprise" className="border-t border-white/5 bg-[#08090d]/60 py-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[#c5a059] text-xs font-bold tracking-[0.25em] uppercase">User Alignment</span>
          <h2 className="text-3.5xl font-serif font-bold tracking-tight text-white mt-3 mb-8">
            Built for the Future of Legal Practice
          </h2>
          <p className="text-sm md:text-base text-slate-200 leading-relaxed max-w-2xl mx-auto mb-12">
            Whether managing a single constitutional matter or thousands of litigation records, LegAIntel scales into a continuously evolving legal intelligence environment.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-xs sm:text-sm font-semibold text-slate-200">
            <span className="px-5 py-2.5 border border-white/5 bg-[#0a0c10] rounded-sm">Senior Advocates</span>
            <span className="px-5 py-2.5 border border-white/5 bg-[#0a0c10] rounded-sm">Litigation Chambers</span>
            <span className="px-5 py-2.5 border border-white/5 bg-[#0a0c10] rounded-sm">Law Firms</span>
            <span className="px-5 py-2.5 border border-white/5 bg-[#0a0c10] rounded-sm">Research Institutions</span>
            <span className="px-5 py-2.5 border border-white/5 bg-[#0a0c10] rounded-sm">Corporate Legal Teams</span>
            <span className="px-5 py-2.5 border border-white/5 bg-[#0a0c10] rounded-sm">Judicial Workflows</span>
          </div>
        </div>
      </section>

      {/* Free Telegram Precedent Alerts Section */}
      <section id="alerts" className="border-t border-white/5 py-28 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#c5a059]/3 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">

          {/* Left — Text */}
          <div className="flex-1 text-left">
            <span className="text-[#c5a059] text-xs font-bold tracking-[0.25em] uppercase">Free · No Account Required</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-white mt-4 mb-5">
              Real-Time Judgment Alerts<br />on Telegram
            </h2>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-4 max-w-lg">
              Get instant 4-line micro-summaries of Supreme Court and High Court judgments delivered directly to your Telegram — free, no signup needed.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed mb-8 max-w-lg">
              Each alert includes the case title, court &amp; date, key holding, and a link to the full analysis. Pro subscribers receive additional filtered alerts by court and practice area.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a
                href="https://t.me/LegAIntel_bot?start=sub"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#229ED9] hover:bg-[#1a8fc7] text-white text-sm font-bold uppercase tracking-widest rounded-sm transition-all shadow-[0_0_20px_rgba(34,158,217,0.2)]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
                </svg>
                Subscribe on Telegram
              </a>
              <span className="text-xs text-slate-500 font-sans">or scan the QR code →</span>
            </div>
          </div>

          {/* Right — QR Code */}
          <div className="flex flex-col items-center gap-4 shrink-0">
            <div className="p-4 bg-white rounded-xl shadow-[0_0_30px_rgba(197,160,89,0.1)]">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://t.me/LegAIntel_bot%3Fstart%3Dsub&color=000000&bgcolor=ffffff&margin=2"
                alt="Scan to open @LegAIntel_bot on Telegram"
                width="160"
                height="160"
                className="block"
              />
            </div>
            <p className="text-xs text-slate-500 text-center font-sans">Scan to open<br/>@LegAIntel_bot</p>
          </div>

        </div>
      </section>

      {/* Final CTA Section */}
      <section id="chambers" className="border-t border-white/5 py-36 px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#c5a059]/2 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="max-w-3xl mx-auto">
          <span className="text-[#c5a059] text-xs font-bold tracking-[0.25em] uppercase">Instant Mobilization</span>
          <h2 className="text-4.5xl font-serif font-bold tracking-tight text-white mt-4 mb-8">
            Build Your Legal Intelligence Chamber
          </h2>
          <p className="text-base text-slate-200 leading-relaxed mb-12 max-w-xl mx-auto">
            Replace fragmented legal workflows with a continuously evolving litigation intelligence system designed for modern counsel.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link to="/register" className="px-10 py-5 bg-[#c5a059] hover:bg-[#b38f48] text-black text-sm font-bold uppercase tracking-widest rounded-sm transition-all shadow-[0_0_20px_rgba(197,160,89,0.25)]">
              Establish Your Chamber
            </Link>
            <Link to="/login" className="px-10 py-5 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-sm font-bold uppercase tracking-widest rounded-sm transition-all">
              Request Enterprise Access
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#030406] py-20 px-6 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-14 pb-14 border-b border-white/5">
          
          <div className="space-y-5 max-w-sm">
            <Link to="/" className="flex items-baseline select-none">
              <span className="text-2xl font-bold font-serif tracking-tight text-white">leg</span>
              <span className="text-3xl font-black text-[#c5a059] mx-[1px] leading-none">AI</span>
              <span className="text-2xl font-bold font-serif tracking-tight text-white">ntel</span>
            </Link>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Sovereign Legal Intelligence Infrastructure. Built for high-stakes litigation analysis, relational precedent discovery, and private chamber knowledge continuity.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 text-xs md:text-sm font-bold uppercase tracking-widest">
            <div className="flex flex-col gap-4">
              <span className="text-[#c5a059] text-xs tracking-[0.2em] font-extrabold block mb-1">Platform</span>
              <a href="#intelligence" className="text-slate-400 hover:text-white transition-colors">Intelligence</a>
              <a href="#capabilities" className="text-slate-400 hover:text-white transition-colors">Capabilities</a>
              <a href="#chambers" className="text-slate-400 hover:text-white transition-colors">Chambers</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[#c5a059] text-xs tracking-[0.2em] font-extrabold block mb-1">Security</span>
              <a href="#security" className="text-slate-400 hover:text-white transition-colors">Architecture</a>
              <a href="#security" className="text-slate-400 hover:text-white transition-colors">Vault Tech</a>
              <a href="#security" className="text-slate-400 hover:text-white transition-colors">Isolation</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[#c5a059] text-xs tracking-[0.2em] font-extrabold block mb-1">Resources</span>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Documentation</a>
              <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-10 flex flex-col sm:flex-row justify-between items-center gap-5 text-xs md:text-sm text-slate-400 font-sans">
          <p>© {new Date().getFullYear()} LegAIntel. All professional rights reserved.</p>
          <p className="uppercase tracking-widest text-xs text-[#c5a059] font-bold">Built for Modern Litigation Intelligence</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <span className="text-slate-800">•</span>
            <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}