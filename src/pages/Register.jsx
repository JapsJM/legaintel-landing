import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, ShieldCheck, ArrowLeft } from 'lucide-react';
import api from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [step, setStep] = useState('register');
  const [emailOtp, setEmailOtp] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [termsAcceptedAt, setTermsAcceptedAt] = useState(null);
  const [privacyAcceptedAt, setPrivacyAcceptedAt] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!acceptedTerms || !acceptedPrivacy) {
      setError('You must accept both the Terms of Service and Privacy Policy to proceed.');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/register/request-otp', {
        username: formData.username,
        email: formData.email,
      });
      setStep('verify');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/register/verify-otp', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        email_otp: emailOtp,
        terms_accepted_at: termsAcceptedAt,
        privacy_accepted_at: privacyAcceptedAt,
      });

      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="text-[#c5a059] text-5xl mb-4">⚖️</div>
        <h2 className="text-4xl font-bold text-white font-serif tracking-tight">Create Account</h2>
        <p className="mt-3 text-xs uppercase tracking-widest text-slate-500 font-bold">Join the LegAIntel Ecosystem</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#0a0c10] py-10 px-8 shadow-2xl sm:rounded-sm border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c5a059] to-transparent opacity-50" />

          {error && (
            <div className="mb-6 bg-red-950/30 border border-red-900/50 text-red-400 px-4 py-3 rounded text-xs text-center uppercase tracking-wider font-bold">
              {error}
            </div>
          )}

          {step === 'register' ? (
            <form className="space-y-6" onSubmit={handleSubmitInfo}>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name / Username</label>
                <input
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-white/10 rounded-sm bg-white/5 text-white focus:outline-none focus:border-[#c5a059]/50 focus:ring-1 focus:ring-[#c5a059]/50 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Professional Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-white/10 rounded-sm bg-white/5 text-white focus:outline-none focus:border-[#c5a059]/50 focus:ring-1 focus:ring-[#c5a059]/50 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Security Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  minLength="8"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-white/10 rounded-sm bg-white/5 text-white focus:outline-none focus:border-[#c5a059]/50 focus:ring-1 focus:ring-[#c5a059]/50 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-white/10 rounded-sm bg-white/5 text-white focus:outline-none focus:border-[#c5a059]/50 focus:ring-1 focus:ring-[#c5a059]/50 transition-all font-sans"
                />
              </div>

              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked);
                    if (e.target.checked) setTermsAcceptedAt(new Date().toISOString());
                    else setTermsAcceptedAt(null);
                  }}
                  className="mt-0.5 h-4 w-4 text-[#c5a059] border-white/10 rounded-sm bg-white/5 cursor-pointer"
                />
                <label htmlFor="terms" className="ml-3 text-[11px] text-slate-400">
                  I agree to the{' '}
                  <Link to="/terms" target="_blank" className="text-[#c5a059] hover:text-[#e0c286] font-bold underline">
                    Terms of Service
                  </Link>
                </label>
              </div>

              <div className="flex items-start">
                <input
                  id="privacy"
                  type="checkbox"
                  required
                  checked={acceptedPrivacy}
                  onChange={(e) => {
                    setAcceptedPrivacy(e.target.checked);
                    if (e.target.checked) setPrivacyAcceptedAt(new Date().toISOString());
                    else setPrivacyAcceptedAt(null);
                  }}
                  className="mt-0.5 h-4 w-4 text-[#c5a059] border-white/10 rounded-sm bg-white/5 cursor-pointer"
                />
                <label htmlFor="privacy" className="ml-3 text-[11px] text-slate-400">
                  I agree to the{' '}
                  <Link to="/privacy" target="_blank" className="text-[#c5a059] hover:text-[#e0c286] font-bold underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !acceptedTerms || !acceptedPrivacy}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-sm shadow-sm text-xs font-bold text-black bg-[#c5a059] hover:bg-[#e0c286] focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed transition-all uppercase tracking-widest"
                >
                  {isLoading ? 'Sending OTP...' : 'Establish Secure Access'}
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-8" onSubmit={handleVerifyOtp}>
              <div className="text-center space-y-2">
                <ShieldCheck className="w-12 h-12 text-[#c5a059] mx-auto" />
                <h3 className="text-lg font-bold text-slate-100 font-serif">Email Verification</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                  Enter the 6-digit code sent to your email address.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#c5a059]" />
                  Email Verification Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value)}
                  className="block w-full px-4 py-3 border border-white/10 rounded-sm bg-white/5 text-white tracking-widest text-center text-sm font-bold focus:outline-none focus:border-[#c5a059] transition-all font-sans placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-sm shadow-sm text-xs font-bold text-black bg-[#c5a059] hover:bg-[#e0c286] focus:outline-none disabled:opacity-40 transition-all uppercase tracking-widest"
                >
                  {isLoading ? 'Verifying...' : 'Verify & Create Account'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('register')}
                  className="w-full flex justify-center items-center gap-2 py-3 text-xs text-slate-400 hover:text-white border border-white/5 hover:bg-white/5 transition-all uppercase tracking-widest font-bold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center font-sans">
            <Link to="/login" className="text-xs text-slate-500 hover:text-white transition-colors uppercase tracking-wider font-semibold">
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
