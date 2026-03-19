import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { courses } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Trash2, 
  CheckCircle, 
  ArrowLeft,
  Save,
  FileText,
  Clock,
  HelpCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function CreateTest() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
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

    const emptyQuestion = questions.find(q => !q.question || q.options.some(o => !o));
    if (emptyQuestion) {
      toast.error('Bütün sualları və variantları doldurun');
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSaving(false);
    setIsSaved(true);
    toast.success('Test uğurla yaradıldı!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTestData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
              onClick={() => navigate('/teacher/dashboard')}
              className="flex-1 rounded-xl"
            >
              Panelə qayıt
            </Button>
            <Button
              onClick={() => {
                setIsSaved(false);
                setTestData({ title: '', courseId: '', duration: 30 });
                setQuestions([{
                  id: '1',
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
            onClick={() => navigate('/teacher/dashboard')}
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
                  {courses.map(course => (
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
              <Button
                type="button"
                onClick={addQuestion}
                variant="outline"
                className="rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Sual əlavə et
              </Button>
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

                <div className="space-y-4">
                  <Input
                    value={question.question}
                    onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                    placeholder="Sual mətnini daxil edin..."
                    required
                    className="h-12 rounded-xl"
                  />

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
                          placeholder={`Variant ${String.fromCharCode(65 + oIndex)}`}
                          required
                          className={`pl-12 h-12 rounded-xl ${
                            question.correctAnswer === oIndex
                              ? 'border-[#00D084] ring-1 ring-[#00D084]'
                              : ''
                          }`}
                        />
                        {question.correctAnswer === oIndex && (
                          <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00D084]" />
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-gray-500">
                    Düzgün cavabı seçmək üçün hərfə klikləyin
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSaving}
            className="w-full bg-[#00D084] hover:bg-[#00B873] text-white font-semibold rounded-xl h-14 text-lg"
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
        </form>
      </div>
    </div>
  );
}
