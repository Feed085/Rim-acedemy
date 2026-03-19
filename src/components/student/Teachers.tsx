import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { teachers } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Star, Users, BookOpen, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Teachers() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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
      const cards = gridRef.current?.querySelectorAll('.teacher-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
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
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-32 bg-[#0A0A0A] overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-[#00D084]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-[#0082F3]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div ref={titleRef} className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full mb-6">
              <span className="w-2 h-2 bg-[#00D084] rounded-full" />
              <span className="text-sm font-medium text-gray-300">Komandamız</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
              {t('teachers.title')}
            </h2>
            <p className="text-gray-400 text-lg max-w-xl">
              {t('teachers.subtitle')}
            </p>
          </div>
          <Button
            onClick={() => navigate('/teachers')}
            variant="outline"
            className="mt-6 lg:mt-0 border-white/20 text-white hover:bg-white/10 rounded-full px-6 group"
          >
            {t('teachers.button')}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Teachers Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {teachers.slice(0, 6).map((teacher) => (
            <div
              key={teacher.id}
              className="teacher-card group relative bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2"
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
                  <p className="text-gray-300 text-sm">
                    {teacher.specialties.slice(0, 2).join(', ')}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Stats */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-400">
                    <Users className="w-4 h-4 text-[#00D084]" />
                    <span>{teacher.studentCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-400">
                    <BookOpen className="w-4 h-4 text-[#0082F3]" />
                    <span>{teacher.courseCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-400">
                    <span className="text-[#F59E0B]">{teacher.experience} il</span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                  {teacher.bio}
                </p>

                {/* Button */}
                <Button
                  onClick={() => navigate(`/teachers/${teacher.id}`)}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white hover:text-black rounded-xl group/btn"
                >
                  {t('teachers.view_profile')}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
