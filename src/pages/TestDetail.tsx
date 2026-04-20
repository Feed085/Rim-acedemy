import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Flag,
  CheckCircle,
  XCircle,
  Trophy
} from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/services/publicApi';

export default function TestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [test, setTest] = useState<any>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  // selectedAnswers => { "questionId": "verilen cavab (string)" }
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  
  const [resultData, setResultData] = useState<any>(null);

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
          setTest(data.data);
          setTimeLeft(data.data.duration * 60);
        } else {
          toast.error('Test yüklənərkən xəta: ' + data.message);
        }
      } catch (err) {
        toast.error('Test yüklənmədi');
      }
    };
    fetchTest();
  }, [id]);

  useEffect(() => {
    if (test && isStarted && timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isStarted, timeLeft, isFinished, test]);

  if (!test) {
    return (
      <div className="min-h-screen bg-[#F3F3F3] pt-20 lg:pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Məlumat yüklənir...</h1>
          <Button onClick={() => navigate(-1)}>
            Geri qayıt
          </Button>
        </div>
      </div>
    );
  }

  const startTest = () => {
    setIsStarted(true);
    toast.success('Test başladı! Uğurlar!');
  };

  const finishTest = async () => {
    setIsFinished(true); // freeze screen UI
    const token = localStorage.getItem('rim_auth_token');
    
    // format answers array
    const formattedAnswers = Object.keys(selectedAnswers).map(qId => ({
       questionId: qId,
       answer: selectedAnswers[qId]
    }));

    try {
      const res = await fetch(`${API_BASE_URL}/tests/${id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answers: formattedAnswers })
      });
      const data = await res.json();
      if (data.success) {
        setResultData(data.data);
        toast.success(data.data.hasPendingAnswers ? 'İmtahan bitdi! Bəzi açıq suallar sonradan yoxlanılacaq.' : 'Test tamamlandı!');
      } else {
        toast.error('Xəta baş verdi!');
      }
    } catch(err) {
      toast.error('Nəticə göndərilmədi!');
    }
  };

  // selectAnswer qapalı test və açıq test üçün eyni cür string alır, "Məsələn şıq, və ya açıq yazılan söz"
  const handleSelectAnswer = (qId: string, answerValue: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [qId]: answerValue
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start Screen
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-[#F3F3F3] pt-20 lg:pt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Geri qayıt
          </Button>

          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg">
            <div className="w-20 h-20 bg-gradient-to-br from-[#00D084] to-[#0082F3] rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Flag className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-2xl lg:text-3xl font-black text-gray-900 text-center mb-4">
              {test.title}
            </h1>
            <p className="text-gray-500 text-center mb-8">
              Özünü Sına
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-[#00D084]">{test.questions.length}</div>
                <div className="text-sm text-gray-500">Sual</div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-[#0082F3]">{test.duration}</div>
                <div className="text-sm text-gray-500">Dəqiqə</div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-[#F59E0B]">100</div>
                <div className="text-sm text-gray-500">Bal</div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-8">
              <h3 className="font-bold text-yellow-800 mb-2">Qaydalar:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Qapalı suallar üçün yalnız bir seçim edin</li>
                <li>• Açıq suallar (əgər varsa) müəllim tərəfindən sonra yoxlanacaq</li>
                <li>• Vaxt bitdikdə test avtomatik bağlanacaq</li>
              </ul>
            </div>

            <Button
              onClick={startTest}
              className="w-full bg-[#00D084] hover:bg-[#00B873] text-white font-semibold rounded-xl h-14 text-lg"
            >
              İmtahana Başla
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (isFinished) {
    if (!resultData) {
      return (
        <div className="min-h-screen bg-[#F3F3F3] pt-20 lg:pt-24 flex items-center justify-center">
          <div className="text-center">İstatistika hesablanır...</div>
        </div>
      )
    }

    const percentage = resultData.scorePercentage || 0;
    const isPassed = percentage >= 60;
    const hasPending = resultData.hasPendingAnswers;

    return (
      <div className="min-h-screen bg-[#F3F3F3] pt-20 lg:pt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg">
            <div className="text-center">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                hasPending ? 'bg-yellow-100' : isPassed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {hasPending ? (
                  <Clock className="w-12 h-12 text-yellow-600" />
                ) : isPassed ? (
                  <Trophy className="w-12 h-12 text-green-600" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-600" />
                )}
              </div>

              <h1 className="text-2xl lg:text-3xl font-black text-gray-900 mb-2">
                {hasPending ? 'Nəticə Gözlənilir' : isPassed ? 'Təbriklər!' : 'Uğursuz oldu'}
              </h1>
              <p className="text-gray-500 mb-8">
                {hasPending 
                  ? 'Bəzi suallar açıq tiplidir. Müəllim yoxladıqdan sonra yekun nəticəni görə bilərsiniz!' 
                  : isPassed 
                    ? 'Test uğurla tamamladınız!' 
                    : 'Növbəti dəfə daha yaxşı nəticə göstərəcəyinizə əminik!'}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="text-2xl font-black text-[#0082F3]">{percentage.toFixed(0)}%</div>
                  <div className="text-sm text-gray-500">Mövcud Nəticə</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="text-2xl font-black text-yellow-500">
                    {resultData.answers.filter((a:any) => a.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-500">Gözləyən Suallar</div>
                </div>
              </div>

              {resultData.answers.filter((a:any) => !a.isCorrect && a.status === 'graded').length > 0 && (
                <div className="mb-8 text-left">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    Səhv Cavablarınız (Yoxlanmış)
                  </h3>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {resultData.answers.filter((a:any) => !a.isCorrect && a.status === 'graded').map((a: any, idx: number) => {
                      const q = test.questions.find((x:any) => x._id === a.questionId);
                      if (!q) return null;
                      
                      return (
                        <div key={q._id} className="bg-red-50/50 border border-red-100 rounded-xl p-4">
                          <p className="font-medium text-gray-900 mb-2">
                            {idx + 1}. {q.questionType === 'image' ? (
                              <div className="mt-2 rounded-lg overflow-hidden border border-gray-100 max-w-xs">
                                <img src={q.content} alt="Sual" className="w-full h-auto" />
                              </div>
                            ) : q.content}
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2 mt-3 text-sm">
                            <div className="flex-1 flex items-start gap-2 text-red-600 bg-red-100/50 px-3 py-2 rounded-lg">
                              <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-medium block text-xs uppercase tracking-wider mb-0.5">Sizin cavabınız</span>
                                <span>{a.answer || 'Cavab verilməyib'}</span>
                              </div>
                            </div>
                            <div className="flex-1 flex items-start gap-2 text-[#00D084] bg-[#00D084]/10 px-3 py-2 rounded-lg">
                              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-medium block text-xs uppercase tracking-wider mb-0.5">Düzgün cavab</span>
                                <span>{q.correctAnswer || 'Ekspertiza tələb olunur'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="w-full h-12 rounded-xl"
                >
                  Paneline Qayıt
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Test Screen
  const question = test.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / test.questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#F3F3F3] pt-20 lg:pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-bold text-gray-900">{test.title}</h1>
              <p className="text-sm text-gray-500">Sual {currentQuestion + 1} / {test.questions.length}</p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
              timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'
            }`}>
              <Clock className="w-5 h-5" />
              <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-lg mb-6">
          <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-6">
             {currentQuestion + 1}. 
             {question.questionType === 'image' ? (
                <div className="mt-4 rounded-2xl overflow-hidden border-2 border-gray-50 shadow-sm max-w-lg">
                   <img src={question.content} alt="Sual" className="w-full h-auto" />
                </div>
             ) : (
                <span className="ml-2 block mt-2 text-xl font-medium">{question.content}</span>
             )}
          </h2>

          <div className="space-y-3">
             {question.answerType === 'multiple_choice' ? (
                question.options.map((option: string, index: number) => {
                   // Əgər option mətni varsa onu, yoxsa "A" kimi hərf stringini yoxlayaq
                   const answerVal = option; 
                   return (
                     <button
                       key={index}
                       onClick={() => handleSelectAnswer(question._id, answerVal)}
                       className={`w-full p-4 rounded-xl text-left transition-all ${
                         selectedAnswers[question._id] === answerVal
                           ? 'bg-[#00D084] text-white'
                           : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                       }`}
                     >
                       <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                           selectedAnswers[question._id] === answerVal
                             ? 'bg-white text-[#00D084]'
                             : 'bg-white text-gray-500'
                         }`}>
                           {String.fromCharCode(65 + index)}
                         </div>
                         <span>{option}</span>
                       </div>
                     </button>
                   );
                })
             ) : (
                <div className="pt-4">
                   <label className="text-sm font-bold text-gray-700 mb-2 block">Sizin Cavabınız (Açıq sual)</label>
                   <textarea
                      rows={5}
                      className="w-full rounded-2xl border-gray-200 p-4 focus:border-[#00D084] focus:ring-[#00D084]"
                      placeholder="Fikrinizi bura yazın..."
                      value={selectedAnswers[question._id] || ''}
                      onChange={(e) => handleSelectAnswer(question._id, e.target.value)}
                   ></textarea>
                </div>
             )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="rounded-xl"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Əvvəlki
          </Button>

          <div className="flex gap-2 flex-wrap max-w-[50%] justify-center overflow-x-auto">
            {test.questions.map((q: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-8 h-8 shrink-0 rounded-lg text-sm font-medium transition-all ${
                  idx === currentQuestion
                    ? 'bg-[#00D084] text-white'
                    : selectedAnswers[q._id] 
                    ? 'bg-[#00D084]/20 text-[#00D084]'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {currentQuestion < test.questions.length - 1 ? (
            <Button
              onClick={() => setCurrentQuestion(prev => Math.min(test.questions.length - 1, prev + 1))}
              className="bg-[#00D084] hover:bg-[#00B873] rounded-xl text-white"
            >
              Növbəti
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={finishTest}
              className="bg-[#00D084] hover:bg-[#00B873] rounded-xl text-white shadow-lg shadow-[#00D084]/30"
            >
              İmtahanı Bitir
              <CheckCircle className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
