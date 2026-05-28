import { useState } from 'react';
import { Star, CheckCircle, AlertCircle, Loader2, MessageSquarePlus } from 'lucide-react';
import { submitUserFeedback } from '../services/feedback';

const CATEGORIES = ['Bug Report', 'Feature Request', 'General', 'Billing'];

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

export default function SubmitFeedback() {
  const [subject, setSubject]   = useState('');
  const [category, setCategory] = useState('');
  const [rating, setRating]     = useState(0);
  const [hovered, setHovered]   = useState(0);
  const [message, setMessage]   = useState('');

  const [status, setStatus]         = useState('idle'); // idle | loading | success | error
  const [referenceId, setReferenceId] = useState('');
  const [errorMsg, setErrorMsg]     = useState('');

  const isValid = subject.trim() && category && rating > 0 && message.trim();

  const handleSubmit = async () => {
    if (!isValid || status === 'loading') return;
    setStatus('loading');
    setErrorMsg('');
    try {
      const result = await submitUserFeedback({
        subject: subject.trim(),
        category,
        rating,
        message: message.trim(),
        page_url: window.location.href,
      });
      setReferenceId(result.reference_id || '');
      setStatus('success');
    } catch (err) {
      const msg = err?.response?.data?.error || 'Submission failed. Please try again.';
      setErrorMsg(msg);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">

      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-md bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center">
            <MessageSquarePlus className="w-4 h-4 text-[#c5a059]" />
          </div>
          <p className="text-[11px] font-bold text-[#c5a059] uppercase tracking-[0.2em]">Feedback</p>
        </div>
        <h1 className="text-3xl font-serif text-white tracking-tight">Share Your Feedback</h1>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          Help us improve LegAIntel. Our team reviews every submission within 48 hours.
        </p>
        <div className="h-px w-16 bg-[#c5a059] mt-5 opacity-50" />
      </div>

      {/* Success State */}
      {status === 'success' ? (
        <div className="bg-[#0a0c10] border border-white/7 rounded-xl p-10 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-7 h-7 text-emerald-400" />
          </div>
          <h2 className="text-xl font-serif text-white mb-2">Feedback Received</h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-md mx-auto">
            Thank you. Our team will review your submission and respond within 48 hours.
            For urgent queries, contact{' '}
            <a href="mailto:info.legaintel@gmail.com" className="text-[#c5a059] hover:underline">
              info.legaintel@gmail.com
            </a>
          </p>
          {referenceId && (
            <div className="inline-block bg-[#c5a059]/7 border border-[#c5a059]/20 rounded-lg px-8 py-5 mb-8">
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-2">Your Reference ID</p>
              <p className="text-xl font-mono font-bold text-[#c5a059] tracking-wider">{referenceId}</p>
              <p className="text-[11px] text-slate-600 mt-2">Keep this when following up with support</p>
            </div>
          )}
          <button
            onClick={() => {
              setStatus('idle');
              setSubject('');
              setCategory('');
              setRating(0);
              setMessage('');
              setReferenceId('');
            }}
            className="px-6 py-2.5 text-sm font-semibold text-slate-400 border border-white/10 rounded-md hover:text-white hover:bg-white/5 transition-all"
          >
            Submit Another
          </button>
        </div>
      ) : (
        /* Form */
        <div className="bg-[#0a0c10] border border-white/7 rounded-xl overflow-hidden">

          <div className="p-8 space-y-7">

            {/* Error Banner — stays on error, does not reset form */}
            {status === 'error' && (
              <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 rounded-lg px-4 py-3.5">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-sm text-red-400">{errorMsg}</p>
              </div>
            )}

            {/* Subject */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2.5">
                Subject <span className="text-[#c5a059]">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description of your feedback…"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#c5a059]/40 focus:ring-1 focus:ring-[#c5a059]/20 transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2.5">
                Category <span className="text-[#c5a059]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`py-2.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      category === cat
                        ? 'bg-[#c5a059]/15 border-[#c5a059]/40 text-[#c5a059]'
                        : 'bg-black/20 border-white/8 text-slate-500 hover:text-slate-300 hover:border-white/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2.5">
                Rating <span className="text-[#c5a059]">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                    aria-label={`Rate ${star} out of 5`}
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hovered || rating)
                          ? 'text-[#c5a059] fill-[#c5a059]'
                          : 'text-slate-700'
                      }`}
                    />
                  </button>
                ))}
                {(hovered || rating) > 0 && (
                  <span className="ml-2 text-xs text-slate-500 font-medium">
                    {RATING_LABELS[hovered || rating]}
                  </span>
                )}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2.5">
                Message <span className="text-[#c5a059]">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Describe your experience, the issue you encountered, or the feature you'd like to see…"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#c5a059]/40 focus:ring-1 focus:ring-[#c5a059]/20 transition-all resize-none leading-relaxed"
              />
              <p className="mt-1.5 text-[11px] text-slate-600">
                {message.trim().length > 0
                  ? `${message.trim().length} characters`
                  : 'Required — please provide details'}
              </p>
            </div>

          </div>

          {/* Footer / Submit */}
          <div className="px-8 py-5 bg-black/30 border-t border-white/5 flex items-center justify-between">
            <p className="text-[11px] text-slate-600">
              All fields marked <span className="text-[#c5a059]">*</span> are required
            </p>
            <button
              onClick={handleSubmit}
              disabled={!isValid || status === 'loading'}
              className={`flex items-center gap-2.5 px-7 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all ${
                !isValid || status === 'loading'
                  ? 'bg-white/5 text-slate-600 cursor-not-allowed'
                  : 'bg-[#c5a059] text-black hover:bg-[#d4b06a] cursor-pointer shadow-lg shadow-[#c5a059]/10'
              }`}
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                'Submit Feedback'
              )}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
