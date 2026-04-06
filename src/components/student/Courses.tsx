import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Courses() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [dbCourses, setDbCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/courses');
        const data = await response.json();
        if (data.success) {
           setDbCourses(data.data || []);
        }
      } catch (err) {
        console.error('Kurslar yüklənə bilmədi', err);
      }
    };
    fetchCourses();
  }, []);

  // Düymələrdə göstərmək üçün unikal kateqoriyaları çıxarırıq (maks 4 dənə ana səhifə üçün)
  const uniqueCategoryNames = Array.from(new Set(dbCourses.map(c => c.category).filter(Boolean)));
  const dynamicCategories = [
    { key: 'all', label: 'Hamısı' },
    ...uniqueCategoryNames.slice(0, 4).map(name => ({ key: name as string, label: name as string }))
  ];

  const filteredCourses = activeCategory === 'all'
    ? dbCourses
    : dbCourses.filter(course => course.category === activeCategory);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards animation
      const cards = gridRef.current?.querySelectorAll('.course-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredCourses]);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-32 bg-[#F3F3F3] overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00D084]/10 rounded-full mb-6">
            <span className="w-2 h-2 bg-[#00D084] rounded-full" />
            <span className="text-sm font-medium text-[#00D084]">Kurslarımız</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            {t('courses.title')}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t('courses.subtitle')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {dynamicCategories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.key
                  ? 'bg-[#00D084] text-white shadow-lg shadow-[#00D084]/30'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredCourses.slice(0, 8).map((course) => (
            <div
              key={course._id || course.id}
              onClick={() => navigate(`/courses/${course._id || course.id}`)}
              className="course-card group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-300/50 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image || 'https://via.placeholder.com/600x400'}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Rating badge */}
                {/* 
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-semibold">{course.rating || '0.0'}</span>
                </div>
                */}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col justify-between h-[180px]">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {course.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={course.instructor?.avatar || 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirKVGVwei6Df8ct23tMACbeRpeM4981E21T/avatar/1149.jpg'}
                      alt={course.instructor?.name || 'Müəllim'}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-xs font-medium text-gray-600 truncate max-w-[120px]">
                      {course.instructor ? `${course.instructor.name} ${course.instructor.surname || ''}` : 'Rim Academy'}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-[#00D084]">
                    {course.price === 0 ? 'Ödənişsiz' : `${course.price} AZN`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            onClick={() => navigate('/courses')}
            variant="outline"
            className="border-2 border-gray-300 hover:border-[#00D084] hover:text-[#00D084] font-semibold rounded-full px-8 py-6 group"
          >
            {t('courses.view_all')}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}
