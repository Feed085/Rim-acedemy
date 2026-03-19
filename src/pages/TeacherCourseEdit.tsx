import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { courses } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  PlayCircle, 
  FileText,
  Video,
  Settings,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';

export default function TeacherCourseEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    const foundCourse = courses.find(c => c.id === id);
    if (foundCourse) {
      setCourse({ ...foundCourse });
    }
  }, [id]);

  if (!course) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p>Kurs tapılmadı</p>
      </div>
    );
  }

  const handleSave = () => {
    toast.success('Kurs məlumatları uğurla yeniləndi');
    navigate('/teacher/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F3F3F3] pt-20 lg:pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate('/teacher/dashboard')}
              className="mb-2 p-0 h-auto hover:bg-transparent text-gray-500 hover:text-gray-900 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Panelə qayıt
            </Button>
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900">
              Kursu Redaktə Et
            </h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl" onClick={() => navigate('/teacher/dashboard')}>
              Ləğv et
            </Button>
            <Button className="bg-[#00D084] hover:bg-[#00B873] rounded-xl px-6" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Yadda saxla
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#00D084]" />
                Əsas Məlumatlar
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kursun Adı</label>
                  <Input 
                    value={course.title}
                    onChange={(e) => setCourse({ ...course, title: e.target.value })}
                    className="rounded-xl border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kateqoriya</label>
                  <Input 
                    value={course.category}
                    onChange={(e) => setCourse({ ...course, category: e.target.value })}
                    className="rounded-xl border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Haqqında</label>
                  <Textarea 
                    value={course.description}
                    onChange={(e) => setCourse({ ...course, description: e.target.value })}
                    className="rounded-xl border-gray-200 min-h-[120px]"
                  />
                </div>
              </div>
            </div>

            {/* Video Lessons */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#00D084]" />
                  Video Dərslər
                </h2>
                <Button variant="outline" size="sm" className="rounded-xl text-[#00D084] border-[#00D084]/20">
                  <Plus className="w-4 h-4 mr-1" />
                  Yeni Video
                </Button>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <PlayCircle className="w-6 h-6 text-[#00D084]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">Video Dərs #{i}</h4>
                        <p className="text-xs text-gray-500">12:45 dəq</p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quizzes / Tests */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#00D084]" />
                  Testlər və Tapşırıqlar
                </h2>
                <Button variant="outline" size="sm" className="rounded-xl text-[#00D084] border-[#00D084]/20">
                  <Plus className="w-4 h-4 mr-1" />
                  Yeni Test
                </Button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-4 text-sm font-bold text-gray-900">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <FileText className="w-6 h-6 text-blue-500" />
                    </div>
                    Yekun İmtahan Testi
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Kurs Şəkli</h3>
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 relative group cursor-pointer mb-4">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/90 p-3 rounded-full shadow-lg">
                    <ImageIcon className="w-6 h-6 text-[#00D084]" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-center text-gray-500">Şəkli dəyişmək üçün üzərinə klikləyin</p>
            </div>

            <div className="bg-[#0A0A0A] text-white rounded-3xl p-6 lg:p-8 shadow-xl">
              <h3 className="text-lg font-bold mb-4">Kurs Statusu</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Görünüş</span>
                  <span className="px-3 py-1 bg-[#00D084]/20 text-[#00D084] rounded-full text-xs font-bold">
                    Açıq
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Tələbə sayı</span>
                  <span className="font-bold">124</span>
                </div>
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl mt-4">
                  Kursu Gizlət
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
