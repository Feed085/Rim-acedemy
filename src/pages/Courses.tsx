import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { mockDb } from '@/services/mockDb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Clock, 
  Users, 
  Star, 
  ArrowRight,
  Filter
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CoursesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dbCourses, setDbCourses] = useState<any[]>(mockDb.getCourses());
  
  useEffect(() => {
    setDbCourses(mockDb.getCourses());
    const interval = setInterval(() => {
      setDbCourses(mockDb.getCourses());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    { id: 'all', name: 'Hamısı' },
    ...mockDb.getCategories(),
  ];

  const filteredCourses = dbCourses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teacherName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      course.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F3F3F3] pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00D084]/10 rounded-full mb-6">
            <span className="w-2 h-2 bg-[#00D084] rounded-full" />
            <span className="text-sm font-medium text-[#00D084]">Kurslarımız</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
            {t('courses.title')}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('courses.subtitle')}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#00D084] transition-colors" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kurs axtar..."
              className="pl-12 h-14 rounded-2xl bg-white border-2 border-gray-100 shadow-lg shadow-gray-200/50 focus:border-[#00D084] focus:ring-0 transition-all text-base placeholder:text-gray-400"
            />
          </div>
          <div className="w-full sm:w-[220px] shrink-0">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full !h-14 bg-white border-2 border-gray-100 rounded-2xl shadow-lg shadow-gray-200/50 focus:ring-0 focus:ring-offset-0 outline-none focus:border-[#00D084] text-gray-700 font-medium px-5">
                <div className="flex items-center gap-2.5">
                  <Filter className="w-4 h-4 text-[#00D084]" />
                  <SelectValue placeholder="Kateqoriya" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border-none shadow-2xl rounded-2xl p-2 min-w-[220px]">
                {categories.map((cat: any) => (
                  <SelectItem
                    key={cat.id}
                    value={cat.id}
                    className="py-3 px-4 rounded-xl text-sm font-medium text-gray-600 cursor-pointer focus:bg-[#00D084]/10 focus:text-[#00D084] data-[state=checked]:text-[#00D084] data-[state=checked]:bg-[#00D084]/5 transition-colors mb-1 last:mb-0"
                  >
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Rating badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-semibold">{course.rating}</span>
                </div>

              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{course.studentCount}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <img
                      src={course.teacherAvatar}
                      alt={course.teacherName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-xs font-medium text-gray-600 truncate max-w-[80px]">
                      {course.teacherName}
                    </span>
                  </div>
                </div>

                {/* Button */}
                <Button
                  onClick={() => navigate(`/courses/${course.id}`)}
                  className="w-full mt-4 bg-[#00D084] hover:bg-[#00B873] text-white rounded-xl group/btn"
                >
                  Dərslərə bax
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Kurs tapılmadı
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
