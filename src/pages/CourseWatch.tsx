import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courses } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { ChevronLeft, PlayCircle, CheckCircle, Clock } from 'lucide-react';

export default function CourseWatch() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const course = courses.find((c) => c.id === id);

  const [currentLesson, setCurrentLesson] = useState(1);

  // Mocking sequential lessons for this course
  const mockLessons = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Bölmə ${i + 1}: ${course?.title || 'Kurs'} mövzusuna baxış ${i === 0 ? '- Giriş' : ''}`,
    duration: `${Math.floor(Math.random() * 15) + 5}:${Math.floor(Math.random() * 50) + 10}`,
    isCompleted: i < 2, // First two are completed
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' // Placeholder HTML5 testing video
  }));

  const activeLesson = mockLessons.find(l => l.id === currentLesson);

  if (!course) {
    return (
      <div className="min-h-screen bg-[#F3F3F3] pt-20 lg:pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Kurs tapılmadı</h1>
          <Button onClick={() => navigate(-1)}>
            Geri qayıt
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F3F3] pt-20 lg:pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 text-gray-600 hover:text-gray-900 pl-0 hover:bg-transparent"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Geri qayıt
        </Button>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Main Video Area */}
          <div className="flex-1 w-full min-w-0">
            <div className="bg-black rounded-3xl overflow-hidden aspect-video relative shadow-lg border border-gray-900/10">
              <video
                key={activeLesson?.id}
                controls
                autoPlay
                className="w-full h-full object-cover"
                src={activeLesson?.videoUrl}
              >
                Brauzeriniz video formatını dəstəkləmir.
              </video>
            </div>
            
            <div className="bg-white rounded-3xl p-6 lg:p-8 mt-6 shadow-sm border border-gray-100">
              <h1 className="text-2xl lg:text-3xl font-black text-gray-900 mb-2 truncate">
                {activeLesson?.title}
              </h1>
              <p className="text-gray-500 font-medium mb-6">
                {course.title} — Məruzəçi: <span className="text-gray-900">{course.teacherName}</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center sm:justify-between border-t border-gray-100 pt-6 mt-4">
                <Button 
                  onClick={() => setCurrentLesson(prev => Math.max(1, prev - 1))}
                  disabled={currentLesson === 1}
                  variant="outline"
                  className="rounded-xl border-gray-200 w-full sm:w-auto"
                >
                  Əvvəlki dərs
                </Button>
                <div className="text-sm font-semibold text-gray-400">
                  Dərs {currentLesson} / {mockLessons.length}
                </div>
                <Button 
                  onClick={() => setCurrentLesson(prev => Math.min(mockLessons.length, prev + 1))}
                  disabled={currentLesson === mockLessons.length}
                  className="bg-[#00D084] hover:bg-[#00B873] text-white rounded-xl w-full sm:w-auto"
                >
                  Növbəti dərs
                </Button>
              </div>
            </div>
          </div>

          {/* Playlist Sidebar */}
          <div className="lg:w-96 shrink-0 w-full">
            <div className="bg-white rounded-3xl p-6 shadow-sm overflow-hidden flex flex-col h-[500px] lg:h-[calc(100vh-140px)] sticky top-24 border border-gray-100">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">
                  Dərs cədvəli
                </h2>
                <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg">
                  {mockLessons.length} video
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {mockLessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLesson(lesson.id)}
                    className={`w-full text-left p-3 rounded-xl flex gap-3 transition-colors ${
                      currentLesson === lesson.id 
                        ? 'bg-[#00D084]/10 border border-[#00D084]/20' 
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {lesson.isCompleted && currentLesson !== lesson.id ? (
                        <CheckCircle className="w-5 h-5 text-[#00D084]" />
                      ) : (
                        <PlayCircle className={`w-5 h-5 ${currentLesson === lesson.id ? 'text-[#00D084]' : 'text-gray-400'}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm truncate ${currentLesson === lesson.id ? 'text-[#00D084]' : 'text-gray-700'}`}>
                        {lesson.title}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{lesson.duration}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
