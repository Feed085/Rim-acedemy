import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  Users, 
  User,
  BookOpen, 
  Award, 
  ArrowLeft,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Clock,
  Send,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

export default function TeacherDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [teacher, setTeacher] = useState<any>(null);
  const [teacherCourses, setTeacherCourses] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'courses' | 'about' | 'reviews'>('courses');
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchTeacher = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/teacher/public/${id}`);
        const data = await response.json();
        if (data.success && data.data) {
           setTeacher(data.data);
           setTeacherCourses(data.courses || []);
           setStats(data.stats || {});
        }
      } catch (err) {
        toast.error('Müəllim yüklənə bilmədi');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeacher();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment.trim()) {
      toast.error('Zəhmət olmasa rəyinizi yazın');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Rəyiniz uğurla göndərildi!');
    setNewReview({ rating: 5, comment: '' });
    setIsSubmitting(false);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Yüklənir...</div>;
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-[#F3F3F3] pt-20 lg:pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Müəllim tapılmadı</h1>
          <Button onClick={() => navigate('/teachers')}>
            Müəllimlərə qayıt
          </Button>
        </div>
      </div>
    );
  }


  const reviews = [
    {
      id: 1,
      name: 'Aysel Məmmədova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      rating: 5,
      date: '2 həftə əvvəl',
      comment: 'Çox peşəkar müəllimdir. Dərsləri çox maraqlı və faydalı keçir.',
    },
    {
      id: 2,
      name: 'Orxan Əliyev',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
      rating: 5,
      date: '1 ay əvvəl',
      comment: 'IELTS imtahanında 7.5 bal almağıma kömək etdi. Təşəkkürlər!',
    },
    {
      id: 3,
      name: 'Günay Hüseynova',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
      rating: 4,
      date: '2 ay əvvəl',
      comment: 'Çox səbirli və başa salan müəllimdir.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F3F3F3] pt-20 lg:pt-24">
      {/* Cover */}
      <div className="relative h-48 lg:h-72 bg-gradient-to-r from-[#00D084] to-[#0082F3]">
        <div className="absolute inset-0 bg-black/20 z-0" />
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-white hover:bg-white/20 z-10"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Geri
        </Button>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-12">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Avatar */}
            <div className="relative -mt-24 lg:-mt-32">
              <img
                src={teacher.avatar}
                alt={`${teacher.name} ${teacher.surname}`}
                className="w-32 h-32 lg:w-48 lg:h-48 rounded-3xl object-cover border-4 border-white shadow-lg"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-black text-gray-900">
                    {teacher.name} {teacher.surname}
                  </h1>
                  <p className="text-gray-500 mt-1">
                    {(teacher.specializedAreas || []).join(', ')}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {teacher.location || 'Bakı, Azərbaycan'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-center px-4 py-2 bg-[#00D084]/10 rounded-2xl">
                    <div className="text-2xl font-black text-[#00D084]">{teacher.rating}</div>
                    <div className="flex items-center gap-0.5 justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(teacher.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Users className="w-5 h-5 text-[#00D084]" />
                    <span className="text-2xl font-black text-gray-900">{stats?.studentCount || 0}</span>
                  </div>
                  <p className="text-sm text-gray-500">{t('teachers.students')}</p>
                </div>
                <div className="text-center border-x border-gray-100">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <BookOpen className="w-5 h-5 text-[#0082F3]" />
                    <span className="text-2xl font-black text-gray-900">{stats?.courseCount || 0}</span>
                  </div>
                  <p className="text-sm text-gray-500">{t('teachers.courses')}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Award className="w-5 h-5 text-[#F59E0B]" />
                    <span className="text-2xl font-black text-gray-900">{teacher.experience || '1 İl'}</span>
                  </div>
                  <p className="text-sm text-gray-500">{t('teachers.experience')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100">
            {[
              { key: 'courses', label: 'Kurslar', icon: BookOpen },
              { key: 'about', label: 'Haqqında', icon: User },
              { key: 'reviews', label: 'Rəylər', icon: Star },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-[#00D084] border-b-2 border-[#00D084]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 lg:p-8">
            {activeTab === 'courses' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teacherCourses.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    Bu müəllimin hələ ki aktiv kursu yoxdur.
                  </div>
                ) : (
                  teacherCourses.map((course) => (
                    <div
                      key={course._id}
                      className="flex gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => navigate(`/courses/${course._id}`)}
                    >
                      <img
                        src={course.image || 'https://images.unsplash.com/photo-1546410531-bea5aadcb6ce'}
                        alt={course.title}
                        className="w-24 h-20 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{course.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {course.duration || '0:00'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Təhsil</h3>
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                    <Award className="w-5 h-5 text-[#00D084] mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{teacher.education}</p>
                      <p className="text-sm text-gray-500">Ali təhsil</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Təcrübə</h3>
                  <p className="text-gray-600 leading-relaxed">{teacher.experience || 'Müəllim təcrübəsini paylaşmayıb.'}</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">İxtisaslar</h3>
                  <div className="flex flex-wrap gap-2">
                    {(teacher.specializedAreas || []).map((specialty: string, index: number) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-[#00D084]/10 text-[#00D084] rounded-full text-sm font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Sosial Şəbəkələr</h3>
                  <div className="flex gap-3">
                    {teacher.socialLinks?.facebook && (
                      <a
                        href={teacher.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-[#1877F2]/10 rounded-xl flex items-center justify-center hover:bg-[#1877F2]/20 transition-colors"
                      >
                        <Facebook className="w-5 h-5 text-[#1877F2]" />
                      </a>
                    )}
                    {teacher.socialLinks?.instagram && (
                      <a
                        href={teacher.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-gradient-to-r from-[#833AB4]/10 via-[#E1306C]/10 to-[#F77737]/10 rounded-xl flex items-center justify-center hover:from-[#833AB4]/20 hover:via-[#E1306C]/20 hover:to-[#F77737]/20 transition-colors"
                      >
                        <Instagram className="w-5 h-5 text-[#E1306C]" />
                      </a>
                    )}
                    {teacher.socialLinks?.linkedin && (
                      <a
                        href={teacher.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-[#0A66C2]/10 rounded-xl flex items-center justify-center hover:bg-[#0A66C2]/20 transition-colors"
                      >
                        <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Write Review Section */}
                {isAuthenticated && user?.role === 'student' ? (
                  <div className="bg-white border-2 border-[#00D084]/20 rounded-2xl p-6 mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-[#00D084]" />
                      Rəy yazın
                    </h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-700 mr-2">Qiymətləndirmə:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= newReview.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <Textarea
                        placeholder="Müəllim haqqında fikirlərinizi bölüşün..."
                        value={newReview.comment}
                        onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                        className="rounded-xl border-gray-100 min-h-[120px] focus:border-[#00D084]"
                      />
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-[#00D084] hover:bg-[#00B873] text-white rounded-xl px-8 h-12 flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Rəyi paylaş
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                ) : !isAuthenticated ? (
                  <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-6 text-center mb-8">
                    <p className="text-gray-600 mb-4">Rəy yazmaq üçün qeydiyyatdan keçməlisiniz.</p>
                    <Button 
                      onClick={() => navigate('/login')}
                      variant="outline"
                      className="rounded-xl"
                    >
                      Daxil ol
                    </Button>
                  </div>
                ) : null}

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-start gap-4">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-gray-900">{review.name}</h4>
                            <p className="text-sm text-gray-500">{review.date}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
