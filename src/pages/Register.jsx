import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Register() {
  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [otpCode, setOtpCode] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    return () => clearInterval(cooldownRef.current);
  }, []);

  const startCooldown = () => {
    setResendCooldown(60);
    cooldownRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(cooldownRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRequestOtp = async (e) => {
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
        password: formData.password,
      });
      setStep('otp');
      startCooldown();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (otpCode.length !== 6) {
      setError('Please enter the 6-digit code.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register/verify-otp', {
        email: formData.email,
        email_otp: otpCode,
        username: formData.username,
        password: formData.password,
      });
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setIsLoading(true);
    try {
      await api.post('/auth/register/request-otp', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      startCooldown();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "block w-full px-4 py-3 border border-white/10 rounded-sm bg-white/5 text-white focus:outline-none focus:border-[#c5a059]/50 focus:ring-1 focus:ring-[#c5a059]/50 transition-all font-sans";
  const labelClass = "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2";

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-4xl font-bold text-white font-serif tracking-tight">
          {step === 'form' ? 'Create Account' : 'Verify Your Email'}
        </h2>
        <p className="mt-3 text-xs uppercase tracking-widest text-slate-500 font-bold">
          {step === 'form' ? 'Join the LegAIntel Ecosystem' : `Code sent to ${formData.email}`}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#0a0c10] py-10 px-8 shadow-2xl sm:rounded-sm border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c5a059] to-transparent opacity-50" />

          {error && (
            <div className="mb-6 bg-red-950/30 border border-red-900/50 text-red-400 px-4 py-3 rounded text-xs text-center uppercase tracking-wider font-bold">
              {error}
            </div>
          )}

          {step === 'form' ? (
            <form className="space-y-6" onSubmit={handleRequestOtp}>
              <div>
                <label className={labelClass}>Full Name / Username</label>
                <input name="username" type="text" required value={formData.username} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Professional Email</label>
                <input name="email" type="email" required value={formData.email} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Security Password</label>
                <input name="password" type="password" required minLength="8" value={formData.password} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Confirm Password</label>
                <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className={inputClass} />
              </div>

              <div className="flex items-start">
                <input id="terms" type="checkbox" required checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-0.5 h-4 w-4 text-[#c5a059] border-white/10 rounded-sm bg-white/5 cursor-pointer" />
                <label htmlFor="terms" className="ml-3 text-[11px] text-slate-400">
                  I agree to the{' '}
                  <Link to="/terms" target="_blank" className="text-[#c5a059] hover:text-[#e0c286] font-bold underline">Terms of Service</Link>
                </label>
              </div>
              <div className="flex items-start">
                <input id="privacy" type="checkbox" required checked={acceptedPrivacy} onChange={(e) => setAcceptedPrivacy(e.target.checked)} className="mt-0.5 h-4 w-4 text-[#c5a059] border-white/10 rounded-sm bg-white/5 cursor-pointer" />
                <label htmlFor="privacy" className="ml-3 text-[11px] text-slate-400">
                  I agree to the{' '}
                  <Link to="/privacy" target="_blank" className="text-[#c5a059] hover:text-[#e0c286] font-bold underline">Privacy Policy</Link>
                </label>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={isLoading || !acceptedTerms || !acceptedPrivacy}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-sm shadow-sm text-xs font-bold text-black bg-[#c5a059] hover:bg-[#e0c286] focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed transition-all uppercase tracking-widest">
                  {isLoading ? 'Sending Code...' : 'Send Verification Code'}
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div>
                <label className={labelClass}>6-Digit Verification Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className={`${inputClass} text-center text-2xl tracking-[0.5em] font-bold`}
                  autoFocus
                />
                <p className="mt-2 text-[10px] text-slate-500 text-center">Check your inbox — code expires in 5 minutes.</p>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={isLoading || otpCode.length !== 6}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-sm shadow-sm text-xs font-bold text-black bg-[#c5a059] hover:bg-[#e0c286] focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed transition-all uppercase tracking-widest">
                  {isLoading ? 'Verifying...' : 'Verify & Create Account'}
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button type="button" onClick={() => { setStep('form'); setError(''); setOtpCode(''); }}
                  className="text-[10px] text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
                  ← Change Details
                </button>
                <button type="button" onClick={handleResend} disabled={resendCooldown > 0 || isLoading}
                  className="text-[10px] text-[#c5a059] hover:text-[#e0c286] uppercase tracking-widest transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
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
