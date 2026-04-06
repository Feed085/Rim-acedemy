import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, PlayCircle, Clock } from 'lucide-react';

export default function CourseWatch() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [flatLessons, setFlatLessons] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const token = localStorage.getItem('rim_auth_token');
        const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};

        // Fetch course
        const response = await fetch(`http://localhost:5000/api/courses/${id}`, { headers });
        const data = await response.json();
        
        // Fetch tests
        const testsResponse = await fetch(`http://localhost:5000/api/tests/course/${id}`, { headers });
        const testsData = await testsResponse.json();

        if (data.success) {
          setCourse(data.data);
          
          // Dərsləri modullardan çıxardıb bir listə (flatten) yığırıq
          if (data.data.modules && data.data.modules.length > 0) {
            const lessons = data.data.modules.reduce((acc: any[], module: any) => {
              const moduleVideos = module.videos.map((v: any) => ({
                ...v,
                moduleTitle: module.title
              }));
              return [...acc, ...moduleVideos];
            }, []);
            setFlatLessons(lessons);
          }
        }
        
        if (testsData.success) {
           setTests(testsData.data);
        }

      } catch (err) {
        console.error('Data gətirilərkən xəta:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  const activeLesson = flatLessons[activeLessonIndex];

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Yüklənir...</div>;
  }

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
                {activeLesson?.title || 'Dərs tapılmadı'}
              </h1>
              <p className="text-gray-500 font-medium mb-6">
                {course.title} — Məruzəçi: <span className="text-gray-900">{course.instructor?.name} {course.instructor?.surname}</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center sm:justify-between border-t border-gray-100 pt-6 mt-4">
                <Button 
                  onClick={() => setActiveLessonIndex(prev => Math.max(0, prev - 1))}
                  disabled={activeLessonIndex === 0}
                  variant="outline"
                  className="rounded-xl border-gray-200 w-full sm:w-auto"
                >
                  Əvvəlki dərs
                </Button>
                <div className="text-sm font-semibold text-gray-400">
                  Dərs {activeLessonIndex + 1} / {flatLessons.length}
                </div>
                <Button 
                  onClick={() => setActiveLessonIndex(prev => Math.min(flatLessons.length - 1, prev + 1))}
                  disabled={activeLessonIndex === flatLessons.length - 1 || flatLessons.length === 0}
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
                  {flatLessons.length} video
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {flatLessons.length === 0 ? (
                  <div className="text-center text-sm text-gray-400 py-4">Bu kursda hələ heç bir dərs yoxdur.</div>
                ) : (
                  flatLessons.map((lesson, index) => (
                    <button
                      key={lesson._id || index}
                      onClick={() => setActiveLessonIndex(index)}
                      className={`w-full text-left p-3 rounded-xl flex gap-3 transition-colors ${
                        activeLessonIndex === index 
                          ? 'bg-[#00D084]/10 border border-[#00D084]/20' 
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        <PlayCircle className={`w-5 h-5 ${activeLessonIndex === index ? 'text-[#00D084]' : 'text-gray-400'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-sm truncate ${activeLessonIndex === index ? 'text-[#00D084]' : 'text-gray-700'}`}>
                          {lesson.title}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{lesson.duration || '0:00'}</span>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
              
              {tests.length > 0 && (
                 <div className="mt-4 pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 text-center uppercase tracking-wider text-[#F59E0B]">
                      Kurs İmtahanları
                    </h3>
                    <div className="space-y-2 px-2 custom-scrollbar overflow-y-auto max-h-40">
                      {tests.map((test) => (
                         <Button
                           key={test._id}
                           onClick={() => navigate(`/tests/${test._id}`)}
                           variant="outline"
                           className="w-full justify-start rounded-xl border-[#F59E0B]/30 hover:bg-[#F59E0B]/10 hover:border-[#F59E0B]"
                         >
                           <Clock className="w-4 h-4 mr-2 text-[#F59E0B]" />
                           <span className="text-left truncate flex-1">{test.title}</span>
                         </Button>
                      ))}
                    </div>
                 </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
