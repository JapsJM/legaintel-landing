import { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Paperclip } from 'lucide-react';

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto relative">
      <div className="relative flex items-end gap-2 bg-[#0a0c10] border border-white/10 rounded-sm p-2 focus-within:border-[#c5a059]/40 transition-all shadow-2xl">
        
        {/* Attachment Button */}
        <button className="p-3 text-slate-600 hover:text-slate-300 transition-colors">
          <Paperclip className="w-4 h-4" />
        </button>

        <textarea
          ref={textareaRef}
          rows="1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter legal proposition or query..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-slate-200 placeholder-slate-600 py-3 text-sm resize-none max-h-48 custom-scrollbar"
          disabled={disabled}
        />

        {/* Send Button - Re-skinned to Gold */}
        <button
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          className={`p-3 rounded-sm transition-all ${
            text.trim() && !disabled
              ? 'bg-[#c5a059] text-black shadow-[0_0_15px_rgba(197,160,89,0.3)]'
              : 'bg-white/5 text-slate-700 cursor-not-allowed'
          }`}
        >
          <SendHorizontal className="w-4 h-4" />
        </button>
      </div>
      
      <div className="mt-3 flex justify-center">
        <p className="text-[9px] text-slate-700 uppercase tracking-[0.2em] font-bold">
          Shift + Enter for new line • Encrypted Research Session
        </p>
      </div>
    </div>
  );
}