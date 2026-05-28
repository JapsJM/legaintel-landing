import { useState, useEffect } from 'react';
import api from '../services/api'; 
import ImageUpload from '../components/ImageUpload';
import ImageViewer from '../components/ImageViewer';
import { useDocumentSocket } from '../hooks/useDocumentSocket';
import { Image, X, RotateCcw, Trash2 } from 'lucide-react';

const SecureThumbnail = ({ mediaId, filename }) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [error, setError]   = useState(false);

  useEffect(() => {
    let objectUrl = null;
    const fetchImage = async () => {
      try {
        const response = await api.get(`/media/${mediaId}/file`, {
          responseType: 'blob'
        });
        objectUrl = URL.createObjectURL(response.data);
        setImgSrc(objectUrl);
      } catch { 
        setError(true); 
      }
    };
    fetchImage();
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [mediaId]);

  if (error || !imgSrc) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white/[0.02] text-slate-600">
        <Image className="w-6 h-6" />
      </div>
    );
  }
  return <img src={imgSrc} alt={filename} className="w-full h-full object-cover" />;
};

const statusBadge = (status) => {
  const styles = {
    ready:      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    processing: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    failed:     'bg-red-500/10 text-red-400 border-red-500/20',
    uploading:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };
  return (
    <span className={`px-2 py-0.5 text-[10px] font-medium rounded border uppercase tracking-wider font-sans ${styles[status] || 'bg-white/5 text-slate-400 border-white/10'}`}>
      {status}
    </span>
  );
};

export default function MediaLibrary() {
  const [media, setMedia]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  // --- FIX: Track selectedMediaId dynamically to prevent stale states ---
  const [selectedMediaId, setSelectedMediaId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showUpload, setShowUpload]     = useState(false);

  // Dynamically resolve the active media object from the updated state array
  const selectedMedia = media.find(m => m.id === selectedMediaId);

  useEffect(() => { fetchMedia(); }, [filterStatus]);

  useDocumentSocket((data) => {
    setMedia(prev => prev.map(item => {
      if (item.id === data.doc_id) {
        return { 
          ...item, 
          status: (data.status === 'ready' || data.status === 'activated') ? 'ready' : data.status 
        };
      }
      return item;
    }));
  });

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const params = filterStatus !== 'all' ? { status: filterStatus } : {};
      const response = await api.get('/media', { params });
      setMedia(response.data.media || []);
      setError(null);
    } catch {
      setError('Failed to load media library');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (mediaId) => {
    if (!confirm('Delete this image?')) return;
    try {
      await api.delete(`/media/${mediaId}`);
      setMedia(prev => prev.filter(m => m.id !== mediaId));
      if (selectedMediaId === mediaId) setSelectedMediaId(null);
    } catch { 
      alert('Failed to delete image'); 
    }
  };

  const handleReprocess = async (mediaId) => {
    try {
      await api.post(`/media/${mediaId}/reprocess`);
      setMedia(prev => prev.map(m => m.id === mediaId ? { ...m, status: 'processing' } : m));
      setTimeout(fetchMedia, 2000);
    } catch { 
      alert('Failed to reprocess image'); 
    }
  };

  const filters = ['all', 'ready', 'processing', 'failed'];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">

        <button onClick={() => window.location.href = '/dashboard'}
          className="text-xs text-slate-500 hover:text-slate-300 transition mb-6 font-sans">
          ← Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-xl font-semibold text-slate-100 font-sans">Media Library</h1>
          <p className="text-sm text-slate-500 mt-1 font-sans">Upload and analyze legal document images with AI vision</p>
        </div>

        {/* Filter + Upload bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            {filters.map(f => (
              <button key={f} onClick={() => setFilterStatus(f)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition font-sans ${filterStatus === f ? 'bg-[#c5a059] text-black' : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'}`}>
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button onClick={() => setShowUpload(true)}
            className="px-4 py-1.5 bg-[#c5a059] hover:bg-[#c5a059]/80 text-black text-xs font-semibold rounded transition font-sans">
            Upload Images
          </button>
        </div>

        {/* Upload modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#0a0c10] border border-white/10 rounded p-6 max-w-xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-semibold text-slate-100 font-sans">Upload Images</h2>
                <button onClick={() => setShowUpload(false)} className="text-slate-500 hover:text-slate-200 transition">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ImageUpload onUploadComplete={() => { setShowUpload(false); fetchMedia(); }} />
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <svg className="w-5 h-5 animate-spin text-[#c5a059]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-950/20 border border-red-900/30 rounded text-red-300 text-sm font-sans">{error}</div>
        ) : media.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4">
              <Image className="w-6 h-6 text-slate-600" />
            </div>
            <p className="text-slate-300 text-sm font-semibold font-sans mb-1">No images yet</p>
            <p className="text-slate-500 text-xs font-sans mb-4">Upload images to analyze with AI vision</p>
            <button onClick={() => setShowUpload(true)}
              className="px-4 py-2 bg-[#c5a059] hover:bg-[#c5a059]/80 text-black text-xs font-semibold rounded transition font-sans">
              Upload Your First Image
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map(item => (
              <div key={item.id}
                className="bg-[#0a0c10] border border-white/5 rounded overflow-hidden hover:border-white/10 transition cursor-pointer"
                onClick={() => setSelectedMediaId(item.id)}>
                <div className="h-40 overflow-hidden">
                  {item.status === 'ready' ? (
                    <SecureThumbnail mediaId={item.id} filename={item.filename} />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-white/[0.02] text-slate-500 text-xs font-sans gap-2">
                      {item.status === 'processing' && (
                        <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                        </svg>Processing…</>
                      )}
                      {item.status === 'failed' && <><Image className="w-5 h-5 text-red-400" />Failed</>}
                      {item.status === 'uploading' && <><Image className="w-5 h-5" />Uploading…</>}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-start mb-1.5">
                    <p className="text-xs text-slate-200 truncate flex-1 font-sans">{item.filename}</p>
                    {statusBadge(item.status)}
                  </div>
                  <p className="text-[10px] text-slate-500 font-sans">{new Date(item.uploaded_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedMedia && (
          <ImageViewer
            media={selectedMedia}
            onClose={() => setSelectedMediaId(null)}
            onDelete={handleDelete}
            onReprocess={handleReprocess}
          />
        )}
      </div>
    </div>
  );
}