import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  FileText,
  CheckCircle2,
  Circle,
  Image as ImageIcon,
  Type,
  MinusCircle,
  PlusCircle
} from 'lucide-react';
import { mockDb } from '@/services/mockDb';
import { toast } from 'sonner';

export default function TeacherTestEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const foundTest = mockDb.getTestById(id);
      if (foundTest) {
        const cloned = JSON.parse(JSON.stringify(foundTest));
        // Ensure every question has a type
        cloned.questions = cloned.questions.map((q: any) => ({
          ...q,
          type: q.type || 'text'
        }));
        setTest(cloned);
      }
    }
  }, [id]);

  const handleSave = () => {
    if (id && test) {
      mockDb.updateTest(id, test);
      toast.success('Test uğurla yadda saxlanıldı');
      // Sayfada kalması istendiği için navigate(-1) kaldırıldı
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      type: 'text',
      text: 'Yeni sual',
      options: ['Variant A', 'Variant B', 'Variant C', 'Variant D'],
      correctAnswerIdx: 0
    };
    setTest({
      ...test,
      questions: [...test.questions, newQuestion]
    });
  };

  const removeQuestion = (questionId: number) => {
    setTest({
      ...test,
      questions: test.questions.filter((q: any) => q.id !== questionId)
    });
  };

  const updateQuestion = (questionId: number, field: string, value: any) => {
    setTest({
      ...test,
      questions: test.questions.map((q: any) => 
        q.id === questionId ? { ...q, [field]: value } : q
      )
    });
  };

  const updateOption = (questionId: number, optionIndex: number, value: string) => {
    setTest({
      ...test,
      questions: test.questions.map((q: any) => {
        if (q.id === questionId) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      })
    });
  };

  if (!test) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">Test tapılmadı</h2>
          <Button onClick={() => navigate(-1)} variant="link">Geri qayıt</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F3F3] pt-20 lg:pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
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
              Testi Redaktə Et
            </h1>
          </div>
          <div className="flex gap-3">
            <Button 
                variant="outline" 
                className="rounded-xl border-gray-200" 
                onClick={() => navigate(-1)}
            >
              Ləğv et
            </Button>
            <Button 
                className="bg-[#00D084] hover:bg-[#00B873] text-white rounded-xl px-8 font-bold shadow-lg shadow-[#00D084]/20" 
                onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-2" />
              Yadda Saxla
            </Button>
          </div>
        </div>

        {/* Test Info */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 mb-8">
          <label className="block text-sm font-bold text-gray-700 mb-2">Testin Başlığı</label>
          <Input 
            value={test.title}
            onChange={(e) => setTest({ ...test, title: e.target.value })}
            className="rounded-xl h-12 text-lg font-bold border-gray-200 focus:border-[#00D084]"
          />
        </div>

        {/* Questions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#00D084]" />
              Suallar ({test.questions.length})
            </h2>
          </div>

          {test.questions.map((question: any, index: number) => (
            <div key={question.id} className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 relative group">
              <button 
                onClick={() => removeQuestion(question.id)}
                className="absolute top-6 right-6 p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-lg bg-[#00D084]/10 text-[#00D084] flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Sual</span>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Sualın mətni</label>
                    <Input 
                      value={question.text}
                      onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                      className="rounded-xl h-12 border-gray-200 focus:border-[#00D084] font-medium"
                    />
                  </div>
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
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-widest text-[10px]">Variantlar</label>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          if (question.options.length > 2) {
                            const newOptions = [...question.options];
                            newOptions.pop();
                            const newCorrect = !newOptions.includes(question.correctAnswer) ? newOptions[0] : question.correctAnswer;
                            updateQuestion(question.id, 'options', newOptions);
                            updateQuestion(question.id, 'correctAnswer', newCorrect);
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <MinusCircle className="w-5 h-5" />
                      </button>
                      <span className="text-xs font-black">{question.options.length}</span>
                      <button 
                        onClick={() => {
                          if (question.options.length < 6) {
                            const newOptions = [...question.options, `Variant ${String.fromCharCode(65 + question.options.length)}`];
                            updateQuestion(question.id, 'options', newOptions);
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-[#00D084] transition-colors"
                      >
                        <PlusCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {question.options.map((option: string, optIndex: number) => (
                      <div key={optIndex} className={`relative flex items-center p-3 rounded-2xl border-2 transition-all ${
                          question.correctAnswerIdx === optIndex 
                          ? 'border-[#00D084] bg-[#00D084]/5 shadow-sm' 
                          : 'border-gray-50 hover:border-gray-100'
                      }`}>
                          <button
                              onClick={() => updateQuestion(question.id, 'correctAnswerIdx', optIndex)}
                              className={`mr-3 transition-colors ${
                                  question.correctAnswerIdx === optIndex ? 'text-[#00D084]' : 'text-gray-300'
                              }`}
                          >
                              {question.correctAnswerIdx === optIndex ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                          </button>
                          <Input 
                              value={option}
                              onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                              placeholder={`Variant ${String.fromCharCode(65 + optIndex)}`}
                              className="border-none bg-transparent focus-visible:ring-0 p-0 font-medium h-auto"
                          />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Add Button For Convenience */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-white/50 flex gap-4">
             <Button 
                onClick={addQuestion}
                className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-100 rounded-xl px-8 h-12 font-bold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Sual Əlavə Et
            </Button>
            <Button 
                onClick={handleSave}
                className="bg-[#00D084] hover:bg-[#00B873] text-white rounded-xl px-8 h-12 font-bold shadow-lg shadow-[#00D084]/20"
            >
              <Save className="w-4 h-4 mr-2" />
              Yadda Saxla
            </Button>
        </div>
      </div>
    </div>
  );
}
