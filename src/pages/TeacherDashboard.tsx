import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
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
  UserPlus,
  MessageSquare,
  Star,
  MessageCircle
} from 'lucide-react';

export default function TeacherDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('rim_auth_token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5000/api/teacher/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          setDashboardData({
            teacher: data.data,
            stats: data.stats,
            reviews: data.reviews || { courseReviews: [], teacherReviews: [] }
          });
        }
      } catch (error) {
        toast.error('Dashboard məlumatları yüklənə bilmədi');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (isLoading || !dashboardData) {
    return <div className="min-h-screen pt-24 text-center">Yüklənir...</div>;
  }

  const { teacher, stats, reviews } = dashboardData;
  const courseReviews = reviews?.courseReviews || [];
  const teacherReviews = reviews?.teacherReviews || [];
  const myCourses = teacher.courses || [];
  const fallbackCourseRating = myCourses.length > 0
    ? Math.round((myCourses.reduce((sum: number, course: any) => sum + Number(course.rating || 0), 0) / myCourses.length) * 10) / 10
    : 0;
  const courseRating = Number(stats.courseRating || 0) || fallbackCourseRating;

  const statCards = [
    { label: 'Ümumi Tələbə', value: stats.studentCount, icon: Users, color: '#00D084', trend: '---' },
    { label: 'Aktiv Kurslar', value: stats.courseCount, icon: BookOpen, color: '#0082F3', trend: '---' },
    { label: 'Testlər', value: stats.testCount, icon: FileText, color: '#F59E0B', trend: '---' },
    { label: 'Video Dərslər', value: stats.videoCount, icon: Video, color: '#EC4899', trend: '---' },
    { label: 'Kurs Rəyləri', value: stats.courseReviewCount || 0, icon: MessageCircle, color: '#10B981', trend: '---' },
    { label: 'Müəllim Rəyləri', value: stats.teacherReviewCount || 0, icon: MessageSquare, color: '#8B5CF6', trend: '---' },
  ];

  const recentStudents: any[] = [];

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
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => navigate('/teacher/profile')}
              variant="outline"
              className="rounded-xl"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Profil
            </Button>
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
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((stat) => (
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
                {myCourses.map((course: any) => (
                  <div
                    key={course.id || course._id}
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
                          variant="ghost"
                          onClick={() => {
                            window.scrollTo(0, 0);
                            navigate(`/teacher/courses/${course._id || course.id}`);
                          }}
                          className="text-[#00D084] hover:text-[#00B873] hover:bg-transparent p-0 font-bold flex items-center group/btn"
                        >
                          Dərslərə bax
                          <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-[#00D084]/10 to-[#0082F3]/10 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-[#00D084]" />
                    <span className="font-medium text-gray-700">Kurs Reytinqi</span>
                  </div>
                  <div className="text-2xl font-black text-gray-900">{courseRating.toFixed(1)}/5</div>
                  <div className="text-sm text-gray-500">{stats.courseReviewCount || 0} rəy</div>
                </div>

                <div className="p-4 bg-gradient-to-br from-[#8B5CF6]/10 to-[#EC4899]/10 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="w-5 h-5 text-[#8B5CF6]" />
                    <span className="font-medium text-gray-700">Müəllim Reytinqi</span>
                  </div>
                  <div className="text-2xl font-black text-gray-900">{Number(stats.teacherRating || 0).toFixed(1)}/5</div>
                  <div className="text-sm text-gray-500">{stats.teacherReviewCount || 0} rəy</div>
                </div>

                <div className="p-4 bg-gradient-to-br from-[#0082F3]/10 to-[#38BDF8]/10 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-[#0082F3]" />
                    <span className="font-medium text-gray-700">Orta Tələbə / Kurs</span>
                  </div>
                  <div className="text-2xl font-black text-gray-900">{Number(stats.avgStudentsPerCourse || 0).toFixed(1)}</div>
                  <div className="text-sm text-gray-500">{stats.studentCount || 0} tələbə, {stats.courseCount || 0} kurs</div>
                </div>

                <div className="p-4 bg-gradient-to-br from-[#F59E0B]/10 to-[#F97316]/10 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Video className="w-5 h-5 text-[#F59E0B]" />
                    <span className="font-medium text-gray-700">Orta Video / Kurs</span>
                  </div>
                  <div className="text-2xl font-black text-gray-900">{Number(stats.avgVideosPerCourse || 0).toFixed(1)}</div>
                  <div className="text-sm text-gray-500">{stats.videoCount || 0} video toplam</div>
                </div>

                <div className="p-4 bg-gradient-to-br from-[#111827]/10 to-[#4B5563]/10 rounded-2xl sm:col-span-2">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="w-5 h-5 text-gray-700" />
                    <span className="font-medium text-gray-700">Toplam Rəy</span>
                  </div>
                  <div className="text-2xl font-black text-gray-900">{Number(stats.totalReviewCount || 0)}</div>
                  <div className="text-sm text-gray-500">Kurs ve müəllim rəyləri birlikdə</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900">Rəylər</h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900">Kurs rəyləri</h3>
                    <span className="text-sm text-gray-500">{courseReviews.length} son rəy</span>
                  </div>
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {courseReviews.length === 0 ? (
                      <div className="text-sm text-gray-500 bg-gray-50 rounded-2xl p-4">Hələ kurs rəyi yoxdur.</div>
                    ) : courseReviews.map((review: any, index: number) => {
                      const reviewer = review.user && typeof review.user === 'object'
                        ? `${review.user.name || ''} ${review.user.surname || ''}`.trim()
                        : review.name || 'Tələbə';

                      return (
                        <div key={review._id || `${review.courseId || 'course'}-${index}`} className="bg-gray-50 rounded-2xl p-4">
                          <div className="flex items-center justify-between gap-4 mb-2">
                            <div>
                              <p className="font-semibold text-gray-900">{reviewer}</p>
                              <p className="text-xs text-gray-500">{review.courseTitle || 'Kurs'}</p>
                            </div>
                            <span className="text-sm font-bold text-[#00D084]">{Number(review.rating || 0).toFixed(1)}</span>
                          </div>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap break-words line-clamp-3">{review.comment}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900">Müəllim rəyləri</h3>
                    <span className="text-sm text-gray-500">{teacherReviews.length} son rəy</span>
                  </div>
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {teacherReviews.length === 0 ? (
                      <div className="text-sm text-gray-500 bg-gray-50 rounded-2xl p-4">Hələ müəllim rəyi yoxdur.</div>
                    ) : teacherReviews.map((review: any, index: number) => {
                      const reviewer = review.user && typeof review.user === 'object'
                        ? `${review.user.name || ''} ${review.user.surname || ''}`.trim()
                        : review.name || 'Tələbə';

                      return (
                        <div key={review._id || `teacher-${index}`} className="bg-gray-50 rounded-2xl p-4">
                          <div className="flex items-center justify-between gap-4 mb-2">
                            <div>
                              <p className="font-semibold text-gray-900">{reviewer}</p>
                              <p className="text-xs text-gray-500">Müəllim haqqında rəy</p>
                            </div>
                            <span className="text-sm font-bold text-[#8B5CF6]">{Number(review.rating || 0).toFixed(1)}</span>
                          </div>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap break-words line-clamp-3">{review.comment}</p>
                        </div>
                      );
                    })}
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
