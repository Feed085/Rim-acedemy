import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { teachers, courses } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  Users, 
  BookOpen, 
  Award, 
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Clock
} from 'lucide-react';

export default function TeacherDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const teacher = teachers.find(t => t.id === id);
  const [activeTab, setActiveTab] = useState<'courses' | 'about' | 'reviews'>('courses');

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

  const teacherCourses = courses.filter(c => c.teacherId === teacher.id);

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
        <div className="absolute inset-0 bg-black/20" />
        <Button
          variant="ghost"
          onClick={() => navigate('/teachers')}
          className="absolute top-4 left-4 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Geri
        </Button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-12">
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
                    {teacher.specialties.join(', ')}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      Bakı, Azərbaycan
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      {teacher.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      {teacher.phone}
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
                    <span className="text-2xl font-black text-gray-900">{teacher.studentCount}</span>
                  </div>
                  <p className="text-sm text-gray-500">{t('teachers.students')}</p>
                </div>
                <div className="text-center border-x border-gray-100">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <BookOpen className="w-5 h-5 text-[#0082F3]" />
                    <span className="text-2xl font-black text-gray-900">{teacher.courseCount}</span>
                  </div>
                  <p className="text-sm text-gray-500">{t('teachers.courses')}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Award className="w-5 h-5 text-[#F59E0B]" />
                    <span className="text-2xl font-black text-gray-900">{teacher.experience}</span>
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
              { key: 'about', label: 'Haqqında', icon: Award },
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
                {teacherCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-24 h-20 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{course.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {course.studentCount}
                        </span>
                      </div>
                      <div className="mt-2 text-[#00D084] font-bold">
                        {course.price}₼
                      </div>
                    </div>
                  </div>
                ))}
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
                  <p className="text-gray-600 leading-relaxed">{teacher.bio}</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">İxtisaslar</h3>
                  <div className="flex flex-wrap gap-2">
                    {teacher.specialties.map((specialty, index) => (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
