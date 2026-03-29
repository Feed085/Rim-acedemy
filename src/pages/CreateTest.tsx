import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockDb } from '@/services/mockDb';
import { teachers } from '@/data/mockData';
import { 
  Plus, 
  Trash2, 
  CheckCircle, 
  ArrowLeft,
  Save,
  FileText,
  Clock,
  HelpCircle,
  Image as ImageIcon,
  Type,
  MinusCircle,
  PlusCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  id: string;
  type: 'text' | 'image';
  question: string;
  image?: string;
  options: string[];
  correctAnswer: number;
}

export default function CreateTest() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const durationInputRef = useRef<HTMLInputElement>(null);
  
  const teacher = teachers[0];
  const teacherCourses = mockDb.getTeacherCourses(teacher.id);

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [testData, setTestData] = useState({
    title: '',
    courseId: '',
    duration: 30,
  });
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      type: 'text',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    },
  ]);

  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'text',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
    ]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(prev => prev.filter(q => q.id !== id));
    } else {
      toast.error('Ən azı bir sual olmalıdır');
    }
  };

  const updateQuestion = (id: string, field: keyof Question, value: string | number) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === id ? { ...q, [field]: value } : q
      )
    );
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) =>
                idx === optionIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!testData.title || !testData.courseId) {
      toast.error('Zəhmət olmasa test başlığı və kurs seçin');
      return;
    }

    const emptyQuestion = questions.find(q => 
      q.type === 'text' 
        ? (!q.question || q.options.some(o => !o)) 
        : !q.image
    );

    if (emptyQuestion) {
      toast.error(
        emptyQuestion.type === 'text' 
          ? 'Bütün sualları və variantları doldurun' 
          : 'Sualın şəklini yükləyin'
      );
      return;
    }

    setIsSaving(true);
    
    // Simulate slight delay for premium feel
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newTest = {
      title: testData.title,
      duration: testData.duration,
      questions: questions.map(q => ({
        id: q.id,
        type: q.type,
        text: q.question,
        image: q.image,
        options: q.options,
        correctAnswerIdx: q.correctAnswer,
        correctAnswer: q.options[q.correctAnswer] || String.fromCharCode(65 + q.correctAnswer)
      }))
    };

    mockDb.addTestToCourse(testData.courseId, newTest);
    
    setIsSaving(false);
    setIsSaved(true);
    
    toast.success('Test uğurla yaradıldı və kursa əlavə edildi');
    
    setTimeout(() => {
      navigate(`/teacher/courses/${testData.courseId}`);
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTestData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const input = durationInputRef.current;
    if (!input) return;

    const handleWheelManual = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 1 : -1;
      setTestData(prev => ({
        ...prev,
        duration: Math.max(5, Math.min(180, Number(prev.duration) + delta))
      }));
    };

    input.addEventListener('wheel', handleWheelManual, { passive: false });
    return () => input.removeEventListener('wheel', handleWheelManual);
  }, []);

  if (isSaved) {
    return (
      <div className="min-h-screen bg-[#F3F3F3] pt-20 lg:pt-24 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-4">
            Test uğurla yaradıldı!
          </h1>
          <p className="text-gray-600 mb-8">
            Test'iniz təsdiqləndikdən sonra aktiv olacaq.
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
                setIsSaved(false);
                setTestData({ title: '', courseId: '', duration: 30 });
                setQuestions([{
                  id: '1',
                  type: 'text',
                  question: '',
                  options: ['', '', '', ''],
                  correctAnswer: 0,
                }]);
              }}
              className="flex-1 bg-[#00D084] hover:bg-[#00B873] rounded-xl"
            >
              Yeni test yarat
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
              {t('teacher.test.title')}
            </h1>
            <p className="text-gray-600">
              Yeni online test yaradın
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Test Info */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('teacher.test.test_title')}
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    name="title"
                    value={testData.title}
                    onChange={handleChange}
                    placeholder="Məs: IELTS Listening Test 1"
                    required
                    className="pl-12 h-12 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('teacher.test.course')}
                </label>
                <select
                  name="courseId"
                  value={testData.courseId}
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('teacher.test.duration')}
              </label>
              <div className="relative max-w-xs">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  ref={durationInputRef}
                  name="duration"
                  type="number"
                  value={testData.duration}
                  onChange={handleChange}
                  min={5}
                  max={180}
                  required
                  className="pl-12 h-12 rounded-xl"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  dəqiqə
                </span>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Suallar ({questions.length})
              </h2>
            </div>

            {questions.map((question, qIndex) => (
              <div
                key={question.id}
                className="bg-white rounded-3xl p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#00D084]/10 rounded-xl flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-[#00D084]" />
                    </div>
                    <span className="font-bold text-gray-900">
                      Sual {qIndex + 1}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeQuestion(question.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-6 p-2 bg-gray-50 rounded-2xl w-fit">
                   <button
                     type="button"
                     onClick={() => updateQuestion(question.id, 'type', 'text')}
                     className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        question.type === 'text' ? 'bg-white text-[#00D084] shadow-sm' : 'text-gray-400 hover:text-gray-600'
                     }`}
                   >
                     <Type className="w-4 h-4" />
                     Mətn Rejimi
                   </button>
                   <button
                     type="button"
                     onClick={() => updateQuestion(question.id, 'type', 'image')}
                     className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        question.type === 'image' ? 'bg-white text-[#00D084] shadow-sm' : 'text-gray-400 hover:text-gray-600'
                     }`}
                   >
                     <ImageIcon className="w-4 h-4" />
                     Şəkil Rejimi
                   </button>
                </div>

                <div className="space-y-6">
                  {question.type === 'text' ? (
                    <Input
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                      placeholder="Sual mətnini daxil edin..."
                      required
                      className="h-12 rounded-xl border-gray-200 focus:border-[#00D084]"
                    />
                  ) : (
                    <div className="space-y-4">
                       <div className="relative aspect-video max-w-lg rounded-2xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 group cursor-pointer hover:border-[#00D084]/50 transition-colors">
                          {question.image ? (
                            <>
                              <img src={question.image} alt="Sual" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <p className="text-white text-xs font-bold">Şəkli dəyişmək üçün klikləyin</p>
                              </div>
                            </>
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                               <ImageIcon className="w-10 h-10 mb-2 opacity-20" />
                               <p className="text-sm font-bold">Sualın şəklini yükləyin</p>
                            </div>
                          )}
                          <input 
                            type="file" 
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => {
                               const file = e.target.files?.[0];
                               if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                     updateQuestion(question.id, 'image', reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                               }
                            }}
                          />
                       </div>
                    </div>
                  )}

                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-gray-700">Variantlar</label>
                        <div className="flex items-center gap-2">
                           <button 
                            type="button"
                            onClick={() => {
                               if (question.options.length > 2) {
                                  const newOptions = [...question.options];
                                  newOptions.pop();
                                  setQuestions(prev => prev.map(q => q.id === question.id ? { ...q, options: newOptions, correctAnswer: Math.min(q.correctAnswer, newOptions.length - 1) } : q));
                               }
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                           >
                              <MinusCircle className="w-5 h-5" />
                           </button>
                           <span className="text-xs font-black w-4 text-center">{question.options.length}</span>
                           <button 
                            type="button"
                            onClick={() => {
                               if (question.options.length < 6) {
                                  const newOptions = [...question.options, ''];
                                  setQuestions(prev => prev.map(q => q.id === question.id ? { ...q, options: newOptions } : q));
                               }
                            }}
                            className="p-1 text-gray-400 hover:text-[#00D084] transition-colors"
                           >
                              <PlusCircle className="w-5 h-5" />
                           </button>
                        </div>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {question.options.map((option, oIndex) => (
                           <div key={oIndex} className="relative">
                              <div
                                className={`absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-colors ${
                                  question.correctAnswer === oIndex
                                    ? 'bg-[#00D084] text-white'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                                onClick={() => updateQuestion(question.id, 'correctAnswer', oIndex)}
                              >
                                {String.fromCharCode(65 + oIndex)}
                              </div>
                              <Input
                                value={option}
                                onChange={(e) => updateOption(question.id, oIndex, e.target.value)}
                                placeholder={`Variant ${String.fromCharCode(65 + oIndex)} ${question.type === 'image' ? '(Opsional)' : ''}`}
                                required={question.type === 'text'}
                                className={`pl-12 h-12 rounded-xl border-gray-100 focus:border-[#00D084] ${
                                  question.correctAnswer === oIndex ? 'border-[#00D084] ring-1 ring-[#00D084]' : ''
                                }`}
                              />
                           </div>
                        ))}
                     </div>
                  </div>

                  <p className="text-xs text-gray-400 italic">
                    Düzgün cavabı seçmək üçün variantın hərfinə (A, B, C...) klikləyin.
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Combined Bottom Floating Bar */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-white/50 flex items-center gap-4">
            <Button
              type="button"
              onClick={addQuestion}
              variant="outline"
              className="rounded-xl border-gray-200 h-12 px-6 font-bold bg-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Sual əlavə et
            </Button>
            
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-[#00D084] hover:bg-[#00B873] text-white font-bold rounded-xl h-12 px-10 shadow-lg shadow-[#00D084]/20 min-w-[180px]"
            >
              {isSaving ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Yadda saxlanır...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Save className="w-5 h-5" />
                  <span>{t('teacher.test.save')}</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
