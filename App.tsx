
import React, { useState, useRef } from 'react';
import { Chapter, Tab } from './types';
import { DEFAULT_SYSTEM_PROMPT, MODELS } from './constants';
import { generateSmmLesson } from './services/geminiService';

// Components
import Sidebar from './components/Sidebar';
import Uploader from './components/Uploader';
import ProcessingQueue from './components/ProcessingQueue';
import Settings from './components/Settings';
import LessonPreview from './components/LessonPreview';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('upload');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Ref to track processing state across async cycles to prevent race conditions
  const isRunningRef = useRef(false);

  const addChapters = (newChapters: Chapter[]) => {
    setChapters(prev => [...prev, ...newChapters]);
    setActiveTab('queue');
  };

  const runBatch = async () => {
    if (isRunningRef.current) return;
    
    isRunningRef.current = true;
    setIsProcessing(true);

    // Process chapters sequentially
    while (isRunningRef.current) {
      // Use local variable to find the next pending task from current chapters state
      const currentChapters = [...chapters];
      const nextIndex = currentChapters.findIndex(c => c.status === 'pending');

      if (nextIndex === -1) {
        isRunningRef.current = false;
        break;
      }

      const chapterToProcess = currentChapters[nextIndex];

      // Mark current item as processing in state
      setChapters(prev => prev.map((c, i) => 
        i === nextIndex ? { ...c, status: 'processing' } : c
      ));

      try {
        const lesson = await generateSmmLesson(chapterToProcess, systemPrompt, selectedModel);
        
        // Mark as completed
        setChapters(prev => prev.map((c, i) => 
          i === nextIndex ? { ...c, status: 'completed', generatedLesson: lesson } : c
        ));
        
        // Small update to local copy to keep while loop logic aware (though setChapters is async)
        currentChapters[nextIndex].status = 'completed';
      } catch (err: any) {
        console.error("Batch processing error:", err);
        setChapters(prev => prev.map((c, i) => 
          i === nextIndex ? { ...c, status: 'error', error: err.message } : c
        ));
        currentChapters[nextIndex].status = 'error';
      }
    }
    
    setIsProcessing(false);
    isRunningRef.current = false;
  };

  const stopBatch = () => {
    isRunningRef.current = false;
    setIsProcessing(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-gray-800">SMM Content Factory</h1>
            <p className="text-sm text-gray-500">Professional Training: Theory to Client-Ready SMM</p>
          </div>
          
          <div className="flex gap-4">
            {isProcessing ? (
              <button 
                onClick={stopBatch}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <i className="fas fa-stop"></i> Stop Batch
              </button>
            ) : (
              <button 
                onClick={runBatch}
                disabled={chapters.filter(c => c.status === 'pending').length === 0}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md"
              >
                <i className="fas fa-play"></i> Run 48-Chapter Batch
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'upload' && <Uploader onUpload={addChapters} />}
          {activeTab === 'queue' && (
            <ProcessingQueue 
              chapters={chapters} 
              onPreview={(id) => {
                setActiveTab('preview');
              }}
            />
          )}
          {activeTab === 'settings' && (
            <Settings 
              prompt={systemPrompt} 
              setPrompt={setSystemPrompt}
              model={selectedModel}
              setModel={setSelectedModel}
            />
          )}
          {activeTab === 'preview' && (
            <LessonPreview 
              lessons={chapters.filter(c => c.status === 'completed')} 
              onBack={() => setActiveTab('queue')}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
