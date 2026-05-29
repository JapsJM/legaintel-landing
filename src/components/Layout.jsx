import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, MessageSquare, FileText, Library, 
  Zap, User, LogOut, ShieldCheck, BookOpen, BookCopy,
  MessageSquarePlus
} from 'lucide-react';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Legal Chat', href: '/chat', icon: MessageSquare },
    { name: 'Case Documents', href: '/documents', icon: FileText },
    { name: 'Media Library', href: '/media', icon: Library },
    { name: 'Morning Briefing', href: '/briefing', icon: Zap },
    { name: 'Case Briefs', href: '/briefs', icon: BookOpen },
  ];

  return (
    <div className="flex h-screen bg-[#050505] text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#0a0c10] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-8">
          <div className="flex items-center">
            <h1 className="text-xl font-serif tracking-tight text-white">
              leg<span className="text-[#c5a059] font-bold">AI</span>ntel
            </h1>
          </div>
          <div className="h-[1px] w-12 bg-[#c5a059] mt-2 ml-13 opacity-40" />
        </div>

        <nav className="flex-1 px-6 space-y-10 mt-4 overflow-y-auto custom-scrollbar">
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">Intelligence</h3>
            <div className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-4 px-3 py-2.5 rounded-md text-sm transition-all group ${
                      isActive 
                        ? 'text-white bg-white/5 border-l-2 border-[#c5a059]' 
                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-[#c5a059]' : 'text-slate-600 group-hover:text-slate-300'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">Account</h3>
            <div className="space-y-2">
              {/* --- ADMIN SECTION --- */}
              {user?.role === 'admin' && (
                <>
                  <Link 
                    to="/admin" 
                    className={`flex items-center gap-4 px-3 py-2.5 text-sm transition-all rounded-md group ${
                      location.pathname === '/admin' 
                        ? 'text-white bg-white/5 border-l-2 border-[#c5a059]' 
                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <ShieldCheck className={`w-4 h-4 ${location.pathname === '/admin' ? 'text-[#c5a059]' : 'text-slate-600 group-hover:text-slate-300'}`} /> 
                    Admin Console
                  </Link>
                  
                  {/* --- NEW MAPPING CONSOLE LINK --- */}
                  <Link 
                    to="/admin/mappings" 
                    className={`flex items-center gap-4 px-3 py-2.5 text-sm transition-all rounded-md group ${
                      location.pathname === '/admin/mappings' 
                        ? 'text-white bg-white/5 border-l-2 border-[#c5a059]' 
                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <BookCopy className={`w-4 h-4 ${location.pathname === '/admin/mappings' ? 'text-[#c5a059]' : 'text-slate-600 group-hover:text-slate-300'}`} /> 
                    Statutory Mappings
                  </Link>

                  {/* --- FEEDBACK DASHBOARD LINK --- */}
                  <Link
                    to="/admin/feedback"
                    className={`flex items-center gap-4 px-3 py-2.5 text-sm transition-all rounded-md group ${
                      location.pathname === '/admin/feedback'
                        ? 'text-white bg-white/5 border-l-2 border-[#c5a059]'
                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <MessageSquarePlus className={`w-4 h-4 ${location.pathname === '/admin/feedback' ? 'text-[#c5a059]' : 'text-slate-600 group-hover:text-slate-300'}`} />
                    Feedback Dashboard
                  </Link>
                </>
              )}
              
              <Link to="/profile" className={`flex items-center gap-4 px-3 py-2.5 text-sm transition-all rounded-md hover:bg-white/5 ${location.pathname === '/profile' ? 'text-white bg-white/5 border-l-2 border-[#c5a059]' : 'text-slate-500 hover:text-white'}`}>
                <User className="w-4 h-4 text-slate-600" /> My Profile
              </Link>
              <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-4 px-3 py-2.5 text-sm text-slate-500 hover:text-red-400 transition-all rounded-md hover:bg-white/5">
                <LogOut className="w-4 h-4 text-slate-600" /> Sign Out
              </button>
            </div>
          </div>
        </nav>

        {/* Feedback Link */}
        <div className="px-6 pb-3">
          <Link
            to="/submit-feedback"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-slate-500 hover:text-[#c5a059] hover:bg-white/5 transition-all group"
          >
            <MessageSquarePlus className="w-4 h-4 text-slate-600 group-hover:text-[#c5a059] transition-colors" />
            Share Feedback
          </Link>
        </div>

        <div className="p-6 border-t border-white/5 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center text-[10px] font-bold text-[#c5a059]">
              {user?.username?.charAt(0).toUpperCase() || 'C'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.username || 'Counsel'}</p>
              <p className="text-[9px] text-slate-500 uppercase tracking-tighter">{user?.role || 'Advocate'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#050505]">
        <div className="max-w-6xl mx-auto p-10">
          {children}
        </div>
      </main>
    </div>
  );
}