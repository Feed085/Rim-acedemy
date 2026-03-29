import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { tests, teachers } from '@/data/mockData';
import { mockDb } from '@/services/mockDb';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  BookOpen,
  FileText,
  Video,
  TrendingUp,
  Plus,
  ArrowRight,
  Check,
  X,
  UserPlus
} from 'lucide-react';

export default function TeacherDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const teacher = teachers[0];

  const myCourses = mockDb.getTeacherCourses(teacher.id);
  const myTests = tests.slice(0, 3);

  const stats = [
    { label: 'Ümumi Tələbə', value: teacher?.studentCount || 1200, icon: Users, color: '#00D084', trend: '+12%' },
    { label: 'Aktiv Kurslar', value: teacher?.courseCount || 8, icon: BookOpen, color: '#0082F3', trend: '+2' },
    { label: 'Testlər', value: myTests.length, icon: FileText, color: '#F59E0B', trend: '+5' },
    { label: 'Video Dərslər', value: '45', icon: Video, color: '#EC4899', trend: '+8' },
  ];

  const recentStudents = [
    { name: 'Aysel Məmmədova', course: 'IELTS Intensive', progress: 78, date: '2 saat əvvəl' },
    { name: 'Orxan Əliyev', course: 'SAT Hazırlığı', progress: 92, date: '5 saat əvvəl' },
    { name: 'Günay Hüseynova', course: 'İngilis Dili', progress: 65, date: '1 gün əvvəl' },
    { name: 'Tural İsmayılov', course: 'Web Proqramlaşdırma', progress: 45, date: '2 gün əvvəl' },
  ];

  const courseRequests = [
    { id: 1, name: 'Fərid Hacıyev', course: 'IELTS Hazırlıq', time: '10 dəq əvvəl' },
    { id: 2, name: 'Nigar Rzayeva', course: 'General English', time: '1 saat əvvəl' },
  ];

  return (
    <div className="min-h-screen bg-[#F3F3F3] pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900">
              {t('teacher.dashboard.title')}
            </h1>
            <p className="text-gray-600 mt-1">
              Xoş gəldiniz, {user?.name || teacher?.name}!
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate('/teacher/courses/create')}
              variant="outline"
              className="rounded-xl border-[#00D084] text-[#00D084] hover:bg-[#00D084]/5"
            >
              <Plus className="w-4 h-4 mr-2" />
              Kurs Yarat
            </Button>
            <Button
              onClick={() => navigate('/teacher/upload')}
              variant="outline"
              className="rounded-xl"
            >
              <Video className="w-4 h-4 mr-2" />
              Video Yüklə
            </Button>
            <Button
              onClick={() => navigate('/teacher/test/create')}
              className="bg-[#00D084] hover:bg-[#00B873] rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Test Yarat
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.trend}
                </span>
              </div>
              <div className="text-2xl font-black text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Courses */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {t('teacher.dashboard.my_courses')}
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
                      className="w-full sm:w-40 h-24 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-900">{course.title}</h3>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{course.studentCount} tələbə</p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-500">Reytinq</span>
                            <span className="font-medium text-[#00D084]">{course.rating}/5</span>
                          </div>
                          <Progress value={course.rating * 20} className="h-2" />
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            window.scrollTo(0, 0);
                            navigate(`/teacher/courses/${course.id}`);
                          }}
                          className="rounded-lg border-[#00D084] text-[#00D084] hover:bg-[#00D084]/5 font-bold"
                        >
                          <Video className="w-4 h-4 mr-1" />
                          Dərslərə Bax
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Students */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {t('teacher.dashboard.my_students')}
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => {
                    window.scrollTo(0, 0);
                    navigate('/teacher/students');
                  }}
                  className="text-[#00D084] hover:text-[#00B873]"
                >
                  Hamısı
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="space-y-3">
                {recentStudents.map((student, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#00D084] to-[#0082F3] rounded-full flex items-center justify-center text-white font-bold">
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{student.name}</h4>
                      <p className="text-sm text-gray-500">{student.course}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-[#00D084]">{student.progress}%</div>
                      <div className="text-xs text-gray-400">{student.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}


            {/* Analytics */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {t('teacher.dashboard.statistics')}
              </h2>
              <div className="space-y-4">

                <div className="p-4 bg-gradient-to-br from-[#0082F3]/10 to-[#EC4899]/10 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-[#0082F3]" />
                    <span className="font-medium text-gray-700">Ortalama Reytinq</span>
                  </div>
                  <div className="text-2xl font-black text-gray-900">4.8/5</div>
                  <div className="text-sm text-green-600">+0.3 keçən aydan</div>
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Yaxınlaşan Dərslər
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-[#00D084]/5 rounded-xl">
                  <div className="w-12 h-12 bg-[#00D084]/10 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs text-[#00D084] font-medium">MAR</span>
                    <span className="text-lg font-black text-[#00D084]">25</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">IELTS Speaking</h4>
                    <p className="text-xs text-gray-500">10:00 - 11:30</p>
                    <p className="text-xs text-[#00D084]">15 tələbə</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-[#0082F3]/5 rounded-xl">
                  <div className="w-12 h-12 bg-[#0082F3]/10 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs text-[#0082F3] font-medium">MAR</span>
                    <span className="text-lg font-black text-[#0082F3]">26</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">SAT Riyaziyyat</h4>
                    <p className="text-xs text-gray-500">14:00 - 16:00</p>
                    <p className="text-xs text-[#0082F3]">20 tələbə</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <UserPlus className="w-5 h-5 text-[#00D084]" />
                <h2 className="text-xl font-bold text-gray-900">
                  Kurs Müraciətləri
                </h2>
              </div>
              <div className="space-y-4">
                {courseRequests.map((request) => (
                  <div key={request.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900">{request.name}</h4>
                        <p className="text-xs text-gray-500">{request.course}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 italic">{request.time}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-[#00D084] hover:bg-[#00B873] text-white h-9 rounded-xl text-xs font-bold">
                        <Check className="w-3 h-3 mr-1" />
                        Təsdiqlə
                      </Button>
                      <Button variant="outline" className="flex-1 border-red-100 text-red-500 hover:bg-red-50 h-9 rounded-xl text-xs font-bold">
                        <X className="w-3 h-3 mr-1" />
                        Ləğv et
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
