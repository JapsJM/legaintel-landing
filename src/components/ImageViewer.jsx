import { useState, useEffect } from 'react';
// --- FIX: Import pre-configured api instance instead of raw fetch ---
import api from '../services/api';
import { X, Check, Download, RotateCcw, Trash2 } from 'lucide-react';

const labelCls = "text-[10px] font-medium text-slate-500 uppercase tracking-wider font-sans";
const valueCls = "text-sm text-slate-200 font-sans mt-0.5";

export default function ImageViewer({ media, onClose, onDelete, onReprocess }) {
  const [activeTab, setActiveTab] = useState('preview');
  const [imageUrl, setImageUrl]   = useState(null);

  useEffect(() => {
    let objectUrl = null;
    if (media?.status === 'ready') {
      const fetchImage = async () => {
        try {
          // Fetch cleanly through /api proxy mapping with authentication
          const response = await api.get(`/media/${media.id}/file`, {
            responseType: 'blob'
          });
          objectUrl = URL.createObjectURL(response.data);
          setImageUrl(objectUrl);
        } catch (err) {
          console.error('Failed to load image preview', err);
        }
      };
      fetchImage();
    }
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [media]);

  if (!media) return null;

  const formatFileSize = (bytes) => {
    if (!bytes) return '—';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const confidenceColor = (c) => {
    if (c >= 0.8) return 'text-emerald-400';
    if (c >= 0.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const handleDownload = async () => {
    try {
      const response = await api.get(`/media/${media.id}/file`, {
        responseType: 'blob'
      });
      const url  = window.URL.createObjectURL(response.data);
      const a    = document.createElement('a');
      a.href = url; a.download = media.filename;
      document.body.appendChild(a); a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      alert('Failed to download image.');
    }
  };

  const handleDownloadAnalysis = () => {
    try {
      const analysis = media.analysis || {};
      const lines = [
        `AETHERIUS — IMAGE ANALYSIS REPORT`,
        `=====================================`,
        `File: ${media.filename}`,
        `Analysed: ${media.processed_at ? new Date(media.processed_at).toLocaleString() : '—'}`,
        `Confidence: ${analysis.confidence !== undefined ? (analysis.confidence * 100).toFixed(0) + '%' : '—'}`,
        `Document Type: ${analysis.document_type || '—'}`,
        ``,
        `EXTRACTED TEXT`,
        `--------------`,
        analysis.text_content || 'No text extracted.',
        ``,
        `DETECTIONS`,
        `----------`,
        `Stamps / Seals: ${analysis.has_stamp ? 'Yes' : 'No'}`,
        analysis.stamps?.length > 0 ? analysis.stamps.map(s => `  - ${s.type} at ${s.location}`).join('\n') : '',
        `Handwriting: ${analysis.has_handwriting ? 'Yes' : 'No'}`,
        analysis.handwriting_notes ? `  Notes: ${analysis.handwriting_notes}` : '',
        `Tables: ${analysis.has_tables ? 'Yes' : 'No'}`,
        analysis.tables?.length > 0 ? analysis.tables.map(t => `  - ${t.description}`).join('\n') : '',
      ].filter(l => l !== undefined).join('\n');

      const blob = new Blob([lines], { type: 'text/plain' });
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement('a');
      const safeName = media.filename.replace(/\.[^/.]+$/, '');
      a.href = url; a.download = `${safeName}_analysis.txt`;
      document.body.appendChild(a); a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      alert('Failed to download analysis.');
    }
  };

  const DetectionCard = ({ label, detected, count, color }) => (
    <div className={`p-4 rounded border ${detected ? `bg-${color}-500/5 border-${color}-500/20` : 'bg-white/[0.02] border-white/5'}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-300 font-sans">{label}</span>
        {detected
          ? <Check className={`w-4 h-4 text-${color}-400`} />
          : <X className="w-4 h-4 text-slate-600" />}
      </div>
      {count > 0 && <p className="text-[10px] text-slate-500 font-sans">{count} detected</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0c10] border border-white/10 rounded max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/5">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-100 truncate font-sans">{media.filename}</h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Uploaded {new Date(media.uploaded_at).toLocaleString()}
            </p>
          </div>
          <button onClick={onClose} className="ml-4 text-slate-500 hover:text-slate-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/5 px-6 flex gap-6">
          {['preview', 'analysis', 'metadata'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`py-3 text-xs font-medium border-b-2 transition font-sans ${
                activeTab === tab
                  ? 'border-[#c5a059] text-[#c5a059]'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* Preview */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="flex justify-center items-center min-h-48">
                {media.status === 'ready' && imageUrl ? (
                  <img src={imageUrl} alt={media.filename} className="max-w-full max-h-[60vh] object-contain rounded" />
                ) : media.status === 'processing' ? (
                  <div className="text-center py-12">
                    <svg className="w-8 h-8 animate-spin text-[#c5a059] mx-auto mb-3" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    <p className="text-slate-400 text-sm font-sans">Processing image...</p>
                  </div>
                ) : media.status === 'failed' ? (
                  <div className="text-center py-12">
                    <p className="text-red-400 text-sm font-semibold font-sans mb-2">Processing Failed</p>
                    <p className="text-slate-500 text-xs font-sans mb-4">{media.error || 'Unknown error'}</p>
                    <button onClick={() => onReprocess(media.id)}
                      className="px-4 py-2 bg-[#c5a059] hover:bg-[#c5a059]/80 text-black text-xs font-semibold rounded transition font-sans">
                      Retry Processing
                    </button>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm font-sans">Uploading...</p>
                )}
              </div>
              {media.status === 'ready' && (
                <div className="flex justify-center">
                  <button onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 border border-white/10 text-slate-300 text-xs rounded hover:bg-white/5 transition font-sans">
                    <Download className="w-3.5 h-3.5" /> Download Image
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Analysis */}
          {activeTab === 'analysis' && (
            <div className="space-y-5">
              {media.status !== 'ready' ? (
                <p className="text-center py-12 text-slate-500 text-sm font-sans">
                  {media.status === 'processing' ? 'Analysis in progress...' : 'No analysis available yet'}
                </p>
              ) : (
                <>
                  {/* Confidence */}
                  {media.analysis?.confidence !== undefined && (
                    <div className="bg-white/[0.02] border border-white/5 rounded p-4">
                      <p className={labelCls}>Analysis Confidence</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex-1 bg-white/5 rounded-full h-1.5">
                          <div className="bg-[#c5a059] h-1.5 rounded-full transition-all"
                            style={{ width: `${media.analysis.confidence * 100}%` }} />
                        </div>
                        <span className={`text-sm font-semibold font-sans ${confidenceColor(media.analysis.confidence)}`}>
                          {(media.analysis.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Detection cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <DetectionCard label="Stamps / Seals" detected={media.analysis?.has_stamp} count={media.analysis?.stamp_locations?.length || 0} color="emerald" />
                    <DetectionCard label="Handwriting" detected={media.analysis?.has_handwriting} count={0} color="purple" />
                    <DetectionCard label="Tables" detected={media.analysis?.tables?.length > 0} count={media.analysis?.tables?.length || 0} color="blue" />
                    <DetectionCard label="Searchable" detected={media.embedded} count={0} color="emerald" />
                  </div>

                  {/* Extracted text */}
                  {media.analysis?.text_content && (
                    <div className="bg-white/[0.02] border border-white/5 rounded p-4">
                      <p className={`${labelCls} mb-3`}>Extracted Text</p>
                      <div className="bg-[#050505] border border-white/5 rounded p-4 max-h-56 overflow-y-auto">
                        <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                          {media.analysis.text_content}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Download Analysis */}
                  <div className="flex justify-end">
                    <button onClick={handleDownloadAnalysis}
                      className="flex items-center gap-2 px-4 py-2 border border-white/10 text-slate-300 text-xs rounded hover:bg-white/5 transition font-sans">
                      <Download className="w-3.5 h-3.5" /> Download Analysis
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Metadata */}
          {activeTab === 'metadata' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'File Type',  value: media.file_type },
                  { label: 'MIME Type',  value: media.mime_type },
                  { label: 'File Size',  value: formatFileSize(media.file_size) },
                  { label: 'Status',     value: media.status },
                  { label: 'Uploaded',   value: new Date(media.uploaded_at).toLocaleString() },
                  media.processed_at && { label: 'Processed', value: new Date(media.processed_at).toLocaleString() },
                ].filter(Boolean).map(({ label, value }) => (
                  <div key={label}>
                    <p className={labelCls}>{label}</p>
                    <p className={valueCls}>{value || '—'}</p>
                  </div>
                ))}
              </div>

              {media.case_metadata && Object.keys(media.case_metadata).length > 0 && (
                <div className="border-t border-white/5 pt-4">
                  <p className={`${labelCls} mb-3`}>Case Information</p>
                  <div className="grid grid-cols-2 gap-4">
                    {media.case_metadata.case_id && (
                      <div><p className={labelCls}>Case ID</p><p className={valueCls}>{media.case_metadata.case_id}</p></div>
                    )}
                    {media.case_metadata.exhibit_number && (
                      <div><p className={labelCls}>Exhibit Number</p><p className={valueCls}>{media.case_metadata.exhibit_number}</p></div>
                    )}
                    {media.case_metadata.description && (
                      <div className="col-span-2"><p className={labelCls}>Description</p><p className={valueCls}>{media.case_metadata.description}</p></div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/5 px-6 py-4 flex justify-between items-center">
          <button onClick={() => onDelete(media.id)}
            className="flex items-center gap-2 px-3 py-1.5 border border-red-900/30 text-red-400 text-xs rounded hover:bg-red-950/20 transition font-sans">
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
          <div className="flex gap-2">
            {(media.status === 'failed' || media.status === 'ready') && (
              <button onClick={() => onReprocess(media.id)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#c5a059] hover:bg-[#c5a059]/80 text-black text-xs font-semibold rounded transition font-sans">
                <RotateCcw className="w-3.5 h-3.5" /> Reprocess
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}