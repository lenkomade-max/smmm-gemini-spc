
import React from 'react';
import { Chapter } from '../types';

interface LessonPreviewProps {
  lessons: Chapter[];
  onBack: () => void;
}

const LessonPreview: React.FC<LessonPreviewProps> = ({ lessons, onBack }) => {
  const downloadLesson = (lesson: Chapter) => {
    const element = document.createElement("a");
    const file = new Blob([lesson.generatedLesson || ''], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `Module_${lesson.moduleNumber}_Lesson_${lesson.lessonNumber}.md`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Generated Azerbaijani Lessons</h2>
        <button onClick={onBack} className="text-indigo-600 font-bold flex items-center gap-2">
          <i className="fas fa-arrow-left"></i> Back to Queue
        </button>
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
           <p className="text-gray-400">No generated lessons yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-12">
          {lessons.map(lesson => (
            <div key={lesson.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-indigo-50 px-8 py-4 border-b border-indigo-100 flex justify-between items-center">
                <h3 className="font-bold text-indigo-900">Module {lesson.moduleNumber}, Lesson {lesson.lessonNumber}</h3>
                <button 
                  onClick={() => downloadLesson(lesson)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 flex items-center gap-2 transition-all"
                >
                  <i className="fas fa-download"></i> Download MD
                </button>
              </div>
              <div className="p-10 max-h-[600px] overflow-y-auto">
                <div className="prose prose-indigo max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700">
                    {lesson.generatedLesson}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonPreview;
