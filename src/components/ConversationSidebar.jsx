import React from 'react';
import { Plus, MessageSquare, Trash2, Search, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ConversationSidebar({ sessions, activeId, onSelect, onNew, onDeleted }) {
  return (
    <div className="flex flex-col h-full bg-[#0a0c10]">
      {/* Top Actions Area */}
      <div className="p-6 pb-4 space-y-3">
        {/* New Chat Button - Gold */}
        <button
          onClick={onNew}
          className="w-full flex items-center justify-center gap-2 bg-[#c5a059] hover:bg-[#b38f48] text-black py-3 rounded-sm text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-[0_4px_20px_rgba(197,160,89,0.2)]"
        >
          <Plus className="w-4 h-4" />
          New Research
        </button>


      </div>

      {/* Search Bar */}
      <div className="px-6 mb-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 group-focus-within:text-[#c5a059] transition-colors" />
          <input 
            type="text" 
            placeholder="Search history..." 
            className="w-full bg-white/[0.02] border border-white/5 rounded-sm py-2 pl-9 pr-4 text-xs text-slate-300 focus:outline-none focus:border-[#c5a059]/30 transition-all"
          />
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
        {sessions.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-[10px] text-slate-600 uppercase tracking-widest">No history found</p>
          </div>
        ) : (
          sessions.map((s) => (
            <div
              key={s.id}
              className={`group flex items-center justify-between p-3 rounded-sm cursor-pointer transition-all ${
                activeId === s.id 
                  ? 'bg-white/5 border-l-2 border-[#c5a059] text-white' 
                  : 'text-slate-500 hover:bg-white/[0.02] hover:text-slate-300'
              }`}
              onClick={() => onSelect(s.id)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${activeId === s.id ? 'text-[#c5a059]' : 'text-slate-700'}`} />
                <span className="text-xs truncate font-medium tracking-tight">
                  {s.title || 'Untitled Research'}
                </span>
              </div>
              
              {onDeleted && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleted(s.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}