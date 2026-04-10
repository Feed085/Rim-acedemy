import { useState } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  Star, 
  Users, 
  BookOpen, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { getPublicCategories, getPublicTeachers, normalizeCategoryKey } from '@/services/publicApi';
import type { PublicCategory, PublicTeacher } from '@/services/publicApi';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Teachers() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [teachers, setTeachers] = useState<PublicTeacher[]>([]);
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadTeachers = async () => {
      try {
        const [teacherList, categoryList] = await Promise.all([
          getPublicTeachers(),
          getPublicCategories()
        ]);

        if (isMounted) {
          setTeachers(teacherList);
          setCategories(categoryList);
        }
      } catch (error) {
        console.error('Müəllimlər yüklənə bilmədi', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTeachers();

    return () => {
      isMounted = false;
    };
  }, []);

  const backendCategories = categories.length > 0
    ? categories
    : Array.from(new Set(teachers.flatMap((teacher) => teacher.categories || [])))
        .filter(Boolean)
        .map((value, index) => ({
          id: value,
          slug: value,
          name: value,
          description: '',
          color: '#00D084',
          icon: 'Tag',
          order: index + 1,
          isActive: true
        }));

  const availableCategories = [
    { id: 'all', slug: 'all', name: 'Hamısı', description: '', color: '#00D084', icon: 'Tag', order: 0, isActive: true },
    ...backendCategories
  ];

  const categoryMatches = (teacher: PublicTeacher, categoryValue: string) => {
    const teacherCategories = teacher.categories || [];
    const teacherSpecialties = teacher.specialties || [];

    return [...teacherCategories, ...teacherSpecialties].some((value) => {
      const normalizedValue = normalizeCategoryKey(value);
      return normalizedValue === normalizeCategoryKey(categoryValue);
    });
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = 
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.education?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (teacher.bio || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (teacher.specialties || []).some((specialty) => specialty.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSpecialty = 
      selectedCategory === 'all' || 
      categoryMatches(teacher, selectedCategory);
    
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-[#F3F3F3] pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00D084]/10 rounded-full mb-6">
            <span className="w-2 h-2 bg-[#00D084] rounded-full" />
            <span className="text-sm font-medium text-[#00D084]">Komandamız</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
            {t('teachers.title')}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('teachers.subtitle')}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Müəllim axtar..."
              className="pl-12 h-12 rounded-xl bg-white border-0 shadow-sm"
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
                {isLoading && categories.length === 0 ? (
                  <SelectItem value="loading" disabled className="py-3 px-4 rounded-xl text-sm font-medium text-gray-400">
                    Kateqoriyalar yüklənir...
                  </SelectItem>
                ) : (
                  availableCategories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id}
                      className="py-3 px-4 rounded-xl text-sm font-medium text-gray-600 cursor-pointer focus:bg-[#00D084]/10 focus:text-[#00D084] data-[state=checked]:text-[#00D084] data-[state=checked]:bg-[#00D084]/5 transition-colors mb-1 last:mb-0"
                    >
                      {category.id === 'all' ? 'Hamısı' : category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm"
              >
                <Skeleton className="h-64 w-full rounded-none" />
                <div className="p-5 space-y-4">
                  <Skeleton className="h-6 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              </div>
            ))
          ) : (
            filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={teacher.avatar}
                    alt={`${teacher.name} ${teacher.surname}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Rating */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-gray-900">{teacher.rating}</span>
                  </div>

                  {/* Name overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {teacher.name} {teacher.surname}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {(teacher.specialties || []).slice(0, 2).map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Users className="w-4 h-4 text-[#00D084]" />
                      <span>{teacher.studentCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <BookOpen className="w-4 h-4 text-[#0082F3]" />
                      <span>{teacher.courseCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <span className="text-[#F59E0B]">{teacher.experience} il</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                    {teacher.bio}
                  </p>

                  {/* Button */}
                  <Button
                    onClick={() => navigate(`/teachers/${teacher.id}`)}
                    className="w-full bg-[#00D084] hover:bg-[#00B873] text-white rounded-xl group/btn"
                  >
                    {t('teachers.view_profile')}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty State */}
        {!isLoading && filteredTeachers.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Müəllim tapılmadı
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
