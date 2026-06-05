import { useState, useEffect, useRef } from 'react'
import {
  MessageSquare, BookOpen, FolderOpen, Upload,
  Scale, FileText, Bell, Image, User, CreditCard,
  Mail, ChevronDown, ChevronUp, ArrowRight
} from 'lucide-react'

// ─── feature data ─────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: 'research',
    label: 'Research',
    accent: 'text-[#c5a059]',
    borderAccent: 'border-[#c5a059]/30',
    bgAccent: 'bg-[#c5a059]/5',
    dotColor: 'bg-[#c5a059]',
    features: [
      {
        icon: MessageSquare,
        title: 'Ask legal questions',
        sub: 'Query any judgment or statute instantly',
        detail: 'Type any legal question — a definition, a case fact, or a deep analytical query. Aetherius searches through thousands of indexed judgments and your own documents, then returns a precise answer with the exact source passages it drew from. No guessing, no fabrication.',
        steps: ['Type your question in the query box', 'Engine finds the most relevant passages', 'Answer generated with source citations', 'Follow up with deeper questions'],
      },
      {
        icon: BookOpen,
        title: 'Browse public catalog',
        sub: 'SCI judgments, pre-indexed',
        detail: 'Access the full catalog of Supreme Court of India and Gujarat High Court judgments — all pre-indexed and ready to query. Browse by court, date, or keyword. Free users can search and read the entire catalog without uploading anything.',
        steps: ['Open the catalog from the sidebar', 'Filter by court, year, or keyword', 'Click any judgment to preview', 'Add it to your workspace for deeper querying'],
      },
      {
        icon: FolderOpen,
        title: 'Research history',
        sub: 'Every session saved and searchable',
        detail: 'Every query conversation is saved automatically. You can return to any past research session, see exactly which documents were active, and continue where you left off. Organise sessions by category or archive old ones.',
        steps: ['Find past sessions in the sidebar', 'Filter by date or category', 'Resume any conversation', 'Archive or delete when done'],
      },
    ],
  },
  {
    id: 'documents',
    label: 'Your documents',
    accent: 'text-blue-400',
    borderAccent: 'border-blue-400/30',
    bgAccent: 'bg-blue-400/5',
    dotColor: 'bg-blue-400',
    features: [
      {
        icon: Upload,
        title: 'Upload case files',
        sub: 'Your PDFs, queryable in seconds',
        detail: 'Upload any legal PDF — case files, pleadings, contracts, statutes, notes. Aetherius processes and indexes it into your private workspace. Once ready, you can query it exactly like the public catalog. Only you can access your uploaded documents.',
        steps: ['Drag and drop or click to upload', 'System processes and indexes the PDF', 'Status changes to Ready when complete', 'Query your document alongside public judgments'],
      },
      {
        icon: FolderOpen,
        title: 'Private workspace',
        sub: 'Your research library, always private',
        detail: 'Your workspace holds all your uploaded documents and any public judgments you have saved. When you ask a question, the engine searches only within your workspace — keeping your research focused and completely private to your account.',
        steps: ['Upload documents or save from catalog', 'All saved documents appear in workspace', 'Queries run against your workspace only', 'Remove documents any time'],
      },
      {
        icon: FileText,
        title: 'Document lineage',
        sub: 'Full history of every document',
        detail: 'Every document keeps a full audit trail — every upload, update, and version change is recorded. You can always trace exactly which version of a document contributed to an answer, giving you complete confidence in your research.',
        steps: ['Open any document in your workspace', 'View its full version history', 'See every operation with timestamps', 'Trace any answer to its exact source'],
      },
    ],
  },
  {
    id: 'intelligence',
    label: 'Intelligence tools',
    accent: 'text-emerald-400',
    borderAccent: 'border-emerald-400/30',
    bgAccent: 'bg-emerald-400/5',
    dotColor: 'bg-emerald-400',
    features: [
      {
        icon: Scale,
        title: 'Statutory bridge',
        sub: 'IPC ↔ BNS cross-reference',
        detail: 'The statutory bridge maps every provision between the Indian Penal Code (IPC) and the Bharatiya Nyaya Sanhita (BNS). Enter any IPC section and instantly see the equivalent BNS provision — with notes on key differences. Essential for practice during the transition period.',
        steps: ['Enter an IPC or BNS section number', 'Bridge finds the mapped provision', 'View differences and transition notes', 'Use in your research or cite directly'],
      },
      {
        icon: FileText,
        title: 'Case briefs',
        sub: 'Structured summaries in one click',
        detail: 'Generate a structured case brief for any indexed judgment instantly. The brief covers the facts, legal issues, arguments, ratio decidendi, obiter dicta, and the final decision — formatted for quick reading, exam preparation, or citation in legal writing.',
        steps: ['Open any judgment in the catalog', 'Click Generate brief', 'Structured brief appears in seconds', 'Download or save to your workspace'],
      },
      {
        icon: Bell,
        title: 'Precedent alerts',
        sub: 'Never miss a landmark ruling',
        detail: 'Set alerts for any legal topic, statute section, or court. When a new judgment matching your criteria is added to the system, you receive an instant notification via Telegram. Stay ahead of developments relevant to your research or practice area.',
        steps: ['Go to alert settings', 'Set keywords, sections, or court filters', 'New matching judgment is indexed', 'Instant Telegram notification sent'],
      },
      {
        icon: Image,
        title: 'Media in documents',
        sub: 'Tables, charts, scanned pages',
        detail: 'Aetherius can read and understand images inside your PDFs — including scanned pages, data tables, and charts. Visual content is extracted and indexed alongside the text, so you can query everything in a document, not just the readable text.',
        steps: ['Upload a PDF with images or tables', 'Vision processor extracts visual content', 'Text and visuals indexed together', 'Query across the entire document'],
      },
    ],
  },
  {
    id: 'account',
    label: 'Account',
    accent: 'text-slate-400',
    borderAccent: 'border-slate-400/30',
    bgAccent: 'bg-slate-400/5',
    dotColor: 'bg-slate-500',
    features: [
      {
        icon: User,
        title: 'Public profile',
        sub: 'Your identity on the platform',
        detail: 'Your profile shows your name, avatar, and research interests to other researchers on the platform. You control exactly what is visible. Update your profile, upload a photo, or set your area of legal focus from account settings.',
        steps: ['Go to account settings', 'Edit name, bio, and avatar', 'Set your research interests', 'Profile visible to other researchers'],
      },
      {
        icon: CreditCard,
        title: 'Plans & billing',
        sub: 'Free, Pro, or Enterprise',
        detail: 'Aetherius offers three plans. Free gives you 20 queries per month and full access to the public catalog. Pro gives you 500 queries, your own workspace, and more powerful AI analysis. Enterprise gives you unlimited queries and the deepest AI capabilities. Upgrade or downgrade any time.',
        steps: ['Go to billing settings', 'Choose your plan', 'Pay securely via Stripe', 'Plan upgrades take effect immediately'],
      },
      {
        icon: Mail,
        title: 'Notifications',
        sub: 'Stay informed, your way',
        detail: 'Manage how Aetherius communicates with you. Account emails — verification, password reset, OTP — go to your registered email. Precedent alerts go via Telegram. Configure your preferences from account settings at any time.',
        steps: ['Go to notification settings', 'Set Telegram handle for alerts', 'Choose alert frequency', 'Update any time'],
      },
    ],
  },
]

// ─── sub-components ──────────────────────────────────────────────────────────

const FeatureCard = ({ feature, isActive, onClick, accent, borderAccent, bgAccent, delay }) => {
  const Icon = feature.icon
  return (
    <button
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
      className={`
        w-full text-left p-4 rounded-sm border transition-all duration-200 animate-fadeSlideUp
        ${isActive
          ? `${bgAccent} ${borderAccent}`
          : 'bg-[#0a0c10] border-white/5 hover:border-white/10'}
      `}
    >
      <Icon className={`w-4 h-4 mb-3 ${isActive ? accent : 'text-slate-500'} transition-colors`} />
      <p className={`text-xs font-bold uppercase tracking-widest font-sans mb-1 transition-colors ${isActive ? 'text-white' : 'text-slate-300'}`}>
        {feature.title}
      </p>
      <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
        {feature.sub}
      </p>
    </button>
  )
}

const DetailPanel = ({ feature, accent, borderAccent }) => {
  const Icon = feature.icon
  return (
    <div className={`p-5 rounded-sm border ${borderAccent} bg-[#0a0c10] animate-fadeIn`}>
      <div className="flex items-center gap-3 mb-3">
        <Icon className={`w-4 h-4 ${accent} shrink-0`} />
        <p className="text-xs font-bold text-white uppercase tracking-widest font-sans">{feature.title}</p>
      </div>
      <p className="text-[11px] text-slate-400 font-sans leading-relaxed mb-4">
        {feature.detail}
      </p>
      <div className="space-y-2">
        {feature.steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className={`text-[9px] font-bold ${accent} font-mono mt-0.5 shrink-0 w-3`}>{i + 1}</span>
            <p className="text-[11px] text-slate-400 font-sans leading-snug">{step}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

export default function FeatureBlueprint() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeFeature, setActiveFeature] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const panelRef = useRef(null)

  const handleCardClick = (feature, category) => {
    if (activeFeature?.title === feature.title) {
      setActiveFeature(null)
      setActiveCategory(null)
    } else {
      setActiveFeature(feature)
      setActiveCategory(category)
      setTimeout(() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100)
    }
  }

  return (
    <div className="border border-white/5 rounded-sm bg-[#080a0e] mt-6">

      {/* header toggle */}
      <button
        onClick={() => setIsOpen(p => !p)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
            Platform guide — what can Aetherius do?
          </p>
        </div>
        {isOpen
          ? <ChevronUp className="w-3.5 h-3.5 text-slate-600" />
          : <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
        }
      </button>

      {/* content */}
      {isOpen && (
        <div className="px-5 pb-5 border-t border-white/5">

          {CATEGORIES.map((cat, ci) => (
            <div key={cat.id} className="mt-5">
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest font-sans mb-3 flex items-center gap-2">
                <span className={`w-1 h-1 rounded-full ${cat.dotColor}`} />
                {cat.label}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {cat.features.map((f, fi) => (
                  <FeatureCard
                    key={f.title}
                    feature={f}
                    isActive={activeFeature?.title === f.title}
                    onClick={() => handleCardClick(f, cat)}
                    accent={cat.accent}
                    borderAccent={cat.borderAccent}
                    bgAccent={cat.bgAccent}
                    delay={ci * 80 + fi * 50}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* detail panel */}
          <div ref={panelRef} className="mt-4">
            {activeFeature && activeCategory ? (
              <DetailPanel
                feature={activeFeature}
                accent={activeCategory.accent}
                borderAccent={activeCategory.borderAccent}
              />
            ) : (
              <div className="flex items-center gap-2 p-4 border border-white/5 rounded-sm">
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <p className="text-[11px] text-slate-600 font-sans">Select any feature above to see how it works.</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
