import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { mockDb } from '@/services/mockDb';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  FileText, 
  Play,
  Award
} from 'lucide-react';

export default function StudentDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const enrolledCourses = user ? mockDb.getEnrolledCourses(user.email) : [];
  const myCourses = enrolledCourses;
  
  const [apiStats, setApiStats] = useState({
    activeCoursesCount: enrolledCourses.length,
    completedTestsCount: 0,
    certificatesCount: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('rim_auth_token');
      if (!token) return;
      try {
        const response = await fetch('http://localhost:5000/api/student/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success && data.data && data.data.stats) {
          setApiStats({
            activeCoursesCount: data.data.stats.activeCoursesCount,
            completedTestsCount: data.data.stats.completedTestsCount,
            certificatesCount: data.data.stats.certificatesCount
          });
        }
      } catch (err) {
        console.error('Statistika yüklənərkən xəta baş verdi', err);
      }
    };
    
    if (user && user.role === 'student') {
      fetchStats();
    }
  }, [user]);

  const scrollToCourses = () => {
    const el = document.getElementById('my-courses-section');
    if (el) {
      const yOffset = -100;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const stats = [
    { label: 'Aktiv Kurslar', value: apiStats.activeCoursesCount.toString(), icon: BookOpen, color: '#00D084', onClick: scrollToCourses },
    { label: 'Tamamlanan Testlər', value: apiStats.completedTestsCount.toString(), icon: FileText, color: '#0082F3', onClick: () => navigate('/dashboard/completed-tests') },
    { label: 'Sertifikatlar', value: apiStats.certificatesCount.toString(), icon: Award, color: '#F59E0B', onClick: () => navigate('/dashboard/certificates') },
  ];

  return (
    <div className="min-h-screen bg-[#F3F3F3] pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900">
              {t('student.dashboard.title')}
            </h1>
            <p className="text-gray-600 mt-1">
              Xoş gəldiniz, {user?.name}!
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate('/courses')}
              variant="outline"
              className="rounded-xl"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Kurslara bax
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              onClick={stat.onClick}
              className="bg-white rounded-2xl p-5 shadow-sm transition-all cursor-pointer hover:shadow-md hover:-translate-y-1"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div className="text-2xl font-black text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Courses */}
          <div className="lg:col-span-2">
            <div id="my-courses-section" className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {t('student.dashboard.my_courses')}
                </h2>
              </div>

              <div className="space-y-4">
                {myCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full sm:w-32 h-24 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{course.title}</h3>
                      <p className="text-sm text-gray-500 mb-3">{course.teacherName}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-500">İrəliləyiş</span>
                            <span className="font-medium text-[#00D084]">0%</span>
                          </div>
                          <Progress value={0} className="h-2" />
                        </div>
                        <Button
                          onClick={() => navigate(`/course-watch/${course.id}`, { state: { from: 'dashboard' } })}
                          size="sm"
                          className="bg-[#00D084] hover:bg-[#00B873] rounded-lg"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Başla
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {myCourses.length === 0 && (
                  <div className="text-center py-12">
                     <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-gray-300" />
                     </div>
                     <p className="text-gray-500">Hələ ki, heç bir kursunuz yoxdur.</p>
                     <Button 
                       variant="link" 
                       onClick={() => navigate('/courses')}
                       className="text-[#00D084] mt-2 font-bold"
                     >
                       Kurslara göz at
                     </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm text-center">
               <div className="w-16 h-16 bg-[#00D084]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-[#00D084]" />
               </div>
               <h3 className="text-lg font-bold text-gray-900 mb-2">Hədəflərinizə yaxınsınız!</h3>
               <p className="text-sm text-gray-500 mb-6">Kursları tamamlayaraq sertifikatlarınızı əldə edin və biliklərinizi rəsmiləşdirin.</p>
               <Button 
                 onClick={() => navigate('/courses')}
                 className="w-full bg-[#00D084] hover:bg-[#00B873] rounded-xl font-bold"
               >
                 Yeni Kurs Kəşf Et
               </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
