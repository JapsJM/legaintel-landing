import { useState } from 'react';
import { Link } from 'react-router-dom';
// --- FIX: Import the centralized API service, not raw axios ---
import { authAPI } from '../services/api';
import { Mail, ArrowLeft, ShieldCheck } from 'lucide-react';

// --- FIX: Remove the hardcoded API_URL ---
// const API_URL = 'http://127.0.0.1:5000'; // This was causing the CORS error

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      // --- FIX: Use the clean, pre-configured authAPI function ---
      const response = await authAPI.forgotPassword(email);
      setStatus({ type: 'success', msg: response.data.message });
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.error || 'Failed to initiate reset.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <ShieldCheck className="mx-auto h-12 w-12 text-[#c5a059]" />
        <h2 className="mt-6 text-3xl font-bold text-white font-serif tracking-tight">Recovery Console</h2>
        <p className="mt-2 text-sm text-slate-500">
          Enter your professional email to receive a secure reset link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#0a0c10] py-8 px-4 shadow-2xl sm:rounded-sm sm:px-10 border border-white/5">
          
          {status.msg && (
            <div className={`mb-6 p-4 rounded-sm text-xs font-bold uppercase tracking-widest border ${
              status.type === 'error' ? 'bg-red-950/20 border-red-900/50 text-red-500' : 'bg-emerald-950/20 border-emerald-900/50 text-emerald-500'
            }`}>
              {status.msg}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">
                Professional Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-600" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-sm bg-black/40 text-white placeholder-slate-700 focus:outline-none focus:border-[#c5a059]/50 text-sm transition-all"
                  placeholder="name@chamber.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-sm text-xs font-bold uppercase tracking-[0.2em] text-black bg-[#c5a059] hover:bg-[#b38f48] focus:outline-none disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(197,160,89,0.2)]"
            >
              {isLoading ? 'Verifying...' : 'Request Reset Link'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5">
            <Link to="/login" className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}