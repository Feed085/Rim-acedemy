import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { tests } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  FileText, 
  HelpCircle, 
  ArrowRight,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Tests() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.courseName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || test.courseId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { key: 'all', label: 'Hamısı' },
    { key: '1', label: 'SAT' },
    { key: '2', label: 'IELTS' },
    { key: '3', label: 'İngilis Dili' },
    { key: '4', label: 'Rus Dili' },
  ];

  return (
    <div className="min-h-screen bg-[#F3F3F3] pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00D084]/10 rounded-full mb-6">
            <span className="w-2 h-2 bg-[#00D084] rounded-full" />
            <span className="text-sm font-medium text-[#00D084]">Online Testlər</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
            {t('test.title')}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Biliklərini yoxla və irəliləyişini izlə. Müxtəlif fənlərdə testlər həll et.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Test axtar..."
              className="pl-12 h-12 rounded-xl bg-white border-0 shadow-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.key
                    ? 'bg-[#00D084] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="w-14 h-14 bg-gradient-to-br from-[#00D084] to-[#0082F3] rounded-2xl flex items-center justify-center mb-5">
                <FileText className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {test.title}
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                {test.courseName}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-4 mb-5">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <HelpCircle className="w-4 h-4" />
                  <span>{test.questionCount} sual</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{test.duration} dəq</span>
                </div>
              </div>

              {/* Button */}
              <Button
                onClick={() => navigate(`/tests/${test.id}`)}
                className="w-full bg-[#00D084] hover:bg-[#00B873] text-white font-semibold rounded-xl h-12 group"
              >
                {t('test.start')}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTests.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Test tapılmadı
            </h3>
            <p className="text-gray-500">
              Axtarış kriteriyalarını dəyişib yenidən cəhd edin
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
