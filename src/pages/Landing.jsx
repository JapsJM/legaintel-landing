import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  X,
  Lock,
  Shield,
  Globe,
  Layers,
  Database,
  Scale,
  Building2,
  BookOpen,
  Landmark,
  ChevronRight,
  Network,
  FileText,
  Cpu,
  Activity
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col selection:bg-[#c5a059] selection:text-black scroll-smooth" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>

      {/* ── NAVIGATION ── */}
      <nav className="border-b border-white/5 bg-[#050507]/95 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          <Link to="/" className="flex items-baseline select-none gap-[1px]">
            <span className="text-2xl md:text-3xl font-bold tracking-tight text-white" style={{ fontFamily: 'Georgia, serif' }}>leg</span>
            <span className="text-3xl md:text-4xl font-black text-[#c5a059] leading-none" style={{ fontFamily: 'Georgia, serif' }}>AI</span>
            <span className="text-2xl md:text-3xl font-bold tracking-tight text-white" style={{ fontFamily: 'Georgia, serif' }}>ntel</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
            <a href="#infrastructure" className="text-slate-400 hover:text-[#c5a059] transition-colors">Infrastructure</a>
            <a href="#architecture" className="text-slate-400 hover:text-[#c5a059] transition-colors">Architecture</a>
            <a href="#domains" className="text-slate-400 hover:text-[#c5a059] transition-colors">Domains</a>
            <a href="#aetherius" className="text-slate-400 hover:text-[#c5a059] transition-colors">Aetherius</a>
            <a href="#governance" className="text-slate-400 hover:text-[#c5a059] transition-colors">Governance</a>
            <a href="#vision" className="text-slate-400 hover:text-[#c5a059] transition-colors">Vision</a>
          </div>

          <div className="flex items-center gap-5">
            <Link to="/login" className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
              Sign In
            </Link>
            <Link to="/register" className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#b38f48] text-black text-[11px] font-bold uppercase tracking-[0.2em] transition-all" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
              Request Access
            </Link>
          </div>
        </div>
      </nav>

      {/* ── PRIVATE ACCESS BANNER ── */}
      <div className="w-full bg-[#0d0e12] border-b border-[#c5a059]/15 px-6 py-3 text-center">
        <p className="text-[11px] text-slate-400 tracking-wide" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
          <span className="font-bold uppercase tracking-[0.2em] text-[#c5a059] mr-3">Private Access Preview</span>
          LegAIntel is currently available through controlled access while the platform expands its legal intelligence infrastructure and governance capabilities.
        </p>
      </div>

      {/* ── FIXED LEFT QR ── */}
      <div className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-2">
        <div className="p-2.5 bg-white rounded-sm border border-[#c5a059]/10">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://t.me/LegAIntel_bot%3Fstart%3Dsub&color=000000&bgcolor=ffffff&margin=2"
            alt="Scan to open @LegAIntel_bot"
            width="100" height="100"
            className="block"
          />
        </div>
        <p className="text-[9px] text-slate-600 text-center uppercase tracking-widest leading-tight" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
          Intelligence<br/>Alerts
        </p>
      </div>

      {/* ════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════ */}
      <header className="relative min-h-screen flex flex-col justify-center items-center px-6 py-32 overflow-hidden">

        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(197,160,89,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(197,160,89,0.6) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />

        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(197,160,89,0.04) 0%, transparent 70%)' }} />

        {/* Horizontal rule top */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c5a059]/20 to-transparent" />

        <div className="relative z-10 text-center max-w-6xl mx-auto">

          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-[1px] w-16 bg-[#c5a059]/40" />
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#c5a059]" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
              Legal Intelligence Infrastructure · India
            </span>
            <div className="h-[1px] w-16 bg-[#c5a059]/40" />
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 leading-[0.95]" style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.02em' }}>
            The Legal Intelligence<br />
            <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(197,160,89,0.7)' }}>Infrastructure</span>
            <span className="text-[#c5a059]"> of India</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-5" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 300 }}>
            A unified intelligence layer connecting legal knowledge, legal reasoning, legal drafting,
            legal governance, and institutional memory across every domain of law.
          </p>

          {/* Trust strip */}
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mb-14 text-[11px] uppercase tracking-[0.25em] text-slate-500 font-bold" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
            <span>Advocates</span><span className="text-[#c5a059]/50">•</span>
            <span>Law Firms</span><span className="text-[#c5a059]/50">•</span>
            <span>Enterprises</span><span className="text-[#c5a059]/50">•</span>
            <span>Institutions</span><span className="text-[#c5a059]/50">•</span>
            <span>Government Agencies</span><span className="text-[#c5a059]/50">•</span>
            <span>Judicial Ecosystems</span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-[#c5a059] hover:bg-[#b38f48] text-black text-[12px] font-bold uppercase tracking-[0.2em] transition-all group"
              style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
              Request Access
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="#architecture"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 border border-white/10 hover:border-[#c5a059]/30 text-slate-300 hover:text-white text-[12px] font-bold uppercase tracking-[0.2em] transition-all"
              style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
              Explore Architecture
            </a>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </header>

      {/* ════════════════════════════════════════════
          1. LEGAL INTELLIGENCE CRISIS
      ════════════════════════════════════════════ */}
      <section id="infrastructure" className="py-32 px-6 bg-[#080910]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c5a059]" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>01 — The Intelligence Crisis</span>
              <div className="flex-1 h-[1px] bg-white/5" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              India's Legal System Operates<br />Without a Unified Intelligence Layer
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {[
              { n: "01", t: "Institutional Memory Does Not Persist", d: "Legal knowledge accumulated over decades exists in physical folders, individual memories, and disconnected systems. When counsel transitions, the intelligence is lost." },
              { n: "02", t: "Precedent Is Unmapped at Scale", d: "Thousands of daily judgments across 25 High Courts and the Supreme Court remain unconnected. Authoritative relationships between cases are invisible to practitioners." },
              { n: "03", t: "Legal Reasoning Cannot Be Verified", d: "There is no infrastructure to validate legal arguments against the full corpus of applicable law, regulation, and judicial precedent in real time." },
              { n: "04", t: "Governance Has No Intelligence Foundation", d: "Policy formation, regulatory compliance, and institutional legal decision-making operate without access to unified legal intelligence infrastructure." },
            ].map(({ n, t, d }) => (
              <div key={n} className="p-10 border border-white/5 hover:border-[#c5a059]/20 transition-colors bg-[#050507] group">
                <div className="flex items-start gap-6">
                  <span className="text-4xl font-bold text-[#c5a059]/20 leading-none shrink-0 group-hover:text-[#c5a059]/40 transition-colors" style={{ fontFamily: 'Georgia, serif' }}>{n}</span>
                  <div>
                    <h3 className="text-base font-bold text-white uppercase tracking-wide mb-3" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>{t}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>{d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-1 p-10 border border-[#c5a059]/15 bg-[#0d0e12]">
            <p className="text-xl text-slate-200 leading-relaxed text-center" style={{ fontFamily: 'Georgia, serif' }}>
              The legal system does not need another search tool.<br />
              <span className="text-[#c5a059]">It needs intelligence infrastructure.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          2. INFRASTRUCTURE DEFINITION
      ════════════════════════════════════════════ */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c5a059]" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>02 — Infrastructure Definition</span>
            <div className="flex-1 h-[1px] bg-white/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-14 items-start">
            <div className="md:col-span-5">
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-8" style={{ fontFamily: 'Georgia, serif' }}>
                LegAIntel is not a product.<br />
                <span className="text-[#c5a059]">It is infrastructure.</span>
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
                Infrastructure is not a feature. Infrastructure is the foundation on which other capabilities, institutions, and systems are built. LegAIntel is designed to operate at that foundational level — connecting every domain of law, every institution, and every practitioner within a single unified intelligence architecture.
              </p>
            </div>

            <div className="md:col-span-7 space-y-1">
              {[
                { label: "NOT", items: ["A legal chatbot", "A legal research search engine", "A document management system", "A litigation assistant", "A law firm software product"] },
                { label: "IS", items: ["National-scale legal intelligence infrastructure", "Unified legal knowledge and reasoning layer", "Institutional memory architecture", "Legal governance intelligence foundation", "Cross-domain legal intelligence platform"] },
              ].map(({ label, items }) => (
                <div key={label} className={`p-8 border ${label === 'IS' ? 'border-[#c5a059]/20 bg-[#0d0e12]' : 'border-white/5 bg-[#080910]'}`}>
                  <span className={`text-[10px] font-bold uppercase tracking-[0.3em] block mb-5 ${label === 'IS' ? 'text-[#c5a059]' : 'text-slate-600'}`} style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
                    LegAIntel {label === 'IS' ? 'IS' : 'IS NOT'}
                  </span>
                  <div className="space-y-3">
                    {items.map(item => (
                      <div key={item} className="flex items-center gap-3">
                        {label === 'IS'
                          ? <Check className="w-4 h-4 text-[#c5a059] shrink-0" />
                          : <X className="w-4 h-4 text-slate-700 shrink-0" />
                        }
                        <span className={`text-sm ${label === 'IS' ? 'text-white font-medium' : 'text-slate-600'}`} style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          3. FOUR INFRASTRUCTURE LAYERS
      ════════════════════════════════════════════ */}
      <section id="architecture" className="py-32 px-6 bg-[#080910]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c5a059]" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>03 — Infrastructure Layers</span>
            <div className="flex-1 h-[1px] bg-white/5" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Four Layers. One Unified Infrastructure.
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mb-16 leading-relaxed" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
            LegAIntel is designed as a four-layer intelligence stack. Each layer is independently powerful. Together, they form the complete infrastructure for legal intelligence at national scale.
          </p>

          <div className="space-y-1">
            {[
              {
                n: "Layer I",
                icon: <Database className="w-5 h-5" />,
                title: "Legal Knowledge Infrastructure",
                subtitle: "The foundational corpus",
                desc: "A continuously expanding, structured repository of statutes, regulations, notifications, circulars, judicial precedents, and authoritative legal texts across all domains of Indian law. Organized relationally — not as documents, but as interconnected legal knowledge."
              },
              {
                n: "Layer II",
                icon: <Cpu className="w-5 h-5" />,
                title: "Legal Reasoning Infrastructure",
                subtitle: "The intelligence engine",
                desc: "Multi-agent reasoning architecture capable of decomposing legal questions, identifying applicable law, mapping precedent relationships, validating legal arguments, and generating citation-grounded analysis across any domain of law."
              },
              {
                n: "Layer III",
                icon: <FileText className="w-5 h-5" />,
                title: "Legal Drafting Infrastructure",
                subtitle: "The document layer",
                desc: "Structured drafting capabilities for contracts, pleadings, opinions, regulatory submissions, policy documents, and institutional instruments — grounded in verified legal knowledge and jurisdictional accuracy."
              },
              {
                n: "Layer IV",
                icon: <Network className="w-5 h-5" />,
                title: "Legal Governance & Institutional Memory",
                subtitle: "The continuity layer",
                desc: "Persistent intelligence architecture for institutions, law firms, regulatory bodies, and government agencies. Legal decisions, arguments, precedents, and institutional knowledge are preserved, connected, and made continuously accessible."
              }
            ].map(({ n, icon, title, subtitle, desc }, i) => (
              <div key={n} className="flex gap-0 group">
                {/* Left — number + line */}
                <div className="w-20 shrink-0 flex flex-col items-center pt-10">
                  <span className="text-[11px] font-bold tracking-[0.2em] text-[#c5a059]/50 mb-3 rotate-[-90deg] whitespace-nowrap" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>{n}</span>
                  {i < 3 && <div className="flex-1 w-[1px] bg-white/5 mt-2" />}
                </div>
                {/* Right — card */}
                <div className="flex-1 p-10 border border-white/5 hover:border-[#c5a059]/25 transition-all bg-[#050507] mb-1">
                  <div className="flex items-start gap-5">
                    <div className="text-[#c5a059]/60 shrink-0 mt-1 group-hover:text-[#c5a059] transition-colors">{icon}</div>
                    <div>
                      <div className="flex items-baseline gap-4 mb-1 flex-wrap">
                        <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>{title}</h3>
                        <span className="text-[11px] uppercase tracking-[0.2em] text-slate-600" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>{subtitle}</span>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed max-w-3xl" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>{desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          4. DOMAINS OF LAW
      ════════════════════════════════════════════ */}
      <section id="domains" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c5a059]" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>04 — Domains of Law</span>
            <div className="flex-1 h-[1px] bg-white/5" />
          </div>
          <div className="grid md:grid-cols-2 gap-14 mb-16 items-end">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                Spanning Every<br />Domain of Indian Law
              </h2>
            </div>
            <div>
              <p className="text-sm text-slate-400 leading-relaxed" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
                LegAIntel's intelligence infrastructure operates across the complete spectrum of Indian law. A practitioner in any legal domain accesses the same depth of knowledge, reasoning, and precedent connectivity.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
            {[
              { d: "Constitutional Law", n: "01" },
              { d: "Civil Law", n: "02" },
              { d: "Criminal Law", n: "03" },
              { d: "Corporate Law", n: "04" },
              { d: "Taxation", n: "05" },
              { d: "Revenue Law", n: "06" },
              { d: "Labour & Employment", n: "07" },
              { d: "Environmental Law", n: "08" },
              { d: "Intellectual Property", n: "09" },
              { d: "Arbitration", n: "10" },
              { d: "Regulatory & Compliance", n: "11" },
              { d: "Public Administration", n: "12" },
            ].map(({ d, n }) => (
              <div key={n} className="p-6 border border-white/5 hover:border-[#c5a059]/30 bg-[#080910] hover:bg-[#0d0e12] transition-all group cursor-default">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#c5a059]/40 block mb-3 group-hover:text-[#c5a059]/70 transition-colors" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>{n}</span>
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors leading-tight block" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>{d}</span>
              </div>
            ))}
          </div>

          <div className="mt-1 p-8 border border-white/5 bg-[#080910] text-center">
            <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
              Additional domains including Family Law, Media & Entertainment, Space & Technology, and Cross-border Transactions — in active development
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          5. AETHERIUS INTELLIGENCE ARCHITECTURE
      ════════════════════════════════════════════ */}
      <section id="aetherius" className="py-32 px-6 bg-[#080910] relative overflow-hidden">
        {/* Architectural lines */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'linear-gradient(rgba(197,160,89,1) 1px, transparent 1px)',
          backgroundSize: '100% 60px'
        }} />
        <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#c5a059]/10 to-transparent" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c5a059]" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>05 — Intelligence Architecture</span>
            <div className="flex-1 h-[1px] bg-white/5" />
          </div>

          <div className="grid md:grid-cols-12 gap-14">
            <div className="md:col-span-5">
              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-[#c5a059]" style={{ fontFamily: 'Georgia, serif' }}>Aetherius</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                  The Reasoning Infrastructure Powering LegAIntel
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed mb-8" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
                  Aetherius is the proprietary intelligence architecture underlying the LegAIntel platform. It is not visible to end users. It operates as the core reasoning engine — orchestrating legal analysis, validating citations, mapping precedent relationships, and maintaining institutional memory across all four infrastructure layers.
                </p>
                <div className="p-5 border border-[#c5a059]/20 bg-[#050507]">
                  <p className="text-sm text-[#c5a059] font-medium leading-relaxed" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                    "Aetherius Intelligence Architecture — The reasoning infrastructure powering LegAIntel."
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="space-y-1">
                {[
                  { label: "Decomposition Engine", desc: "Legal queries are decomposed into structured constitutional, statutory, regulatory, and precedential components before analysis begins." },
                  { label: "Multi-Agent Validation", desc: "Parallel intelligence agents cross-validate legal arguments, citation chains, and jurisdictional applicability simultaneously." },
                  { label: "Precedent Graph Architecture", desc: "Judicial authorities are mapped as relational nodes — enabling discovery of citation relationships invisible to keyword-based systems." },
                  { label: "Institutional Memory Layer", desc: "Legal intelligence is not ephemeral. Aetherius maintains persistent, structured knowledge continuity across organizations and time." },
                  { label: "Hallucination Resistance Protocol", desc: "Every output is grounded in verifiable legal sources. Unverifiable assertions are blocked at the architecture level, not the output level." },
                ].map(({ label, desc }) => (
                  <div key={label} className="flex gap-5 p-6 border border-white/5 hover:border-[#c5a059]/20 transition-colors bg-[#050507]">
                    <ChevronRight className="w-4 h-4 text-[#c5a059]/50 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[12px] font-bold uppercase tracking-wide text-white mb-1.5" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>{label}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          6. GOVERNANCE & TRUST
      ════════════════════════════════════════════ */}
      <section id="governance" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c5a059]" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>06 — Governance & Trust</span>
            <div className="flex-1 h-[1px] bg-white/5" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Infrastructure Requires<br />Governance at Every Level
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-1">
            {[
              { icon: <Lock className="w-5 h-5" />, title: "Data Sovereignty", desc: "All institutional data is processed within sovereign, isolated environments. No cross-contamination between organizational boundaries. Complete data sovereignty by architectural design." },
              { icon: <Shield className="w-5 h-5" />, title: "Access Governance", desc: "Hierarchical access controls with role-based permissions, audit trails on all interactions, and institutional-grade authentication frameworks aligned with enterprise security standards." },
              { icon: <Activity className="w-5 h-5" />, title: "Citation Integrity", desc: "Every analysis is traceable to its legal source. The system cannot generate analysis that cannot be attributed to a verifiable legal authority — by architecture, not policy." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="p-10 border border-white/5 hover:border-[#c5a059]/20 transition-colors bg-[#080910]">
                <div className="text-[#c5a059]/50 mb-6">{icon}</div>
                <h3 className="text-base font-bold text-white uppercase tracking-wide mb-4" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>{desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {[
              { title: "Regulatory Compliance Architecture", desc: "Designed in alignment with Indian data protection law, professional privilege requirements, and institutional compliance obligations across public and private sector deployments." },
              { title: "Judicial & Professional Standards", desc: "LegAIntel operates with awareness of Bar Council of India regulations, professional ethics requirements, and the evidentiary standards applicable to legal reasoning and document production." },
            ].map(({ title, desc }) => (
              <div key={title} className="p-10 border border-white/5 hover:border-[#c5a059]/20 transition-colors bg-[#080910]">
                <h3 className="text-base font-bold text-white uppercase tracking-wide mb-4" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          7. NATIONAL VISION
      ════════════════════════════════════════════ */}
      <section id="vision" className="py-32 px-6 bg-[#080910] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(45deg, rgba(197,160,89,0.8) 1px, transparent 1px), linear-gradient(-45deg, rgba(197,160,89,0.8) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c5a059]" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>07 — National Vision</span>
            <div className="flex-1 h-[1px] bg-white/5" />
          </div>

          <div className="grid md:grid-cols-2 gap-14 items-start">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-8" style={{ fontFamily: 'Georgia, serif' }}>
                A Foundation for Legal Intelligence<br />
                <span className="text-[#c5a059]">at National Scale</span>
              </h2>
              <div className="space-y-6">
                <p className="text-base text-slate-300 leading-relaxed" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
                  India has one of the world's most complex legal systems — spanning 25 High Courts, a Supreme Court, hundreds of tribunals, and thousands of regulatory authorities. The volume of legal knowledge generated annually is unmeasurable by human capacity alone.
                </p>
                <p className="text-sm text-slate-400 leading-relaxed" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
                  LegAIntel is designed to meet that complexity not by simplifying it, but by building the infrastructure required to navigate it at every level — from the individual practitioner to the institutional regulator.
                </p>
              </div>
            </div>

            <div className="space-y-1">
              {[
                { audience: "Law Firms", desc: "Enterprise-grade institutional memory, precedent connectivity, and collaborative legal intelligence infrastructure." },
                { audience: "Enterprises & Corporate Legal", desc: "Continuous regulatory intelligence, compliance monitoring, and legal governance infrastructure." },
                { audience: "Government & Regulatory Bodies", desc: "Policy intelligence, inter-departmental legal connectivity, and institutional knowledge continuity at scale." },
                { audience: "Universities & Institutions", desc: "Legal research infrastructure, academic knowledge mapping, and educational intelligence platforms." },
                { audience: "Advocates & Researchers", desc: "Individual access to national-scale legal intelligence, precedent analysis, and cross-domain legal reasoning." },
              ].map(({ audience, desc }) => (
                <div key={audience} className="flex items-start gap-4 p-5 border border-white/5 hover:border-[#c5a059]/20 transition-colors bg-[#050507] group">
                  <div className="w-1 h-1 rounded-full bg-[#c5a059]/40 shrink-0 mt-2 group-hover:bg-[#c5a059] transition-colors" />
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c5a059]/70 block mb-1" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>{audience}</span>
                    <p className="text-xs text-slate-500 leading-relaxed" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          8. ENTERPRISE CALL TO ACTION
      ════════════════════════════════════════════ */}
      <section id="enterprise" className="py-40 px-6 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(197,160,89,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(197,160,89,0.6) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[150px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(197,160,89,0.04) 0%, transparent 70%)' }} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-[1px] w-16 bg-[#c5a059]/40" />
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c5a059]" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>08 — Enterprise Access</span>
            <div className="h-[1px] w-16 bg-[#c5a059]/40" />
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Build on the Foundation
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-4 leading-relaxed" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 300 }}>
            LegAIntel is currently available through controlled access to law firms, enterprises, government agencies, regulatory bodies, and institutions.
          </p>
          <p className="text-sm text-slate-500 max-w-xl mx-auto mb-14 leading-relaxed" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
            Access requests are reviewed individually. Enterprise deployment, institutional licensing, and government integration are available through dedicated onboarding.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link to="/register"
              className="inline-flex items-center justify-center gap-3 px-12 py-5 bg-[#c5a059] hover:bg-[#b38f48] text-black text-[12px] font-bold uppercase tracking-[0.25em] transition-all group"
              style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
              Request Access
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/contact"
              className="inline-flex items-center justify-center gap-3 px-12 py-5 border border-white/10 hover:border-[#c5a059]/30 text-slate-300 hover:text-white text-[12px] font-bold uppercase tracking-[0.25em] transition-all"
              style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
              Enterprise Inquiry
            </Link>
          </div>

          {/* Audience grid */}
          <div className="flex flex-wrap justify-center gap-1">
            {["Law Firms", "Enterprises", "Government Agencies", "Regulatory Bodies", "Universities", "Judicial Institutions"].map(a => (
              <span key={a} className="px-5 py-2.5 border border-white/5 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>{a}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          TELEGRAM — Public Intelligence Alerts
      ════════════════════════════════════════════ */}
      <section id="alerts" className="border-t border-white/5 py-24 px-6 bg-[#080910]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>Public Intelligence Services</span>
              <div className="flex-1 h-[1px] bg-white/5" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Free Legal Intelligence Alerts
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-lg" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
              Receive AI-generated summaries of significant judgments from the Supreme Court and High Courts delivered directly on Telegram. No account required.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed mb-8 max-w-lg" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
              Each alert includes case title, court, date, key holding, and a link to full analysis. A public intelligence service from LegAIntel — free and open to all legal professionals.
            </p>
            <a href="https://t.me/LegAIntel_bot?start=sub" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-7 py-3.5 bg-[#229ED9] hover:bg-[#1a8fc7] text-white text-[11px] font-bold uppercase tracking-[0.2em] transition-all"
              style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
              </svg>
              Subscribe on Telegram
            </a>
          </div>

          <div className="flex flex-col items-center gap-4 shrink-0">
            <div className="p-4 bg-white border border-[#c5a059]/10">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://t.me/LegAIntel_bot%3Fstart%3Dsub&color=000000&bgcolor=ffffff&margin=2"
                alt="Scan to open @LegAIntel_bot"
                width="150" height="150"
                className="block"
              />
            </div>
            <p className="text-[10px] text-slate-600 text-center uppercase tracking-widest" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>@LegAIntel_bot</p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════ */}
      <footer className="border-t border-white/5 bg-[#030406] py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-14 pb-14 border-b border-white/5">

          <div className="space-y-5 max-w-sm">
            <Link to="/" className="flex items-baseline select-none gap-[1px]">
              <span className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: 'Georgia, serif' }}>leg</span>
              <span className="text-3xl font-black text-[#c5a059] leading-none" style={{ fontFamily: 'Georgia, serif' }}>AI</span>
              <span className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: 'Georgia, serif' }}>ntel</span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
              The Legal Intelligence Infrastructure of India. Connecting legal knowledge, legal reasoning, legal drafting, legal governance, and institutional memory across every domain of law.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 text-xs font-bold uppercase tracking-[0.18em]" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
            <div className="flex flex-col gap-4">
              <span className="text-[#c5a059] text-[10px] tracking-[0.25em] font-extrabold block mb-1">Infrastructure</span>
              <a href="#infrastructure" className="text-slate-500 hover:text-white transition-colors">Intelligence Crisis</a>
              <a href="#architecture" className="text-slate-500 hover:text-white transition-colors">Four Layers</a>
              <a href="#domains" className="text-slate-500 hover:text-white transition-colors">Domains of Law</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[#c5a059] text-[10px] tracking-[0.25em] font-extrabold block mb-1">Platform</span>
              <a href="#aetherius" className="text-slate-500 hover:text-white transition-colors">Aetherius</a>
              <a href="#governance" className="text-slate-500 hover:text-white transition-colors">Governance</a>
              <a href="#vision" className="text-slate-500 hover:text-white transition-colors">National Vision</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[#c5a059] text-[10px] tracking-[0.25em] font-extrabold block mb-1">Resources</span>
              <Link to="/contact" className="text-slate-500 hover:text-white transition-colors">Contact</Link>
              <Link to="/register" className="text-slate-500 hover:text-white transition-colors">Request Access</Link>
              <a href="#alerts" className="text-slate-500 hover:text-white transition-colors">Intelligence Alerts</a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-10 flex flex-col sm:flex-row justify-between items-center gap-5 text-xs text-slate-600" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
          <p>© {new Date().getFullYear()} LegAIntel. All rights reserved.</p>
          <p className="uppercase tracking-[0.2em] text-[11px] text-[#c5a059]/60 font-bold">Building the Foundation for Legal Intelligence in India</p>
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
