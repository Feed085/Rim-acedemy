import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { courses, tests } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  BookOpen, 
  FileText, 
  Clock, 
  ArrowRight,
  Play,
  Award
} from 'lucide-react';

export default function StudentDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const myCourses = courses.slice(0, 3);
  const myTests = tests.slice(0, 3);

  const groupedCourseTests = Object.values(
    myTests.reduce((acc, test) => {
      if (!acc[test.courseId]) {
        acc[test.courseId] = {
          courseId: test.courseId,
          courseName: test.courseName || 'Naməlum Kurs',
          tests: []
        };
      }
      acc[test.courseId].tests.push(test);
      return acc;
    }, {} as Record<string, { courseId: string; courseName: string; tests: typeof myTests }>)
  );

  const scrollToCourses = () => {
    const el = document.getElementById('my-courses-section');
    if (el) {
      const yOffset = -100;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const stats = [
    { label: 'Aktiv Kurslar', value: '3', icon: BookOpen, color: '#00D084', onClick: scrollToCourses },
    { label: 'Tamamlanan Testlər', value: '12', icon: FileText, color: '#0082F3', onClick: () => navigate('/dashboard/completed-tests') },
    { label: 'Sertifikatlar', value: '2', icon: Award, color: '#F59E0B', onClick: () => navigate('/dashboard/certificates') },
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
            <Button
              onClick={() => navigate('/tests')}
              className="bg-[#00D084] hover:bg-[#00B873] rounded-xl"
            >
              <FileText className="w-4 h-4 mr-2" />
              Testə başla
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
                <Button
                  variant="ghost"
                  onClick={() => navigate('/courses')}
                  className="text-[#00D084] hover:text-[#00B873]"
                >
                  Hamısı
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
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
                            <span className="font-medium text-[#00D084]">65%</span>
                          </div>
                          <Progress value={65} className="h-2" />
                        </div>
                        <Button
                          onClick={() => navigate(`/courses/${course.id}/watch`, { state: { from: 'dashboard' } })}
                          size="sm"
                          className="bg-[#00D084] hover:bg-[#00B873] rounded-lg"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Davam et
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Tests */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {t('student.dashboard.tests')}
              </h2>
              <Accordion type="multiple" className="w-full space-y-3">
                {groupedCourseTests.map((group) => (
                  <AccordionItem 
                    key={group.courseId} 
                    value={group.courseId} 
                    className="border border-gray-100 bg-gray-50 rounded-2xl overflow-hidden px-4"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3 text-left w-full pr-2">
                        <div className="w-10 h-10 bg-[#00D084]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-5 h-5 text-[#00D084]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-sm truncate">
                            {group.courseName}
                          </h4>
                          <p className="text-xs text-gray-500 font-normal mt-0.5">
                            {group.tests.length} test mövcuddur
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-0 pb-4">
                      <div className="space-y-3 mt-1">
                        {group.tests.map((test) => (
                          <div
                            key={test.id}
                            className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 bg-[#0082F3]/10 rounded-md flex items-center justify-center flex-shrink-0">
                                <FileText className="w-4 h-4 text-[#0082F3]" />
                              </div>
                              <div className="min-w-0 pr-4">
                                <h5 className="font-medium text-gray-900 text-sm truncate">
                                  {test.title}
                                </h5>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{test.duration} dəq</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/tests/${test.id}`, { state: { from: 'dashboard' } })}
                              className="rounded-lg text-xs h-8 shrink-0 hover:bg-[#0082F3] hover:text-white hover:border-[#0082F3] transition-colors"
                            >
                              Başla
                            </Button>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>



            {/* Calendar */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Yaxınlaşan
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-[#00D084]/10 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs text-[#00D084] font-medium">MAR</span>
                    <span className="text-lg font-black text-[#00D084]">25</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">SAT Mock İmtahanı</h4>
                    <p className="text-xs text-gray-500">10:00 - 13:00</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-[#0082F3]/10 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs text-[#0082F3] font-medium">MAR</span>
                    <span className="text-lg font-black text-[#0082F3]">28</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">IELTS Speaking</h4>
                    <p className="text-xs text-gray-500">14:00 - 15:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
