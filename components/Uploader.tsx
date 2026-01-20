
import React, { useState } from 'react';
import { Chapter } from '../types';

interface UploaderProps {
  onUpload: (chapters: Chapter[]) => void;
}

const Uploader: React.FC<UploaderProps> = ({ onUpload }) => {
  const [rawText, setRawText] = useState('');
  const [moduleNum, setModuleNum] = useState(1);
  const [lessonStart, setLessonStart] = useState(1);

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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <i className="fas fa-plus-circle text-indigo-500"></i>
          Add Source Content
        </h2>
        
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
            placeholder="Paste book chapter text here..."
            className="w-full h-80 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm leading-relaxed"
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
          <p>For your 48 selected chapters, paste them one by one. The AI will strictly follow the localized Azerbaijani formatting rules, including Baku context and Baku brands.</p>
        </div>
      </div>
    </div>
  );
};

export default Uploader;
