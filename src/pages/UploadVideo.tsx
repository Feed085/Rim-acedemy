import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, 
  Video, 
  FileVideo,
  Image as ImageIcon,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { mockDb } from '@/services/mockDb';
import { teachers } from '@/data/mockData';

export default function UploadVideo() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo({
      top: 150,
      behavior: 'smooth'
    });
  }, []);

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
  });

  const teacher = teachers[0];
  const teacherCourses = mockDb.getTeacherCourses(teacher.id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        toast.success('Video seçildi!');
      } else {
        toast.error('Zəhmət olmasa video faylı seçin');
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        toast.success('Video seçildi!');
      } else {
        toast.error('Zəhmət olmasa video faylı seçin');
      }
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setThumbnail(file);
      } else {
        toast.error('Zəhmət olmasa şəkil faylı seçin');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile) {
      toast.error('Zəhmət olmasa video faylı seçin');
      return;
    }
    if (!formData.title || !formData.courseId) {
      toast.error('Zəhmət olmasa bütün sahələri doldurun');
      return;
    }

    setIsUploading(true);
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    mockDb.addLessonToCourse(formData.courseId, formData.title);
    
    setIsUploading(false);
    setIsUploaded(true);
    toast.success('Video dərsi uğurla əlavə edildi!');
  };

  if (isUploaded) {
    return (
      <div className="min-h-screen bg-[#F3F3F3] pt-20 lg:pt-24 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-4">
            Video uğurla yükləndi!
          </h1>
          <p className="text-gray-600 mb-8">
            Video'nuz təsdiqləndikdən sonra dərc olunacaq.
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1 rounded-xl"
            >
              Geri qayıt
            </Button>
            <Button
              onClick={() => {
                setIsUploaded(false);
                setVideoFile(null);
                setThumbnail(null);
                setFormData({ title: '', description: '', courseId: '' });
              }}
              className="flex-1 bg-[#00D084] hover:bg-[#00B873] rounded-xl"
            >
              Yeni video yüklə
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F3F3] pt-20 lg:pt-24">
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
              {t('teacher.upload.title')}
            </h1>
            <p className="text-gray-600">
              Yeni video dərs yükləyin
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Video Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-3xl p-8 lg:p-12 text-center transition-all ${
              isDragging
                ? 'border-[#00D084] bg-[#00D084]/5'
                : videoFile
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
          >
            <input
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            {videoFile ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                  <FileVideo className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{videoFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setVideoFile(null);
                  }}
                  className="text-red-500 hover:text-red-600 text-sm font-medium"
                >
                  Sil
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Videonu bura sürükləyin
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    və ya klikləyib seçin
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  MP4, MOV, AVI (maks. 500MB)
                </p>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('teacher.upload.course')}
              </label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#00D084] focus:ring-[#00D084] outline-none"
              >
                <option value="">Kurs seçin</option>
                {teacherCourses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('teacher.upload.title_label')}
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Video başlığı"
                required
                className="h-12 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('teacher.upload.description')}
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Video haqqında qısa məlumat..."
                rows={4}
                className="rounded-xl resize-none"
              />
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('teacher.upload.thumbnail')}
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-32 h-20 bg-gray-100 rounded-xl overflow-hidden">
                  {thumbnail ? (
                    <img
                      src={URL.createObjectURL(thumbnail)}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-medium">Şəkil seç</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailSelect}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Tövsiyə olunan ölçü: 1280x720
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isUploading}
            className="w-full bg-[#00D084] hover:bg-[#00B873] text-white font-semibold rounded-xl h-14 text-lg"
          >
            {isUploading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Yüklənir...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5" />
                <span>{t('teacher.upload.upload')}</span>
              </div>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
