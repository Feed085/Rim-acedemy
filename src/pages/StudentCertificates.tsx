import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  ChevronLeft, 
  Download,
  CalendarCheck
} from 'lucide-react';

export default function StudentCertificates() {
  const navigate = useNavigate();

  // Mocking certificates data
  const certificates = [
    {
      id: 'cert-1',
      title: 'IELTS Intensive',
      category: 'İmtahan Hazırlığı',
      issueDate: '15 Mart 2024',
      grade: '8.0',
      instructor: 'Leyla Əhmədova',
      image: 'https://images.unsplash.com/photo-15dfbbcc38ff6-304b77d6928e?q=80&w=600&h=400&fit=crop'
    },
    {
      id: 'cert-2',
      title: 'İngilis Dili - Başlanğıc',
      category: 'Dil Kursları',
      issueDate: '10 Fevral 2024',
      grade: 'Əla',
      instructor: 'Leyla Əhmədova',
      image: 'https://images.unsplash.com/photo-15dfbbcc38ff6-304b77d6928e?q=80&w=600&h=400&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F3F3F3] pt-20 lg:pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Geri qayıt
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-gray-900">
                Sertifikatlarım
              </h1>
              <p className="text-gray-500 mt-1">
                Uğurla tamamladığınız kursların sertifikatları
              </p>
            </div>
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col transition-all hover:shadow-md group"
            >
              {/* Certificate Ribbon */}
              <div className="relative h-48 rounded-2xl bg-gray-50 overflow-hidden mb-6 border border-gray-100 flex items-center justify-center group-hover:bg-[#F59E0B]/5 transition-colors">
                <Award className="w-16 h-16 text-[#F59E0B] opacity-50 absolute right-6 top-6" />
                <div className="text-center relative z-10 px-4">
                  <h3 className="text-2xl font-black text-gray-900 serif-font tracking-tight mb-2">
                    {cert.title}
                  </h3>
                  <div className="text-sm font-semibold text-[#F59E0B]">
                    {cert.category}
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Tarix:</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{cert.issueDate}</span>
                </div>
                
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Nəticə (Dərəcə):</span>
                  </div>
                  <span className="text-sm font-bold text-[#00D084]">{cert.grade}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-500">
                    Təlimçi:
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{cert.instructor}</span>
                </div>
              </div>

              <div className="flex items-center mt-8">
                <Button
                  className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl h-12 text-md"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Yüklə
                </Button>
              </div>
            </div>
          ))}

          {certificates.length === 0 && (
             <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100 md:col-span-2">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Award className="w-10 h-10 text-gray-400" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">
               Sertifikatınız mövcud deyil
             </h3>
             <p className="text-gray-500">
               Kursları uğurla tamamlayaraq sertifikatlarınızı əldə edə bilərsiniz.
             </p>
           </div>
          )}
        </div>
      </div>
    </div>
  );
}
