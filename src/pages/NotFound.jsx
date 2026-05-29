import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NotFound() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6 font-sans">
      <div className="text-center max-w-md">

        {/* 404 number */}
        <p className="text-[120px] font-black text-white/[0.03] leading-none select-none font-serif">
          404
        </p>

        <div className="-mt-8 mb-8">
          <h1 className="text-2xl font-bold text-white font-serif tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-500 mt-3 leading-relaxed font-sans">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Gold divider */}
        <div className="w-12 h-px bg-[#c5a059] mx-auto mb-8 opacity-40" />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(user ? '/dashboard' : '/')}
            className="px-6 py-2.5 bg-[#c5a059] hover:bg-[#b38f48] text-black text-xs font-bold uppercase tracking-widest rounded-sm transition-all">
            {user ? 'Back to Chamber' : 'Back to Home'}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest rounded-sm transition-all">
            Go Back
          </button>
        </div>

        <p className="mt-10 text-[10px] text-slate-700 uppercase tracking-widest font-sans">
          LegAIntel · Indian Legal Intelligence Platform
        </p>
      </div>
    </div>
  )
}
