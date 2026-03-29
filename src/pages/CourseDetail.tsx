import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { teachers } from '@/data/mockData';
import { mockDb } from '@/services/mockDb';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  Users, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  PlayCircle, 
  ShieldCheck, 
  ChevronRight,
  Calendar
} from 'lucide-react';


export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [teacher, setTeacher] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const dbCourses = mockDb.getCourses();
    const foundCourse = dbCourses.find(c => c.id === id);
    if (foundCourse) {
      setCourse(foundCourse);
      const foundTeacher = teachers.find(t => t.id === foundCourse.teacherId);
      setTeacher(foundTeacher);
    }
  }, [id]);

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
    <div className="min-h-screen bg-[#F3F3F3]">
      {/* Header Overlay Section */}
      <div className="relative bg-[#0A0A0A] pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#00D084]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-[#0082F3]/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:w-2/3">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
              <Link to="/" className="hover:text-white transition-colors">Ana səhifə</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/courses" className="hover:text-white transition-colors">Kurslar</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">{course.title}</span>
            </div>

            {/* Title & Description */}
            <h1 className="text-3xl lg:text-5xl font-black text-white mb-6 leading-tight">
              {course.title}
            </h1>
            <p className="text-gray-400 text-lg lg:text-xl mb-8 max-w-2xl">
              {course.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(course.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white font-bold">{course.rating}</span>
                <span className="text-gray-500">(1,250 rəy)</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-300">
                <Users className="w-5 h-5 text-[#00D084]" />
                <span className="font-medium text-sm">{course.studentCount} Tələbə</span>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-5 h-5 text-[#0082F3]" />
                <span className="font-medium text-sm">Son yenilənmə: {course.lastUpdated}</span>
              </div>
            </div>
            
            {/* Mobile Price View */}
            <div className="mt-8 lg:hidden flex items-center justify-between bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
              <div>
                <p className="text-gray-400 text-sm mb-1">Kurs haqqında</p>
                <div className="text-3xl font-black text-white">{course.title}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Column: Course Details */}
          <div className="flex-1 lg:w-2/3 space-y-12">
            
            {/* What you'll learn */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#00D084]" />
                Bu kursda nə öyrənəcəksiniz?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(course.learningPoints || []).map((point: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#00D084] shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </section>



            {/* Instructor */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Təlimçi</h2>
              <div className="flex flex-col sm:flex-row gap-8">
                <div className="shrink-0 flex flex-col items-center">
                  <div className="relative mb-4">
                    <img
                      src={course.teacherAvatar}
                      alt={course.teacherName}
                      className="w-24 h-24 lg:w-32 lg:h-32 rounded-3xl object-cover border-4 border-gray-50"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white p-1.5 rounded-xl shadow-lg">
                      <Star className="w-4 h-4 fill-white" />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900">{teacher?.rating} Reytinq</div>
                    <div className="text-xs text-gray-500">{teacher?.studentCount} Tələbə</div>
                  </div>
                </div>
                <div className="flex-1">
                  <Link 
                    to={`/teachers/${course.teacherId}`}
                    className="text-xl font-bold text-gray-900 hover:text-[#00D084] transition-colors block mb-2"
                  >
                    {course.teacherName}
                  </Link>
                  <p className="text-sm font-medium text-[#00D084] uppercase tracking-wider mb-4">
                    {teacher?.specialties.join(', ')}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">
                    {teacher?.bio}
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/teachers/${course.teacherId}`)}
                    className="rounded-xl border-gray-200 hover:border-[#00D084] hover:text-[#00D084]"
                  >
                    Profilə bax
                  </Button>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Floating Sidebar */}
          <aside className="lg:w-1/3">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-[32px] overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100">
                {/* Preview Image */}
                <div className="relative aspect-video">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group cursor-pointer">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-8">


                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 text-sm uppercase tracking-widest">Kurs daxildir:</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <BookOpen className="w-5 h-5 text-[#00D084]" />
                        <span>{course.lessonCount} video dərs</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <Clock className="w-5 h-5 text-[#00D084]" />
                        <span>{course.duration}</span>
                      </div>
                      {(course.includes || []).map((item: string, index: number) => (
                        <div key={index} className="flex items-center gap-4 text-sm text-gray-600">
                          <ShieldCheck className="w-5 h-5 text-[#00D084]" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>


                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
