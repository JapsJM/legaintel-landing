import { useState, useRef } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { authAPI, billingAPI } from '../services/api';
import { CreditCard, Check, Sparkles, Shield, User, Trash2, ShieldAlert, Mail, Phone, X, AlertTriangle } from 'lucide-react';

const inputCls = "w-full bg-[#0a0c10] border border-white/10 rounded px-4 py-2.5 text-slate-100 text-sm font-sans disabled:opacity-40 focus:outline-none focus:border-[#c5a059]/50 transition-colors";
const labelCls = "block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 font-sans";
const cardCls  = "bg-[#0a0c10] border border-white/5 rounded p-6";

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing]   = useState(false);
  const [formData, setFormData]     = useState({ username: user?.username || '', bio: user?.bio || '' });
  const [passwords, setPasswords]   = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [message, setMessage]       = useState({ type: '', text: '' });
  const [billingLoading, setBillingLoading] = useState(false);
  const fileInputRef = useRef(null);

  // --- ADDED: Account Deletion States ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteOtps, setDeleteOtps] = useState({ email_otp: '', sms_otp: '' });
  const [requestingDelete, setRequestingDelete] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await authAPI.updateProfile(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
      setIsEditing(false);
    } catch (err) {
      setMessage({ type: 'error', text: String(err.response?.data?.error || 'Update failed') });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    try {
      await authAPI.updatePassword({
        current_password: passwords.current_password,
        new_password: passwords.new_password
      });
      setMessage({ type: 'success', text: 'Password changed successfully.' });
      setPasswords({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setMessage({ type: 'error', text: String(err.response?.data?.error || 'Password change failed') });
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      await authAPI.uploadAvatar(fd);
      setMessage({ type: 'success', text: 'Avatar updated. Refresh page to apply.' });
    } catch (err) {
      setMessage({ type: 'error', text: String(err.response?.data?.error || 'Avatar upload failed') });
    }
  };

  const handleCheckout = async (tierChoice) => {
    setBillingLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await billingAPI.checkout(tierChoice);
      window.location.href = response.data.url;
    } catch (err) {
      setMessage({ type: 'error', text: String(err.response?.data?.error || 'Failed to initiate checkout.') });
      setBillingLoading(false);
    }
  };

  // --- ADDED: secure deletion OTP dispatch ---
  const handleRequestDeleteOtp = async () => {
    setRequestingDelete(true);
    setMessage({ type: '', text: '' });
    try {
      await api.post('/auth/delete/request-otp', {}, getHeaders());
      setShowDeleteModal(true);
    } catch (err) {
      setMessage({
        type: 'error',
        text: String(err.response?.data?.error || 'Failed to request security deletion codes. Verify contact details.')
      });
    } finally {
      setRequestingDelete(false);
    }
  };

  // --- ADDED: verify codes and execute complete account purge ---
  const handleVerifyDelete = async (e) => {
    e.preventDefault();
    setDeletingAccount(true);
    try {
      await api.post('/auth/delete/verify-otp', {
        email_otp: deleteOtps.email_otp,
        sms_otp: deleteOtps.sms_otp
      }, getHeaders());

      // Instantly clear session state and route visitor to Landing
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (err) {
      setMessage({
        type: 'error',
        text: String(err.response?.data?.error || 'Verification failed. Destruction sequence aborted.')
      });
      setShowDeleteModal(false);
    } finally {
      setDeletingAccount(false);
    }
  };

  const userTier = user?.tier?.toLowerCase() || 'free';

  return (
    <div className="min-h-screen bg-[#050505] text-white py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        <div>
          <h1 className="text-xl font-semibold text-slate-100 font-sans">Profile Settings</h1>
          <p className="text-sm text-slate-500 mt-1 font-sans">Manage your account details, security, and subscription.</p>
        </div>

        {message.text && (
          <div className={`p-3 rounded text-sm font-sans ${message.type === 'error' ? 'bg-red-950/30 border border-red-900/30 text-red-300' : 'bg-emerald-950/30 border border-emerald-900/30 text-emerald-300'}`}>
            {message.text}
          </div>
        )}

        {/* Avatar card */}
        <div className={`${cardCls} flex items-center gap-5`}>
          <div className="relative shrink-0">
            {user?.avatar_url ? (
              <img src={`${user.avatar_url}`} alt="Avatar" className="w-20 h-20 rounded-full object-cover border border-[#c5a059]/30" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center text-2xl font-bold text-[#c5a059] font-sans">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <button onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 bg-[#0a0c10] border border-white/10 p-1.5 rounded-full hover:border-[#c5a059]/40 transition text-xs">
              📷
            </button>
            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-100 font-sans">{user?.username}</h2>
            <p className="text-sm text-slate-400 font-sans">{user?.email}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 bg-[#c5a059]/10 border border-[#c5a059]/20 text-[#c5a059] text-[10px] rounded uppercase tracking-wider font-sans font-bold">
              {userTier} Membership
            </span>
          </div>
        </div>

        {/* Premium Subscription Widget */}
        <div className={cardCls}>
          <div className="flex items-center gap-2 mb-5">
            <CreditCard className="w-5 h-5 text-[#c5a059]" />
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-sans">Subscription & Workspace Resource Quotas</h3>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-white/[0.01] border border-white/5 rounded-sm flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Workspace Tier</p>
                <p className="text-sm font-bold text-slate-100 uppercase tracking-wide mt-1">{userTier} Access</p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded">
                Active
              </span>
            </div>

            {userTier === 'free' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-black/40 border border-white/5 rounded-sm flex flex-col h-full relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Professional</h4>
                      <p className="text-xl font-bold text-slate-100 font-serif mt-2">$29<span className="text-xs text-slate-500"> / mo</span></p>
                    </div>
                    <Sparkles className="w-4 h-4 text-[#c5a059]" />
                  </div>
                  <ul className="text-[11px] text-slate-400 space-y-2 mt-5 flex-1 font-sans">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 500 Monthly Queries</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 100 Document Uploads</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Case Briefing Engine</li>
                  </ul>
                  <button 
                    onClick={() => handleCheckout('pro')}
                    disabled={billingLoading}
                    className="w-full mt-6 py-2.5 bg-[#c5a059] hover:bg-[#e0c286] text-black text-xs font-bold uppercase tracking-widest rounded-sm disabled:opacity-50 transition-colors"
                  >
                    {billingLoading ? 'Opening Stripe...' : 'Upgrade to Pro'}
                  </button>
                </div>

                <div className="p-5 bg-black/40 border border-white/5 rounded-sm flex flex-col h-full relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Enterprise</h4>
                      <p className="text-xl font-bold text-slate-100 font-serif mt-2">$99<span className="text-xs text-slate-500"> / mo</span></p>
                    </div>
                    <Shield className="w-4 h-4 text-[#c5a059]" />
                  </div>
                  <ul className="text-[11px] text-slate-400 space-y-2 mt-5 flex-1 font-sans">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Unlimited RAG Queries</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Unlimited Uploads</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Judge Analytics Integration</li>
                  </ul>
                  <button 
                    onClick={() => handleCheckout('enterprise')}
                    disabled={billingLoading}
                    className="w-full mt-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold uppercase tracking-widest rounded-sm disabled:opacity-50 transition-all"
                  >
                    {billingLoading ? 'Opening Stripe...' : 'Upgrade to Enterprise'}
                  </button>
                </div>
              </div>
            )}

            {userTier === 'pro' && (
              <div className="p-5 bg-black/40 border border-[#c5a059]/20 rounded-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Expand Chamber Scope</h4>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">Upgrade to **Enterprise** to unlock unlimited queries and Judge tendency analytics.</p>
                </div>
                <button 
                  onClick={() => handleCheckout('enterprise')}
                  disabled={billingLoading}
                  className="px-6 py-2.5 bg-[#c5a059] hover:bg-[#e0c286] text-black text-xs font-bold uppercase tracking-widest rounded-sm disabled:opacity-50 transition-colors shrink-0"
                >
                  {billingLoading ? 'Loading...' : 'Go Enterprise ($99)'}
                </button>
              </div>
            )}

            {userTier === 'enterprise' && (
              <div className="p-5 bg-emerald-950/10 border border-emerald-900/30 rounded-sm text-center">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Sovereign Access Level Achieved</h4>
                <p className="text-xs text-slate-400 font-sans leading-relaxed mt-2">Your enterprise subscription has been verified. You have unlimited access to all platform, RAG, and analytical assets.</p>
              </div>
            )}
          </div>
        </div>

        {/* Personal Info */}
        <div className={cardCls}>
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-sans">Personal Information</h3>
            <button onClick={() => setIsEditing(!isEditing)} className="text-xs text-[#c5a059] hover:text-[#c5a059]/80 font-sans transition">
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className={labelCls}>Username</label>
              <input type="text" disabled={!isEditing} value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Bio / Practice Area</label>
              <textarea disabled={!isEditing} value={formData.bio} rows="3"
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className={inputCls} placeholder="E.g., High Court Advocate specializing in Criminal Law..." />
            </div>
            {isEditing && (
              <button type="submit" className="px-5 py-2 bg-[#c5a059] hover:bg-[#c5a059]/80 text-black text-sm font-semibold rounded transition font-sans">
                Save Changes
              </button>
            )}
          </form>
        </div>

        {/* Change Password */}
        <div className={cardCls}>
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-5 font-sans">Change Password</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className={labelCls}>Current Password</label>
              <input type="password" required value={passwords.current_password}
                onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>New Password</label>
                <input type="password" required value={passwords.new_password}
                  onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                  className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Confirm New Password</label>
                <input type="password" required value={passwords.confirm_password}
                  onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
                  className={inputCls} />
              </div>
            </div>
            <button type="submit" className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-sm font-medium rounded transition font-sans">
              Update Password
            </button>
          </form>
        </div>

        {/* Platform Guide Reset */}
        <div className={cardCls}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-sans mb-1">Platform Guide</h3>
              <p className="text-[12px] text-slate-500 font-sans">Restore the platform guide banner on your dashboard if you dismissed it.</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('platform_guide_dismissed')
                alert('Platform Guide restored. Visit your dashboard to see it.')
              }}
              className="flex-shrink-0 ml-6 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold rounded transition font-sans">
              Restore Guide
            </button>
          </div>
        </div>

        {/* --- ADDED: Task — Three-Layer Secure Account Erasure (Red Zone) --- */}
        <div className="bg-red-950/5 border border-red-950/40 rounded p-6">
          <div className="flex items-center gap-2 mb-3">
            <Trash2 className="w-5 h-5 text-red-500" />
            <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider font-sans">Danger Zone</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans mb-6">
            Deleting your account will trigger a complete security wipe. All private documents, briefings, feedback logs, and metadata associations will be permanently erased. This action is cryptographically irreversible.
          </p>

          <button
            type="button"
            onClick={handleRequestDeleteOtp}
            disabled={requestingDelete}
            className="px-5 py-3 border border-red-900/50 hover:border-red-500 hover:bg-red-950/20 text-red-400 hover:text-red-100 text-xs font-bold uppercase tracking-widest rounded-sm transition-all"
          >
            {requestingDelete ? 'Requesting OTPs...' : 'Permanently Delete Chamber'}
          </button>
        </div>

      </div>

      {/* Account Deletion Dual-OTP Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0c10] border border-red-950/50 rounded-sm max-w-md w-full shadow-2xl relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
            
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-red-400 font-sans flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                Destructive Action Authorization
              </h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-slate-500 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVerifyDelete} className="p-6 space-y-6">
              <div className="text-center space-y-2">
                <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
                <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto font-sans">
                  Dual-verification codes have been dispatched to your active devices. Enter them to confirm permanent database sanitization.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-red-400" />
                    Email Deletion Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="6-digit email OTP"
                    maxLength="6"
                    value={deleteOtps.email_otp}
                    onChange={(e) => setDeleteOtps({ ...deleteOtps, email_otp: e.target.value })}
                    className="block w-full px-4 py-2.5 border border-white/10 rounded-sm bg-white/5 text-white tracking-widest text-center text-sm font-bold focus:outline-none focus:border-red-500 transition-all font-sans placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-red-400" />
                    SMS Deletion Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="6-digit SMS OTP"
                    maxLength="6"
                    value={deleteOtps.sms_otp}
                    onChange={(e) => setDeleteOtps({ ...deleteOtps, sms_otp: e.target.value })}
                    className="block w-full px-4 py-2.5 border border-white/10 rounded-sm bg-white/5 text-white tracking-widest text-center text-sm font-bold focus:outline-none focus:border-red-500 transition-all font-sans placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="w-1/2 py-3 border border-white/5 hover:border-white/10 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deletingAccount}
                  className="w-1/2 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] disabled:opacity-50"
                >
                  {deletingAccount ? 'Purging...' : 'Confirm Purge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}