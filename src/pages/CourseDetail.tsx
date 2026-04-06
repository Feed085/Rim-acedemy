import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  Users, 
  CheckCircle2, 
  PlayCircle, 
  ChevronRight,
  Calendar,
  ShoppingBag,
  MessageCircle,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';


export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [teacher, setTeacher] = useState<any>(null);
  const { user, isAuthenticated } = useAuth();
  const [enrollmentStatus, setEnrollmentStatus] = useState<'approved' | 'pending' | 'none'>('none');
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${id}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setCourse(data.data);
          setTeacher(data.data.instructor);
          
          if (user && user.role === 'student') {
            // Hələlik enrollment yoxdur API kimi. Amma activeCourses yoxlanıla bilər
            const studentCheck = await fetch(`http://localhost:5000/api/student/me`, {
               headers: { 'Authorization': `Bearer ${localStorage.getItem('rim_auth_token')}` }
            });
            const stData = await studentCheck.json();
            if(stData.success && stData.data.activeCourses) {
               const hasCourse = stData.data.activeCourses.some((c: any) => c._id === id);
               if(hasCourse) setEnrollmentStatus('approved');
            }
          }
        }
      } catch (err) {
        toast.error('Kurs yüklənə bilmədi');
      }
    };
    fetchCourse();
  }, [id, user]);

  const handleRequest = async () => {
    if (!isAuthenticated) {
      toast.error('Müraciət etmək üçün daxil olun');
      navigate('/login');
      return;
    }
    
    setIsRequesting(true);
    
    // Gələcəkdə qeydiyyat logikası bura yazılacaq.
    setTimeout(() => {
      setEnrollmentStatus('pending');
      toast.success('Müraciətiniz qəbul olundu! Admin ilə WhatsApp-da əlaqə saxlayın.');
      setIsRequesting(false);
    }, 1000);
  };

  const openWhatsApp = () => {
    const phone = "+994501234567"; // Placeholder phone number
    const message = `Salam! Mən ${course.title} kursuna qoşulmaq üçün müraciət etmişəm. (${user?.email})`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

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
                <span className="font-medium text-sm">214 Tələbə</span>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-5 h-5 text-[#0082F3]" />
                <span className="font-medium text-sm">Son yenilənmə: {new Date(course.updatedAt || course.createdAt).toLocaleDateString('az-AZ')}</span>
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
                      src={teacher?.avatar || "https://ui-avatars.com/api/?name=Teacher"}
                      alt={teacher?.name}
                      className="w-24 h-24 lg:w-32 lg:h-32 rounded-3xl object-cover border-4 border-gray-50 bg-white"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white p-1.5 rounded-xl shadow-lg">
                      <Star className="w-4 h-4 fill-white" />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900">{teacher?.rating || '5.0'} Reytinq</div>
                    <div className="text-xs text-gray-500">Müəllim</div>
                  </div>
                </div>
                <div className="flex-1">
                  <Link 
                    to={`/teachers/${teacher?._id}`}
                    className="text-xl font-bold text-gray-900 hover:text-[#00D084] transition-colors block mb-2"
                  >
                    {teacher?.name} {teacher?.surname}
                  </Link>
                  <p className="text-sm font-medium text-[#00D084] uppercase tracking-wider mb-4">
                    {(teacher?.specializedAreas || []).join(', ')}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 italic line-clamp-3">
                    {teacher?.experience || 'Ali təhsilli və peşəkar kurs instruktoru.'}
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/teachers/${teacher?._id}`)}
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


                  <div className="pt-6 border-t border-gray-100 flex flex-col gap-3">
                    {user?.role === 'teacher' ? (
                      <div className="bg-red-50 text-red-600 p-6 rounded-[24px] border border-red-100 text-center animate-in fade-in duration-500">
                        <ShieldCheck className="w-8 h-8 mx-auto mb-3 opacity-80" />
                        <h4 className="font-black text-sm uppercase tracking-wider mb-1">Giriş Məhduddur</h4>
                        <p className="text-xs font-medium opacity-80 leading-relaxed italic">
                          Müəllim hesabı ilə tələbə kurslarına müraciət etmək mümkün deyil.
                        </p>
                      </div>
                    ) : enrollmentStatus === 'approved' ? (
                      <Button 
                        onClick={() => navigate(`/courses/${course.id || course._id}/watch`)}
                        className="w-full h-14 bg-[#00D084] hover:bg-[#00B873] text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-[#00D084]/20"
                      >
                        <PlayCircle className="w-5 h-5" />
                        Kursa daxil ol
                      </Button>
                    ) : enrollmentStatus === 'pending' ? (
                      <div className="space-y-3">
                        <div className="bg-orange-50 text-orange-600 p-4 rounded-2xl text-sm font-bold flex items-center gap-3">
                           <Loader2 className="w-5 h-5 animate-spin" />
                           Müraciətiniz gözləmədədir...
                        </div>
                        <Button 
                          onClick={openWhatsApp}
                          className="w-full h-14 bg-[#25D366] hover:bg-[#128C7E] text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-green-200"
                        >
                          <MessageCircle className="w-5 h-5" />
                          WhatsApp ilə əlaqə saxla
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-4 mb-2">
                           <span className="text-4xl font-black text-gray-900">
                             {course.price > 0 ? `${course.price} AZN` : 'Pulsuz!'}
                           </span>
                        </div>
                        <Button 
                          onClick={handleRequest}
                          disabled={isRequesting}
                          className="w-full h-14 bg-[#000000] hover:bg-gray-900 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-gray-200"
                        >
                          {isRequesting ? (
                             <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                             <ShoppingBag className="w-5 h-5" />
                          )}
                          Müraciət göndər
                        </Button>
                        <p className="text-center text-xs text-gray-400 mt-2 italic px-4 leading-relaxed">
                          Müraciətdən sonra WhatsApp vasitəsilə adminlə əlaqə saxlayaraq ödənişi tamamlayın.
                        </p>
                      </>
                    )}
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
