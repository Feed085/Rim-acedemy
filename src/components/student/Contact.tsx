import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      });

      timeline.fromTo(
        titleRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
        }
      );

      timeline.fromTo(
        '.contact-reveal',
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.12,
        },
        '-=0.3'
      );

      timeline.fromTo(
        '.contact-info-card',
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.08,
        },
        '-=0.35'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    toast.success(t('contact.form.success'));
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: t('contact.info.address'),
      value: 'Bakı şəhəri, Nizami rayonu, Azərbaycan küçəsi 25',
    },
    {
      icon: Phone,
      label: t('contact.info.phone'),
      value: '+994 51 627 87 11',
    },
    {
      icon: Mail,
      label: t('contact.info.email'),
      value: 'info@rimacademy.az',
    },
    {
      icon: Clock,
      label: t('contact.info.working_hours'),
      value: '09:00 - 18:00',
    },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-20 lg:py-32 bg-[#0A0A0A] overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#00D084]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#0082F3]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full mb-6">
            <span className="w-2 h-2 bg-[#00D084] rounded-full" />
            <span className="text-sm font-medium text-gray-300">Əlaqə</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        {/* Content */}
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="contact-reveal bg-white/5 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6">
              Bizə yazın
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('contact.form.name')}
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Adınızı daxil edin"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#00D084] rounded-xl h-12"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('contact.form.email')}
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#00D084] rounded-xl h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('contact.form.phone')}
                  </label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+994 50 123 45 67"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#00D084] rounded-xl h-12"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('contact.form.message')}
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Mesajınızı yazın..."
                  required
                  rows={5}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#00D084] rounded-xl resize-none"
                />
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitted}
                className="w-full bg-[#00D084] hover:bg-[#00B873] text-white font-semibold rounded-xl h-12 transition-all"
              >
                {isSubmitted ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Göndərildi
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    {t('contact.form.submit')}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Map & Info */}
          <div className="space-y-6">
            {/* Map */}
            <div className="contact-reveal relative h-64 lg:h-80 rounded-3xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3039.428490145627!2d49.867092!3d40.409264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDI0JzMzLjQiTiA0OcKwNTInMDEuNSJF!5e0!3m2!1sen!2s!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((item) => (
                <div
                  key={item.label}
                  className="contact-info-card flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/10"
                >
                  <div className="w-10 h-10 bg-[#00D084]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-[#00D084]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                    <p className="text-sm text-white font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
