import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getPublicContactCourseOptions } from '@/services/publicApi';

const WHATSAPP_PHONE = import.meta.env.VITE_WHATSAPP_PHONE || '994516278711';

type CourseOption = {
  id: string;
  title: string;
};

const DEMO_COURSE_OPTIONS: CourseOption[] = [
  { id: 'demo-1', title: 'Riyaziyyat' },
  { id: 'demo-2', title: 'İngilis dili' },
  { id: 'demo-3', title: 'Fizika' },
  { id: 'demo-4', title: 'Kimya' },
];

export default function Contact() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [courseOptions, setCourseOptions] = useState<CourseOption[]>(DEMO_COURSE_OPTIONS);
  const [formData, setFormData] = useState({
    name: '',
    courseId: '',
    message: '',
  });

  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      try {
        const courses = await getPublicContactCourseOptions();

        if (!isMounted) {
          return;
        }

        const mappedCourses = courses
          .map((course) => ({
            id: course.id,
            title: course.title,
          }))
          .filter((course) => course.id && course.title);

        if (mappedCourses.length > 0) {
          setCourseOptions(mappedCourses);
        }
      } catch (error) {
        console.error('Public kurslar yüklənə bilmədi', error);
      }
    };

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.courseId) {
      toast.error('Zəhmət olmasa kurs seçin');
      return;
    }

    const selectedCourse = courseOptions.find((course) => course.id === formData.courseId);

    const message = [
      'Salam, RIM Academy ilə əlaqə saxlamaq istəyirəm.',
      '',
      `Ad: ${formData.name || '-'}`,
      `Seçilən kurs: ${selectedCourse?.title || '-'}`,
      `Mesaj: ${formData.message || '-'}`,
    ].join('\n');

    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

    setIsSubmitted(true);
    toast.success('WhatsApp-a yönləndirilirsiniz');
    setFormData({ name: '', courseId: '', message: '' });
    window.location.href = whatsappUrl;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (field: 'courseId', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: t('contact.info.address'),
      value: 'Naxçıvan Dövlət Universiteti',
    },
    {
      icon: Phone,
      label: t('contact.info.phone'),
      value: '+994 51 627 87 11',
    },
    {
      icon: Mail,
      label: t('contact.info.email'),
      value: 'asiman.ismayilov0099@gmail.com',
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
      className="relative py-16 lg:py-32 bg-[#0A0A0A] overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#00D084]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#0082F3]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-8 lg:mb-12">
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
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Contact Form */}
          <div className="contact-reveal bg-white/5 backdrop-blur-sm rounded-3xl p-5 sm:p-8 lg:p-10 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6">
              Bizə yazın
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Kurs seçimi
                  </label>
                  <Select
                    value={formData.courseId}
                    onValueChange={(value) => handleSelectChange('courseId', value)}
                  >
                    <SelectTrigger className="h-12 w-full rounded-xl border-white/20 bg-white/10 text-white shadow-none focus:ring-[#00D084]/40">
                      <SelectValue placeholder="Kurs seçin" />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-[#111111] text-white">
                      {courseOptions.map((course) => (
                        <SelectItem
                          key={course.id}
                          value={course.id}
                          className="text-white focus:bg-white/10 focus:text-white"
                        >
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
            <div className="contact-reveal relative h-56 lg:h-80 rounded-3xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps?q=39.225123,45.403541&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="lg:grayscale lg:hover:grayscale-0 transition-all duration-500"
              />
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {contactInfo.map((item) => (
                <div
                  key={item.label}
                  className="contact-info-card flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/10"
                >
                  <div className="w-10 h-10 bg-[#00D084]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-[#00D084]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                    <p className="text-sm text-white font-medium break-words leading-6">{item.value}</p>
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
