import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { testResults } from '@/data/mockData';
import { mockDb } from '@/services/mockDb';
import { 
  ArrowLeft, 
  User, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  FileText
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function TeacherTestResults() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const test = mockDb.getTestById(id || '');
  const results = testResults.filter(r => r.testId === id);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredResults = results.filter(r => 
    r.studentName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShowDetail = (result: any) => {
    setSelectedResult(result);
    setIsDetailOpen(true);
  };

  if (!test) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p>Test tapılmadı</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F3F3] pt-20 lg:pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-2 p-0 h-auto hover:bg-transparent text-gray-500 hover:text-gray-900 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Geri qayıt
          </Button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-gray-900">
                Test Nəticələri
              </h1>
              <p className="text-gray-500 mt-1">
                {test.title} - {results.length} nəticə
              </p>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tələbə axtar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-gray-200 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResults.map((result) => (
            <div 
              key={result.id}
              onClick={() => handleShowDetail(result)}
              className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={result.studentAvatar} 
                      alt={result.studentName}
                      className="w-12 h-12 rounded-2xl object-cover"
                    />
                    <div className={cn(
                      "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center",
                      result.score >= 60 ? "bg-[#00D084]" : "bg-red-500"
                    )}>
                      {result.score >= 60 ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : (
                        <XCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{result.studentName}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(result.completedAt).toLocaleDateString('az-AZ')}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn(
                    "text-xl font-black",
                    result.score >= 60 ? "text-[#00D084]" : "text-red-500"
                  )}>
                    {result.score}%
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    Nəticə
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResults.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Bu test üzrə nəticə tapılmadı</p>
            <p className="text-[10px] text-gray-400 mt-2 italic">Test ID: {id}</p>
          </div>
        )}
      </div>

      {/* Result Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#00D084]" />
              Test Detalları: {selectedResult?.studentName}
            </DialogTitle>
          </DialogHeader>
          
          {selectedResult && (
            <div className="py-4 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black text-[#00D084]">{selectedResult.correctAnswers}</div>
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Doğru</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black text-red-500">{selectedResult.wrongAnswers}</div>
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Yanlış</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black text-blue-500">{selectedResult.totalQuestions}</div>
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Sual</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 px-1">
                  Sual və Cavablar
                </h3>
                <div className="space-y-3">
                  {test.questions.map((q: any, idx: number) => {
                    const studentAnswerIndex = selectedResult.answers[q.id];
                    const correctAnswerIndex = typeof q.correctAnswer === 'string' 
                      ? q.options.indexOf(q.correctAnswer) 
                      : q.correctAnswer;
                    
                    const isCorrect = Number(studentAnswerIndex) === Number(correctAnswerIndex);
                    
                    return (
                      <div key={q.id} className={cn(
                        "p-4 rounded-2xl border transition-all",
                        isCorrect ? "bg-green-50/50 border-green-100" : "bg-red-50/50 border-red-100"
                      )}>
                        <div className="flex gap-3 mb-3">
                          <span className="font-bold text-gray-400">{idx + 1}.</span>
                          <p className="font-medium text-gray-900 text-sm leading-relaxed">{q.question || q.text}</p>
                        </div>
                        <div className="grid gap-2 ml-7">
                          {q.options.map((option: string, optIdx: number) => (
                            <div 
                              key={optIdx}
                              className={cn(
                                "flex items-center gap-2 p-2 rounded-lg text-xs font-medium",
                                optIdx === correctAnswerIndex 
                                  ? "bg-[#00D084]/10 text-[#00D084] border border-[#00D084]/20" 
                                  : optIdx === Number(studentAnswerIndex) && !isCorrect
                                  ? "bg-red-100 text-red-600 border border-red-200"
                                  : "bg-white text-gray-500 border border-gray-100"
                              )}
                            >
                              <div className={cn(
                                "w-5 h-5 rounded flex items-center justify-center shrink-0",
                                optIdx === correctAnswerIndex 
                                  ? "bg-[#00D084] text-white" 
                                  : optIdx === Number(studentAnswerIndex) && !isCorrect
                                  ? "bg-red-500 text-white"
                                  : "bg-gray-100 text-gray-400"
                              )}>
                                {String.fromCharCode(65 + optIdx)}
                              </div>
                              {option}
                              {optIdx === Number(studentAnswerIndex) && (
                                <span className="ml-auto text-[10px] font-black uppercase opacity-60">Cavab</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Utility function for conditional classes
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
