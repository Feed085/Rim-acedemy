import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Save, 
  Image as ImageIcon,
  BookOpen,
  Layout,
  Tag
} from 'lucide-react';
import { toast } from 'sonner';
import { mockDb } from '@/services/mockDb';
import { teachers } from '@/data/mockData';

import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CreateCourse() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const categories = mockDb.getCategories();
  
  const [formData, setFormData] = useState({
    title: '',
    category: mockDb.getCategories()[0]?.id || '',
    price: '',
    description: '',
    image: null as File | null,
    imageUrl: '' as string
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ 
        ...prev, 
        image: file,
        imageUrl: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category) {
      toast.error('Zəhmət olmasa əsas xanalara məlumat yazın');
      return;
    }

    setIsSaving(true);
    
    const teacher = teachers[0]; // Currently mocking as first teacher
    
    const newCourse = {
      title: formData.title,
      category: formData.category,
      price: 0,
      description: formData.description,
      image: formData.imageUrl || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
      teacherId: teacher.id,
      teacherName: teacher.name,
      teacherAvatar: teacher.avatar,
      duration: '0 saat',
      lessonCount: 0,
      studentCount: 0,
      rating: 0
    };

    mockDb.addCourse(newCourse);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    
    toast.success('Yeni kurs uğurla yaradıldı!');
    navigate('/teacher/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F3F3F3] pt-20 lg:pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900">
              Yeni Kurs Yarat
            </h1>
            <p className="text-gray-600">
              Tələbələr üçün yeni bir təlim proqramı hazırlayın
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-[#00D084]" />
                  Kursun Məlumatları
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kursun Adı</label>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Məs: IELTS Preparation Mastery"
                        className="pl-12 h-12 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kateqoriya</label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(val) => setFormData({ ...formData, category: val })}
                      >
                        <SelectTrigger className="w-full h-12 rounded-xl bg-white border-gray-200">
                          <div className="flex items-center gap-3">
                            <Tag className="w-5 h-5 text-gray-400" />
                            <SelectValue placeholder="Kateqoriya seçin" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-100 rounded-xl shadow-xl">
                          {categories.map((cat: any) => (
                            <SelectItem 
                              key={cat.id} 
                              value={cat.id}
                              className="py-3 px-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Haqqında</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Kurs barədə ətraflı məlumat..."
                      className="rounded-xl min-h-[150px] resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar / Media */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#00D084]" />
                  Kover Şəkli
                </h3>
                
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 relative group cursor-pointer">
                  {formData.imageUrl ? (
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon className="w-10 h-10 mb-2" />
                      <span className="text-xs">Şəkil seçin</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-2 text-center uppercase tracking-wider">
                  Tövsiyə olunan ölçü: 1280x720 (16:9)
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSaving}
                className="w-full bg-[#00D084] hover:bg-[#00B873] text-white font-bold h-14 rounded-2xl shadow-lg shadow-[#00D084]/20 transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Kursu Yadda Saxla
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
