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
  PlusCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/services/publicApi';

interface Question {
  _id?: string;
  id: string | number;
  questionType: 'text' | 'image';
  content: string;
  imageFile?: File;
  answerType: 'multiple_choice' | 'open_ended';
  options: string[];
  correctAnswer: string;
}

export default function TeacherTestEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      if (!id) return;
      const token = localStorage.getItem('rim_auth_token');
      try {
        const res = await fetch(`${API_BASE_URL}/tests/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          // Normalize for frontend
          const normalizedQuestions = data.data.questions.map((q: any) => ({
            ...q,
            id: q._id, // use MongoDB ID as UI ID
          }));
          setTest({ ...data.data, questions: normalizedQuestions });
        } else {
          toast.error('Test tapılmadı');
        }
      } catch (err) {
        toast.error('Server xətası');
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [id]);

  const handleSave = async () => {
    if (!id || !test) return;
    
    setIsSaving(true);
    const token = localStorage.getItem('rim_auth_token');

    try {
      // 1. Upload new images if any
      const formattedQuestions = [];
      for (const q of test.questions) {
        let finalContent = q.content;
        
        if (q.questionType === 'image' && q.imageFile) {
          const presignReq = await fetch(
            `${API_BASE_URL}/upload/presign?filename=${encodeURIComponent(q.imageFile.name)}&contentType=${encodeURIComponent(q.imageFile.type)}`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          const presignData = await presignReq.json();
          if (presignData.success) {
            await fetch(presignData.data.signedUrl, {
              method: 'PUT',
              headers: { 'Content-Type': q.imageFile.type },
              body: q.imageFile
            });
            finalContent = presignData.data.publicUrl;
          }
        }

        formattedQuestions.push({
          questionType: q.questionType,
          content: finalContent,
          answerType: q.answerType,
          options: q.answerType === 'multiple_choice' ? q.options : [],
          correctAnswer: q.correctAnswer
        });
      }

      // 2. Update Test
      const res = await fetch(`${API_BASE_URL}/tests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: test.title,
          duration: test.duration,
          questions: formattedQuestions
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Test uğurla yeniləndi');
        setTimeout(() => navigate(-1), 1000);
      } else {
        toast.error('Xəta: ' + data.message);
      }
    } catch (err) {
      toast.error('Server xətası');
    } finally {
      setIsSaving(false);
    }
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      questionType: 'text',
      content: 'Yeni sual',
      answerType: 'multiple_choice',
      options: ['Variant A', 'Variant B', 'Variant C', 'Variant D'],
      correctAnswer: 'Variant A'
    };
    setTest({
      ...test,
      questions: [...test.questions, newQuestion]
    });
  };

  const removeQuestion = (id: string | number) => {
    if (test.questions.length > 1) {
      setTest({
        ...test,
        questions: test.questions.filter((q: any) => q.id !== id)
      });
    } else {
      toast.error('Ən azı bir sual olmalıdır');
    }
  };

  const updateQuestionField = (id: string | number, field: keyof Question, value: any) => {
    setTest({
      ...test,
      questions: test.questions.map((q: any) => 
        q.id === id ? { ...q, [field]: value } : q
      )
    });
  };

  const updateOption = (id: string | number, optIndex: number, value: string) => {
    setTest({
      ...test,
      questions: test.questions.map((q: any) => {
        if (q.id === id) {
          const newOptions = [...q.options];
          const oldOptionValue = newOptions[optIndex];
          newOptions[optIndex] = value;
          
          // If the changed option was the correct answer, update it
          let newCorrect = q.correctAnswer;
          if (q.correctAnswer === oldOptionValue) {
             newCorrect = value;
          }

          return { ...q, options: newOptions, correctAnswer: newCorrect };
        }
        return q;
      })
    });
  };

  if (loading) {
     return (
       <div className="min-h-screen pt-24 flex items-center justify-center bg-[#F3F3F3]">
         <p className="text-gray-500 font-bold">Yüklənir...</p>
       </div>
     );
  }

  if (!test) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[#F3F3F3]">
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
                disabled={isSaving}
            >
              {isSaving ? 'Yadda saxlanılır...' : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Yadda Saxla
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Test Info */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 mb-8 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Testin Başlığı</label>
                <Input 
                  value={test.title}
                  onChange={(e) => setTest({ ...test, title: e.target.value })}
                  className="rounded-xl h-12 text-lg font-bold border-gray-200 focus:border-[#00D084]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Müddət (Dəqiqə)</label>
                <Input 
                  type="number"
                  value={test.duration}
                  onChange={(e) => setTest({ ...test, duration: Number(e.target.value) })}
                  className="rounded-xl h-12 text-lg font-bold border-gray-200 focus:border-[#00D084]"
                />
              </div>
           </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#00D084]" />
              Suallar ({test.questions.length})
            </h2>
          </div>

          {test.questions.map((question: any, qIdx: number) => (
            <div key={question.id} className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 relative group">
              <button 
                onClick={() => removeQuestion(question.id)}
                className="absolute top-6 right-6 p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-lg bg-[#00D084]/10 text-[#00D084] flex items-center justify-center font-bold text-sm">
                  {qIdx + 1}
                </span>
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Sual</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 rounded-2xl w-fit">
                     <button
                       type="button"
                       onClick={() => updateQuestionField(question.id, 'questionType', 'text')}
                       className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          question.questionType === 'text' ? 'bg-white text-[#00D084] shadow-sm' : 'text-gray-400 hover:text-gray-600'
                       }`}
                     >
                       <Type className="w-4 h-4" />
                       Mətn Sualı
                     </button>
                     <button
                       type="button"
                       onClick={() => updateQuestionField(question.id, 'questionType', 'image')}
                       className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          question.questionType === 'image' ? 'bg-white text-[#00D084] shadow-sm' : 'text-gray-400 hover:text-gray-600'
                       }`}
                     >
                       <ImageIcon className="w-4 h-4" />
                       Şəkil Sualı
                     </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 p-2 bg-blue-50/50 rounded-2xl w-fit">
                     <button
                       type="button"
                       onClick={() => updateQuestionField(question.id, 'answerType', 'multiple_choice')}
                       className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          question.answerType === 'multiple_choice' ? 'bg-white text-blue-600 shadow-sm' : 'text-blue-400 hover:text-blue-600'
                       }`}
                     >
                       <CheckCircle className="w-4 h-4" />
                       Qapalı Test
                     </button>
                     <button
                       type="button"
                       onClick={() => updateQuestionField(question.id, 'answerType', 'open_ended')}
                       className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          question.answerType === 'open_ended' ? 'bg-white text-blue-600 shadow-sm' : 'text-blue-400 hover:text-blue-600'
                       }`}
                     >
                       <FileText className="w-4 h-4" />
                       Açıq Sual (Yazı)
                     </button>
                  </div>
              </div>

              <div className="space-y-6">
                {question.questionType === 'text' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Sualın mətni</label>
                    <Input 
                      value={question.content}
                      onChange={(e) => updateQuestionField(question.id, 'content', e.target.value)}
                      className="rounded-xl h-12 border-gray-200 focus:border-[#00D084] font-medium"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                     <div className="relative aspect-video max-w-lg rounded-2xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 group cursor-pointer hover:border-[#00D084]/50 transition-colors">
                        {question.content ? (
                          <>
                            <img src={question.content} alt="Sual" className="w-full h-full object-cover" />
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
                                const fakeUrl = URL.createObjectURL(file);
                                updateQuestionField(question.id, 'content', fakeUrl);
                                updateQuestionField(question.id, 'imageFile', file as any);
                             }
                          }}
                        />
                     </div>
                  </div>
                )}

                {question.answerType === 'multiple_choice' ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-widest text-[10px]">Variantlar</label>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              if (question.options.length > 2) {
                                const newOptions = [...question.options];
                                newOptions.pop();
                                setTest({
                                  ...test,
                                  questions: test.questions.map((q: any) => 
                                    q.id === question.id ? { ...q, options: newOptions } : q
                                  )
                                });
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
                                const newOptions = [...question.options, ``];
                                setTest({
                                  ...test,
                                  questions: test.questions.map((q: any) => 
                                    q.id === question.id ? { ...q, options: newOptions } : q
                                  )
                                });
                              }
                            }}
                            className="p-1 text-gray-400 hover:text-[#00D084] transition-colors"
                          >
                            <PlusCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {question.options.map((option: string, optIndex: number) => {
                          const isCorrect = question.correctAnswer === option;
                          return (
                            <div key={optIndex} className={`relative flex items-center p-3 rounded-2xl border-2 transition-all ${
                                isCorrect 
                                ? 'border-[#00D084] bg-[#00D084]/5 shadow-sm' 
                                : 'border-gray-50 hover:border-gray-100'
                            }`}>
                                <button
                                    onClick={() => updateQuestionField(question.id, 'correctAnswer', option)}
                                    className={`mr-3 transition-colors ${
                                        isCorrect ? 'text-[#00D084]' : 'text-gray-300'
                                    }`}
                                >
                                    {isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                                </button>
                                <Input 
                                    value={option}
                                    onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                                    placeholder={`Variant ${String.fromCharCode(65 + optIndex)}`}
                                    className="border-none bg-transparent focus-visible:ring-0 p-0 font-medium h-auto"
                                />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                ) : (
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-yellow-800 text-sm font-medium">
                        Bu açıq sualdır. Tələbələr bu sual üçün xüsusi cavab qutusu görəcəklər və siz tərəfindən ayrıca yoxlanılacaq.
                    </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Floating Actions */}
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
                disabled={isSaving}
                className="bg-[#00D084] hover:bg-[#00B873] text-white rounded-xl px-8 h-12 font-bold shadow-lg shadow-[#00D084]/20" 
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Yadda saxlanır...' : 'Yadda Saxla'}
            </Button>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
