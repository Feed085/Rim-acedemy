import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare } from 'lucide-react';
import gsap from 'gsap';

export default function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set([titleRef.current, subtitleRef.current, descRef.current, buttonsRef.current], {
        opacity: 0,
        y: 50,
      });

      // Animation timeline
      const tl = gsap.timeline({ delay: 0.3 });

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
      })
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.6'
        )
        .to(
          descRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.5'
        )
        .to(
          buttonsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.5'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#F3F3F3]"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient circles */}
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#00D084]/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#0082F3]/10 to-transparent blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Floating shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[#00D084]/20 rounded-2xl rotate-12 animate-pulse" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-[#0082F3]/20 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-[#00D084]/30 rounded-lg -rotate-12 animate-pulse" style={{ animationDuration: '2s' }} />
      <div className="absolute bottom-20 right-40 w-24 h-24 bg-[#0082F3]/10 rounded-xl rotate-45" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg mb-8">
          <span className="w-2 h-2 bg-[#00D084] rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gray-700">Gələcəyinizi bizimlə qurun</span>
        </div>

        {/* Main Title */}
        <h1
          ref={titleRef}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-gray-900 tracking-tight mb-4"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {t('hero.title')}
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-xl sm:text-2xl md:text-3xl font-bold text-[#00D084] mb-6"
        >
          {t('hero.subtitle')}
        </p>

        {/* Description */}
        <p
          ref={descRef}
          className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t('hero.description')}
        </p>

        {/* CTA Buttons */}
        <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => navigate('/courses')}
            className="bg-[#00D084] hover:bg-[#00B873] text-white font-semibold rounded-full px-8 py-6 text-base group transition-all hover:shadow-lg hover:shadow-[#00D084]/30"
          >
            {t('hero.cta')}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const contactSection = document.getElementById('contact');
              contactSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="border-2 border-gray-900/10 hover:border-[#00D084] hover:bg-[#00D084]/10 hover:text-[#00D084] text-gray-700 font-semibold rounded-full px-8 py-6 text-base group transition-all active:scale-95 shadow-sm hover:shadow-md bg-white/50 backdrop-blur-sm"
          >
            <MessageSquare className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            {t('hero.cta_secondary')}
          </Button>
        </div>

        {/* Stats Preview */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { value: '15+', label: 'İllik Təcrübə' },
            { value: '5000+', label: 'Tələbə' },
            { value: '50+', label: 'Müəllim' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-gray-900">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-gray-400">Aşağı sürüşdürün</span>
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-[#00D084] rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
