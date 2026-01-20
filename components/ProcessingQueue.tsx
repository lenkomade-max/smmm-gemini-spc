
import React from 'react';
import { Chapter } from '../types';

interface ProcessingQueueProps {
  chapters: Chapter[];
  onPreview: (id: string) => void;
}

const ProcessingQueue: React.FC<ProcessingQueueProps> = ({ chapters, onPreview }) => {
  if (chapters.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
        <i className="fas fa-inbox text-5xl text-gray-300 mb-4"></i>
        <p className="text-gray-500 font-medium">Queue is empty. Add chapters to get started.</p>
      </div>
    );
  }

  const getStatusBadge = (status: Chapter['status']) => {
    switch (status) {
      case 'pending': return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase">Pending</span>;
      case 'processing': return <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase animate-pulse">Generating...</span>;
      case 'completed': return <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold uppercase">Ready</span>;
      case 'error': return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase">Failed</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Queue Tracker</h2>
        <div className="flex gap-4 text-sm font-medium">
          <div className="text-gray-500">Total: {chapters.length}</div>
          <div className="text-green-500">Done: {chapters.filter(c => c.status === 'completed').length}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b text-gray-500 text-sm uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Ref</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {chapters.map(chapter => (
              <tr key={chapter.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-mono text-indigo-600 font-bold">M{chapter.moduleNumber}L{chapter.lessonNumber}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-800 truncate max-w-xs">{chapter.title}</div>
                  <div className="text-xs text-gray-400 truncate max-w-xs">{chapter.content.substring(0, 50)}...</div>
                </td>
                <td className="px-6 py-4">{getStatusBadge(chapter.status)}</td>
                <td className="px-6 py-4 text-right">
                  {chapter.status === 'completed' && (
                    <button 
                      onClick={() => onPreview(chapter.id)}
                      className="text-indigo-600 hover:text-indigo-800 font-bold text-sm"
                    >
                      View Markdown
                    </button>
                  )}
                  {chapter.status === 'error' && (
                    <span className="text-red-500 text-xs italic">{chapter.error}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProcessingQueue;
