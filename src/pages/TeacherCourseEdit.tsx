import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  PlayCircle, 
  FileText,
  Video,
  Settings,
  Image as ImageIcon,
  Users,
  Plus,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { mockDb } from '@/services/mockDb';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function TeacherCourseEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // Always scroll to top on visit
    const allCourses = mockDb.getCourses();
    const foundCourse = allCourses.find(c => c.id === id);
    if (foundCourse) {
      setCourse({ ...foundCourse });
      setLessons(mockDb.getLessons(id || ''));
      setTests(mockDb.getTests(id || ''));
    }
  }, [id]);





  const removeLesson = (lessonId: number) => {
    if (id) {
      mockDb.deleteLesson(id, lessonId);
      setLessons(mockDb.getLessons(id));
      toast.info('Video dərsi silindi');
    }
  };

  const handleEditClick = (lesson: any) => {
    setEditingLesson({ ...lesson });
    setIsEditorOpen(true);
  };

  const handleUpdateLesson = () => {
    if (id && editingLesson) {
      mockDb.updateLesson(id, editingLesson.id, {
        title: editingLesson.title,
        description: editingLesson.description,
        thumbnail: editingLesson.thumbnail
      });
      setLessons(mockDb.getLessons(id));
      setIsEditorOpen(false);
      setEditingLesson(null);
      toast.success('Video məlumatları yeniləndi');
    }
  };

  const addNewLesson = () => {
    if (id) {
      mockDb.addLessonToCourse(id);
      setLessons(mockDb.getLessons(id));
      toast.success('Yeni video dərs əlavə edildi');
    }
  };

  const addNewTest = () => {
    if (id) {
      const newTest = {
        title: 'Yeni Test',
        courseId: id,
        courseName: course.title,
        teacherId: course.teacherId,
        duration: 30,
        questionCount: 0,
        questions: [],
        isActive: true,
        createdAt: new Date()
      };
      mockDb.addTestToCourse(id, newTest);
      setTests(mockDb.getTests(id));
      toast.success('Yeni test əlavə edildi');
    }
  };

  const handleSave = () => {
    if (id) {
      mockDb.updateCourse(id, {
        title: course.title,
        category: course.category,
        description: course.description,
        image: course.image,
        learningPoints: course.learningPoints || [],
        includes: course.includes || []
      });
      toast.success('Kurs məlumatları uğurla yeniləndi');
      navigate('/teacher/dashboard');
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p>Kurs tapılmadı</p>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-[#F3F3F3] pt-20 lg:pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-2 p-0 h-auto hover:bg-transparent text-gray-500 hover:text-gray-900 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Geri qayıt
            </Button>
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900">
              Kursu Redaktə Et
            </h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl" onClick={() => navigate(-1)}>
              Ləğv et
            </Button>
            <Button 
              className="bg-[#00D084] hover:bg-[#00B873] text-white rounded-xl px-8 font-bold shadow-lg shadow-[#00D084]/20 transition-all active:scale-95" 
              onClick={handleSave}
            >
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
                <Button 
                  onClick={addNewLesson}
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl border-[#00D084] text-[#00D084] hover:bg-[#00D084]/5 font-bold"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Video Əlavə Et
                </Button>
              </div>
              <div className="space-y-3">
                {lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <PlayCircle className="w-6 h-6 text-[#00D084]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{lesson.title}</h4>
                        <p className="text-xs text-gray-500">{lesson.duration} dəq</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-400 hover:text-gray-900 transition-colors"
                        onClick={() => handleEditClick(lesson)}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-400 hover:text-red-600 transition-all hover:scale-110"
                        onClick={() => removeLesson(lesson.id)}
                      >
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
                <Button 
                  onClick={addNewTest}
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl border-[#00D084] text-[#00D084] hover:bg-[#00D084]/5 font-bold"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Test Əlavə Et
                </Button>
              </div>
              <div className="space-y-3">
                {tests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-4 text-sm font-bold text-gray-900">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <FileText className="w-6 h-6 text-blue-500" />
                      </div>
                      {test.title}
                    </div>
                    <div className="flex gap-2">
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="h-8 w-8 text-[#00D084] hover:bg-[#00D084]/10 transition-colors"
                         onClick={() => navigate(`/teacher/tests/${test.id}/results`)}
                         title="Nəticələrə bax"
                       >
                         <Users className="w-5 h-5" />
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="h-8 w-8 text-gray-400 hover:text-gray-900 transition-colors"
                         onClick={() => navigate(`/teacher/tests/${test.id}`)}
                       >
                         <Settings className="w-4 h-4" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400">
                         <Trash2 className="w-4 h-4" />
                       </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>

            {/* What You'll Learn */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#00D084]" />
                  Bu kursda nə öyrənəcəksiniz?
                </h2>
                <Button 
                  onClick={() => {
                    const newPoints = [...(course.learningPoints || []), 'Yeni öyrənəcəyiniz bənd'];
                    setCourse({ ...course, learningPoints: newPoints });
                  }}
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl border-[#00D084] text-[#00D084] hover:bg-[#00D084]/5 font-bold"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Bənd Əlavə Et
                </Button>
              </div>
              <div className="space-y-3">
                {(course.learningPoints || []).map((point: string, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <Input 
                      value={point}
                      onChange={(e) => {
                        const newPoints = [...course.learningPoints];
                        newPoints[idx] = e.target.value;
                        setCourse({ ...course, learningPoints: newPoints });
                      }}
                      className="rounded-xl border-gray-200"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        const newPoints = course.learningPoints.filter((_: any, i: number) => i !== idx);
                        setCourse({ ...course, learningPoints: newPoints });
                      }}
                      className="text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Includes */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#00D084]" />
                  Kurs daxildir
                </h2>
                <Button 
                  onClick={() => {
                    const newIncludes = [...(course.includes || []), 'Yeni xüsusiyyət'];
                    setCourse({ ...course, includes: newIncludes });
                  }}
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl border-[#00D084] text-[#00D084] hover:bg-[#00D084]/5 font-bold"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Əlavə Et
                </Button>
              </div>
              <div className="space-y-3">
                {(course.includes || []).map((item: string, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <Input 
                      value={item}
                      onChange={(e) => {
                        const newIncludes = [...course.includes];
                        newIncludes[idx] = e.target.value;
                        setCourse({ ...course, includes: newIncludes });
                      }}
                      className="rounded-xl border-gray-200"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        const newIncludes = course.includes.filter((_: any, i: number) => i !== idx);
                        setCourse({ ...course, includes: newIncludes });
                      }}
                      className="text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
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
                <input 
                  type="file" 
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const fakeUrl = URL.createObjectURL(file);
                      setCourse({ ...course, image: fakeUrl });
                    }
                  }}
                />
              </div>
              <p className="text-xs text-center text-gray-500">Şəkli dəyişmək üçün üzərinə klikləyin</p>
            </div>

          </div>
        </div>
        
        {/* Floating Save Button */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-white/50 flex gap-4">
            <Button 
                onClick={() => navigate(-1)}
                variant="outline"
                className="rounded-xl px-8 h-12 font-bold bg-white border-2 border-gray-100"
            >
              Ləğv et
            </Button>
            <Button 
                onClick={handleSave}
                className="bg-[#00D084] hover:bg-[#00B873] text-white rounded-xl px-12 h-12 font-bold shadow-lg shadow-[#00D084]/20 transition-all active:scale-95"
            >
              <Save className="w-4 h-4 mr-2" />
              Yadda Saxla
            </Button>
        </div>
      </div>

      {/* Video Edit Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold italic">Video Dərsi Redaktə Et</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Thumbnail Preview/Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">Video Qapağı (Kaver)</Label>
              <div className="relative aspect-video max-w-[280px] mx-auto rounded-2xl overflow-hidden bg-gray-100 group cursor-pointer border-2 border-dashed border-gray-200 hover:border-[#00D084]/50 transition-colors">
                <img 
                  src={editingLesson?.thumbnail || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80'} 
                  alt="Video Thumbnail"
                  className="w-full h-full object-cover group-hover:opacity-40 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/90 p-3 rounded-full shadow-lg">
                    <ImageIcon className="w-6 h-6 text-[#00D084]" />
                  </div>
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const fakeUrl = URL.createObjectURL(file);
                      setEditingLesson({ ...editingLesson, thumbnail: fakeUrl });
                    }
                  }}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title" className="text-sm font-bold text-gray-700">Video Başlığı</Label>
              <Input
                id="title"
                value={editingLesson?.title || ''}
                onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                className="rounded-xl h-11 border-gray-200 focus:border-[#00D084]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm font-bold text-gray-700">Açıqlama</Label>
              <Textarea
                id="description"
                value={editingLesson?.description || ''}
                onChange={(e) => setEditingLesson({ ...editingLesson, description: e.target.value })}
                placeholder="Video dərsi haqqında ətraflı məlumat..."
                className="rounded-xl min-h-[80px] border-gray-200 focus:border-[#00D084] resize-none"
              />
            </div>
          </div>
          <DialogFooter className="sticky bottom-0 bg-white pt-2 border-t mt-4">
            <Button 
              className="bg-[#00D084] hover:bg-[#00B873] text-white rounded-xl w-full h-12 font-bold shadow-lg shadow-[#00D084]/20"
              onClick={handleUpdateLesson}
            >
              Dəyişiklikləri Yadda Saxla
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
