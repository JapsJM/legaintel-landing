// --- START OF FILE: src/pages/AdminMappings.jsx ---

import React, { useState, useEffect } from 'react';
import { BookCopy, Plus, Search, Edit, Trash2, AlertCircle, X } from 'lucide-react';
import api from '../services/api'; // Assuming you have a configured axios instance

const AdminMappings = () => {
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMapping, setCurrentMapping] = useState(null);

  const fetchMappings = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/mappings?search=${searchTerm}`);
      setMappings(response.data);
    } catch (err) {
      setError('Failed to fetch mappings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMappings();
  }, [searchTerm]);

  const handleOpenModal = (mapping = null) => {
    setCurrentMapping(mapping || { old_act: 'IPC', old_section: '', new_act: 'BNS', new_section: '', new_title: '', legislative_changes: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentMapping(null);
  };

  const handleSave = async () => {
    try {
      if (currentMapping._id) {
        // Update
        await api.put(`/admin/mappings/${currentMapping._id}`, currentMapping);
      } else {
        // Create
        await api.post('/admin/mappings', currentMapping);
      }
      fetchMappings();
      handleCloseModal();
    } catch (err) {
      alert('Failed to save mapping.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this mapping?')) {
      try {
        await api.delete(`/admin/mappings/${id}`);
        fetchMappings();
      } catch (err) {
        alert('Failed to delete mapping.');
      }
    }
  };

  return (
    <div className="bg-[#050505] text-slate-200 p-6 lg:p-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white flex items-center gap-3">
            <BookCopy className="text-[#c5a059]" size={32} />
            Statutory Mapping Console
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Live management of the legal transition database.
          </p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-[#c5a059] hover:bg-[#b38f48] text-black font-bold text-xs px-4 py-2 rounded-sm transition-colors">
          <Plus size={16} />
          ADD NEW MAPPING
        </button>
      </div>

      <div className="mb-6 max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search mappings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0a0c10] border border-white/10 text-white rounded-sm py-2 pl-10 pr-4 focus:outline-none focus:border-[#c5a059]"
          />
          <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
        </div>
      </div>

      {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
        <div className="bg-[#0a0c10] border border-white/5 rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-xs uppercase text-slate-400 tracking-wider">
              <tr>
                <th className="p-3 text-left">Old Law</th>
                <th className="p-3 text-left">New Law</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mappings.map(m => (
                <tr key={m._id} className="hover:bg-white/[0.02]">
                  <td className="p-3 font-mono">{m.old_act} Sec. {m.old_section}</td>
                  <td className="p-3 font-mono text-[#c5a059]">{m.new_act} Sec. {m.new_section}</td>
                  <td className="p-3 text-slate-400">{m.new_title}</td>
                  <td className="p-3 text-center">
                    <button onClick={() => handleOpenModal(m)} className="p-1 text-slate-500 hover:text-white"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(m._id)} className="p-1 text-slate-500 hover:text-red-500"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#0a0c10] border border-white/10 rounded-md shadow-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">{currentMapping._id ? 'Edit' : 'Create'} Mapping</h2>
              <button onClick={handleCloseModal} className="text-slate-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              {/* Form fields would go here, this is a simplified example */}
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Old Act (e.g., IPC)" value={currentMapping.old_act} onChange={e => setCurrentMapping({...currentMapping, old_act: e.target.value})} className="bg-[#050505] border border-white/10 p-2 rounded-sm" />
                <input type="text" placeholder="Old Section" value={currentMapping.old_section} onChange={e => setCurrentMapping({...currentMapping, old_section: e.target.value})} className="bg-[#050505] border border-white/10 p-2 rounded-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="New Act (e.g., BNS)" value={currentMapping.new_act} onChange={e => setCurrentMapping({...currentMapping, new_act: e.target.value})} className="bg-[#050505] border border-white/10 p-2 rounded-sm" />
                <input type="text" placeholder="New Section" value={currentMapping.new_section} onChange={e => setCurrentMapping({...currentMapping, new_section: e.target.value})} className="bg-[#050505] border border-white/10 p-2 rounded-sm" />
              </div>
              <input type="text" placeholder="New Title" value={currentMapping.new_title} onChange={e => setCurrentMapping({...currentMapping, new_title: e.target.value})} className="bg-[#050505] border border-white/10 p-2 rounded-sm" />
              <textarea placeholder="Legislative Changes..." value={currentMapping.legislative_changes} onChange={e => setCurrentMapping({...currentMapping, legislative_changes: e.target.value})} className="bg-[#050505] border border-white/10 p-2 rounded-sm w-full h-24" />
              <div className="flex justify-end gap-4">
                <button onClick={handleCloseModal} className="text-slate-400">Cancel</button>
                <button onClick={handleSave} className="bg-[#c5a059] text-black font-bold px-4 py-2 rounded-sm">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMappings;

// --- END OF FILE ---