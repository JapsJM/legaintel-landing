import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listConversations } from '../services/chat';
import { listDocuments } from '../services/documents';
import { getBriefing } from '../services/briefing';
import {
  FileText, MessageSquare, Zap, Shield,
  ArrowUpRight, PlusCircle, BookOpen, Clock
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, sub }) => (
  <div className="bg-[#0a0c10] border border-white/5 p-6 rounded hover:border-[#c5a059]/20 transition-all group">
    <Icon className="w-4 h-4 text-[#c5a059]/60 mb-4 group-hover:text-[#c5a059] transition-colors" />
    <p className="text-3xl font-light text-slate-100 tracking-tight font-sans">{value}</p>
    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.15em] mt-1.5 font-sans">{label}</p>
    {sub && <p className="text-[10px] text-slate-600 mt-1 font-sans">{sub}</p>}
  </div>
);

const ActivityRow = ({ type, title, date, onClick }) => (
  <div onClick={onClick} className="flex justify-between items-start group cursor-pointer py-1">
    <div className="min-w-0">
      <p className="text-[9px] font-bold text-[#c5a059] uppercase tracking-widest mb-0.5 font-sans">{type}</p>
      <p className="text-sm text-slate-300 group-hover:text-white transition truncate font-sans">{title}</p>
    </div>
    <p className="text-[10px] text-slate-600 font-mono shrink-0 ml-4">{date}</p>
  </div>
);

const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [documents, setDocuments]         = useState([]);
  const [briefing, setBriefing]           = useState(null);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    Promise.allSettled([
      listConversations(),
      listDocuments(),
      getBriefing(),
    ]).then(([convRes, docRes, briefRes]) => {
      if (convRes.status === 'fulfilled') setConversations(convRes.value || []);
      if (docRes.status === 'fulfilled')  setDocuments(docRes.value?.data?.documents || []);
      if (briefRes.status === 'fulfilled') setBriefing(briefRes.value?.briefing || null);
    }).finally(() => setLoading(false));
  }, []);

  const readyDocs = documents.filter(d => d.status === 'ready').length;

  // Build recent activity from real data
  const activity = [
    ...conversations.slice(0, 3).map(c => ({
      type: 'Research',
      title: c.title || c.first_message || 'Legal Query',
      date: formatDate(c.created_at || c.updated_at),
      onClick: () => navigate('/chat'),
    })),
    ...documents.slice(0, 2).map(d => ({
      type: 'Document',
      title: d.filename,
      date: formatDate(d.uploaded_at || d.created_at),
      onClick: () => navigate('/documents'),
    })),
  ].sort((a, b) => 0).slice(0, 5);

  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100 font-sans">
            Welcome, {user?.username || 'Counselor'}
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 font-sans">
            Your legal intelligence workspace is ready.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/documents')}
            className="flex items-center gap-2 bg-[#c5a059] hover:bg-[#c5a059]/80 text-black px-5 py-2 rounded text-xs font-bold transition uppercase tracking-widest font-sans">
            <PlusCircle className="w-3.5 h-3.5" /> Upload File
          </button>
          <button onClick={() => navigate('/chat')}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 px-5 py-2 rounded text-xs font-bold transition uppercase tracking-widest font-sans">
            <MessageSquare className="w-3.5 h-3.5" /> New Research
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText}     label="Case Documents"   value={documents.length} sub={`${readyDocs} ready`} />
        <StatCard icon={MessageSquare} label="Research Queries" value={conversations.length} />
        <StatCard icon={Shield}       label="System Status"    value="Online" />
        <StatCard icon={Zap}          label="Account Tier"     value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Advocate'} />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Morning Briefing */}
        <div className="lg:col-span-2 bg-[#0a0c10] border border-white/5 rounded overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c5a059] font-sans">Morning Briefing</h3>
            <button onClick={() => navigate('/briefing')}
              className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-200 flex items-center gap-1.5 font-sans transition">
              Full Report <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-8">
            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-white/5 rounded w-3/4" />
                <div className="h-4 bg-white/5 rounded w-1/2" />
                <div className="h-4 bg-white/5 rounded w-2/3" />
              </div>
            ) : briefing?.summary && briefing.summary !== 'No documents available to generate a briefing.' ? (
              <div className="space-y-4">
                <p className="text-slate-200 text-sm leading-relaxed font-sans line-clamp-6">
                  {briefing.summary}
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-[9px] font-bold px-2.5 py-1 bg-white/5 border border-white/5 rounded text-slate-400 uppercase tracking-wider font-sans">
                    {briefing.doc_count} doc{briefing.doc_count !== 1 ? 's' : ''} analysed
                  </span>
                  <span className={`text-[9px] font-bold px-2.5 py-1 rounded border uppercase tracking-wider font-sans ${
                    briefing.confidence === 'HIGH' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    briefing.confidence === 'MEDIUM' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                    'bg-slate-500/10 border-slate-500/20 text-slate-400'
                  }`}>
                    {briefing.confidence} confidence
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-start gap-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-slate-700" />
                  <div>
                    <p className="text-slate-300 text-sm font-semibold font-sans">No briefing yet</p>
                    <p className="text-slate-500 text-xs font-sans mt-0.5">
                      {documents.length === 0 ? 'Upload documents to generate your first briefing.' : 'Click Generate Now in Morning Briefing.'}
                    </p>
                  </div>
                </div>
                <button onClick={() => navigate('/briefing')}
                  className="text-xs px-4 py-2 bg-[#c5a059]/10 border border-[#c5a059]/20 text-[#c5a059] rounded hover:bg-[#c5a059]/20 transition font-sans">
                  Go to Briefing →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#0a0c10] border border-white/5 rounded p-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 font-sans flex items-center gap-2">
            <Clock className="w-3 h-3" /> Recent Activity
          </h3>

          {loading ? (
            <div className="space-y-5 animate-pulse">
              {[1,2,3].map(i => <div key={i} className="h-8 bg-white/5 rounded" />)}
            </div>
          ) : activity.length > 0 ? (
            <div className="space-y-5">
              {activity.map((item, i) => (
                <ActivityRow key={i} {...item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-600 text-xs font-sans">No activity yet.</p>
              <p className="text-slate-700 text-xs font-sans mt-1">Upload a document or start a research query.</p>
            </div>
          )}

          {activity.length > 0 && (
            <button onClick={() => navigate('/chat')}
              className="mt-6 w-full text-[10px] text-slate-500 hover:text-slate-300 uppercase tracking-widest font-sans transition text-center">
              View all research →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
