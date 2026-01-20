
import React, { useState, useRef } from 'react';
import { Chapter } from '../types';

interface UploaderProps {
  onUpload: (chapters: Chapter[]) => void;
}

const Uploader: React.FC<UploaderProps> = ({ onUpload }) => {
  const [rawText, setRawText] = useState('');
  const [moduleNum, setModuleNum] = useState(1);
  const [lessonStart, setLessonStart] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleManualAdd = () => {
    if (!rawText.trim()) return;
    
    const newChapter: Chapter = {
      id: Math.random().toString(36).substr(2, 9),
      title: `Chapter Excerpt: Module ${moduleNum}, Lesson ${lessonStart}`,
      content: rawText,
      moduleNumber: moduleNum,
      lessonNumber: lessonStart,
      status: 'pending',
    };
    
    onUpload([newChapter]);
    setRawText('');
    setLessonStart(prev => prev + 1);
  };

  const handleFileRead = (file: File) => {
    if (file.type === 'text/plain' || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          // Instead of just setting text, let's create a chapter immediately for files
          // to make batch processing of 48 files easier
          const fileName = file.name.replace(/\.[^/.]+$/, "");
          const newChapter: Chapter = {
            id: Math.random().toString(36).substr(2, 9),
            title: fileName,
            content: content,
            moduleNumber: moduleNum,
            lessonNumber: lessonStart,
            status: 'pending',
          };
          onUpload([newChapter]);
          setLessonStart(prev => prev + 1);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Fix: Cast Array.from result to File[] to satisfy TypeScript's strict typing
      (Array.from(e.dataTransfer.files) as File[]).forEach(file => handleFileRead(file));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <i className="fas fa-plus-circle text-indigo-500"></i>
          Add Source Content
        </h2>

        {/* File Drop Zone */}
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mb-8 border-2 border-dashed rounded-2xl p-10 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
            isDragging 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => {
              // Fix: Cast Array.from result to File[] to satisfy TypeScript's strict typing
              if (e.target.files) (Array.from(e.target.files) as File[]).forEach(file => handleFileRead(file));
            }}
            multiple 
            accept=".md,.txt" 
            className="hidden" 
          />
          <div className="bg-indigo-100 text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl">
            <i className="fas fa-file-upload"></i>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-700">Faylları bura at (Drag & Drop)</p>
            <p className="text-sm text-gray-500">Və ya kliklə ki, .md və ya .txt faylları seçəsən</p>
          </div>
        </div>

        <div className="relative flex items-center mb-8">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm font-bold uppercase tracking-widest">Və ya köhnə qayda ilə (Paste)</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Module Number (1-7)</label>
            <input 
              type="number" 
              value={moduleNum}
              onChange={e => setModuleNum(parseInt(e.target.value))}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Lesson Number (1-26)</label>
            <input 
              type="number" 
              value={lessonStart}
              onChange={e => setLessonStart(parseInt(e.target.value))}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Chapter Raw Text (Paste from Word/PDF)</label>
          <textarea
            value={rawText}
            onChange={e => setRawText(e.target.value)}
            placeholder="Mətni bura yapışdır..."
            className="w-full h-60 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm leading-relaxed"
          ></textarea>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleManualAdd}
            className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
          >
            Add to Processing Queue
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl flex gap-4">
        <i className="fas fa-info-circle text-amber-500 text-xl mt-1"></i>
        <div className="text-amber-800 text-sm">
          <p className="font-bold mb-1">Batch Suggestion</p>
          <p>48 dərsin hamısını birdən bura ata bilərsən. Sistem onları avtomatik növbəyə yığacaq və hər birini Bakı stilində dərslərə çevirəcək.</p>
        </div>
      </div>
    </div>
  );
};

export default Uploader;
