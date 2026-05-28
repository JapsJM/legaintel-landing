import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { authAPI } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setIsLoading(true);
    try {
      // This now uses the centralized authAPI.googleLogin function.
      const res = await authAPI.googleLogin({
        credential: credentialResponse.credential
      });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Google sign-in failed on the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="text-[#c5a059] text-5xl mb-4">⚖️</div>
        <h2 className="text-4xl font-bold text-white font-serif tracking-tight">LegAIntel Login</h2>
        <p className="mt-3 text-xs uppercase tracking-widest text-slate-500 font-bold">Secure Intelligence Portal</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#0a0c10] py-10 px-8 shadow-2xl sm:rounded-sm border border-white/5 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c5a059] to-transparent opacity-50" />

          {error && (
            <div className="mb-6 bg-red-950/30 border border-red-900/50 text-red-400 px-4 py-3 rounded text-xs text-center uppercase tracking-wider font-bold">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Professional Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 border border-white/10 rounded-sm bg-white/5 text-white focus:outline-none focus:border-[#c5a059]/50 focus:ring-1 focus:ring-[#c5a059]/50 transition-all font-sans"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Security Password</label>
                {/* This is now a proper Link element that navigates to the correct page. */}
                <Link to="/forgot-password" className="text-[10px] font-bold text-[#c5a059] hover:text-[#e0c286] uppercase tracking-widest transition-colors">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 border border-white/10 rounded-sm bg-white/5 text-white focus:outline-none focus:border-[#c5a059]/50 focus:ring-1 focus:ring-[#c5a059]/50 transition-all font-sans"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-sm shadow-sm text-xs font-bold text-black bg-[#c5a059] hover:bg-[#e0c286] focus:outline-none disabled:opacity-50 transition-colors uppercase tracking-widest"
              >
                {isLoading ? 'Authenticating...' : 'Authorize Access'}
              </button>
            </div>
          </form>

          <div className="mt-4">
            <Link 
              to="/register"
              className="w-full flex justify-center py-3 px-4 border border-[#c5a059]/30 rounded-sm text-xs font-bold text-[#c5a059] hover:bg-[#c5a059]/10 focus:outline-none transition-colors uppercase tracking-widest"
            >
              Create New Account
            </Link>
          </div>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-[#0a0c10] text-slate-500 uppercase tracking-widest font-bold">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google sign-in popup was closed or failed.')}
                theme="filled_black"
                shape="rectangular"
                text="continue_with"
                size="large"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}