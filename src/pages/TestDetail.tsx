import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { tests } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Flag,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

export default function TestDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const test = tests.find(t => t.id === id);

  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);

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
  }, [isStarted, timeLeft, isFinished]);

  if (!test) {
    return (
      <div className="min-h-screen bg-[#F3F3F3] pt-20 lg:pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Test tapılmadı</h1>
          <Button onClick={() => navigate(-1)}>
            Geri qayıt
          </Button>
        </div>
      </div>
    );
  }

  const startTest = () => {
    setIsStarted(true);
    setTimeLeft(test.duration * 60);
    toast.success('Test başladı! Uğurlar!');
  };

  const finishTest = () => {
    let correct = 0;
    test.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    setScore(correct);
    setIsFinished(true);
    toast.success('Test tamamlandı!');
  };

  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [test.questions[currentQuestion].id]: answerIndex
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
              {test.courseName}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-[#00D084]">{test.questionCount}</div>
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
                <li>• Hər sual üçün bir cavab seçin</li>
                <li>• Vaxt bitdikdə test avtomatik bağlanacaq</li>
                <li>• Testə yenidən başlaya bilərsiniz</li>
              </ul>
            </div>

            <Button
              onClick={startTest}
              className="w-full bg-[#00D084] hover:bg-[#00B873] text-white font-semibold rounded-xl h-14 text-lg"
            >
              {t('test.start')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (isFinished) {
    const percentage = Math.round((score / test.questions.length) * 100);
    const isPassed = percentage >= 60;

    return (
      <div className="min-h-screen bg-[#F3F3F3] pt-20 lg:pt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg">
            <div className="text-center">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                isPassed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {isPassed ? (
                  <Trophy className="w-12 h-12 text-green-600" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-600" />
                )}
              </div>

              <h1 className="text-2xl lg:text-3xl font-black text-gray-900 mb-2">
                {isPassed ? 'Təbriklər!' : 'Uğursuz oldu'}
              </h1>
              <p className="text-gray-500 mb-8">
                {isPassed 
                  ? 'Test uğurla tamamladınız!' 
                  : 'Növbəti dəfə daha yaxşı nəticə göstərəcəyinizə əminik!'}
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="text-2xl font-black text-[#00D084]">{score}</div>
                  <div className="text-sm text-gray-500">Düzgün</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="text-2xl font-black text-red-500">{test.questions.length - score}</div>
                  <div className="text-sm text-gray-500">Səhv</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="text-2xl font-black text-[#0082F3]">{percentage}%</div>
                  <div className="text-sm text-gray-500">Nəticə</div>
                </div>
              </div>

              {test.questions.length - score > 0 && (
                <div className="mb-8 text-left">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    Səhv Cavablarınız
                  </h3>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {test.questions.map((q, idx) => {
                      const selected = selectedAnswers[q.id];
                      const isCorrect = selected === q.correctAnswer;
                      if (isCorrect) return null;
                      
                      return (
                        <div key={q.id} className="bg-red-50/50 border border-red-100 rounded-xl p-4">
                          <p className="font-medium text-gray-900 mb-2">
                            {idx + 1}. {q.question}
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2 mt-3 text-sm">
                            <div className="flex-1 flex items-start gap-2 text-red-600 bg-red-100/50 px-3 py-2 rounded-lg">
                              <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-medium block text-xs uppercase tracking-wider mb-0.5">Sizin cavabınız</span>
                                <span>{selected !== undefined ? q.options[selected] : 'Cavab verilməyib'}</span>
                              </div>
                            </div>
                            <div className="flex-1 flex items-start gap-2 text-[#00D084] bg-[#00D084]/10 px-3 py-2 rounded-lg">
                              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-medium block text-xs uppercase tracking-wider mb-0.5">Düzgün cavab</span>
                                <span>{q.options[q.correctAnswer]}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex-1 h-12 rounded-xl"
                >
                  Geri qayıt
                </Button>
                <Button
                  onClick={() => {
                    setIsStarted(false);
                    setIsFinished(false);
                    setCurrentQuestion(0);
                    setSelectedAnswers({});
                    setScore(0);
                  }}
                  className="flex-1 bg-[#00D084] hover:bg-[#00B873] text-white h-12 rounded-xl"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Yenidən başla
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
            {currentQuestion + 1}. {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(index)}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  selectedAnswers[question.id] === index
                    ? 'bg-[#00D084] text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                    selectedAnswers[question.id] === index
                      ? 'bg-white text-[#00D084]'
                      : 'bg-white text-gray-500'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
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
            {t('test.prev')}
          </Button>

          <div className="flex gap-2">
            {test.questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                  idx === currentQuestion
                    ? 'bg-[#00D084] text-white'
                    : selectedAnswers[test.questions[idx].id] !== undefined
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
              className="bg-[#00D084] hover:bg-[#00B873] rounded-xl"
            >
              {t('test.next')}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={finishTest}
              className="bg-[#00D084] hover:bg-[#00B873] rounded-xl"
            >
              {t('test.finish')}
              <CheckCircle className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
