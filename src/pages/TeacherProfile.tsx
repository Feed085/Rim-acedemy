import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Camera, 
  MapPin, 
  Mail, 
  Phone, 
  Award, 
  BookOpen, 
  Users,
  Star,
  Edit2,
  Save,
  Facebook,
  Instagram,
  Linkedin,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { mockDb } from '@/services/mockDb';

export default function TeacherProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<any>(mockDb.getProfile());
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: teacher.name,
    surname: teacher.surname,
    email: teacher.email,
    phone: teacher.phone,
    education: teacher.education,
    experience: teacher.experience,
    specialties: teacher.specialties.join(', '),
    facebook: teacher.socialLinks.facebook,
    instagram: teacher.socialLinks.instagram,
    linkedin: teacher.socialLinks.linkedin,
    avatar: teacher.avatar
  });



  const handleSave = () => {
    const updatedProfile = {
      ...formData,
      specialties: formData.specialties.split(',').map((s: string) => s.trim()).filter(Boolean),
      socialLinks: {
        facebook: formData.facebook,
        instagram: formData.instagram,
        linkedin: formData.linkedin
      }
    };
    mockDb.updateProfile(updatedProfile);
    setTeacher(mockDb.getProfile());
    setIsEditing(false);
    toast.success('Profil yeniləndi!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-[#F3F3F3] pt-20 lg:pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-900 transition-colors mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Geri qayıt
        </Button>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Cover Image */}
        <div className="relative h-48 lg:h-64 bg-gradient-to-r from-[#00D084] to-[#0082F3] rounded-3xl mb-20">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <img
                src={formData.avatar}
                alt={`${formData.name} ${formData.surname}`}
                className="w-32 h-32 lg:w-40 lg:h-40 rounded-3xl object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute bottom-2 right-2">
                <label className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center hover:bg-gray-50 cursor-pointer">
                  <Camera className="w-5 h-5 text-gray-600" />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setFormData(prev => ({ ...prev, avatar: url }));
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <Button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`${isEditing 
                ? 'bg-[#00D084] hover:bg-[#00B873] shadow-lg shadow-[#00D084]/20' 
                : 'bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900'} rounded-xl font-bold transition-all px-6`}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Yadda saxla
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Redaktə et
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
                      <Input
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">E-poçt</label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl lg:text-3xl font-black text-gray-900">
                    {formData.name} {formData.surname}
                  </h1>
                  <p className="text-gray-500 mt-1">{formData.specialties}</p>
                  
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      Bakı, Azərbaycan
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      {formData.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      {formData.phone}
                    </div>
                  </div>
                </>
              )}
            </div>


            {/* Education & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {t('teacher.profile.education')}
                </h2>
                {isEditing ? (
                  <Textarea
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="Məs: Bakı Dövlət Universiteti, Filologiya fakültəsi, Ali təhsil"
                    className="rounded-xl min-h-[80px]"
                  />
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#00D084]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-[#00D084]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 leading-relaxed italic">{formData.education}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {t('teacher.profile.experience')}
                </h2>
                {isEditing ? (
                  <Input
                    name="experience"
                    type="number"
                    value={formData.experience}
                    onChange={handleChange}
                    className="rounded-xl"
                  />
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#0082F3]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-[#0082F3]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{formData.experience} il</p>
                      <p className="text-sm text-gray-500">Tədris təcrübəsi</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Specialties */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                İxtisaslaşdığı Sahələr
              </h2>
              {isEditing ? (
                <div className="space-y-4">
                   <Input
                    name="specialties"
                    value={formData.specialties}
                    onChange={handleChange}
                    placeholder="Məs: İngilis dili, IELTS, SAT"
                    className="rounded-xl"
                  />
                  <div className="flex flex-wrap gap-2">
                    {['İngilis dili', 'IELTS', 'SAT', 'TOEFL', 'Rus dili', 'Riyaziyyat'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          const currentSpecs = formData.specialties.split(',').map((s: string) => s.trim()).filter(Boolean);
                          if (!currentSpecs.includes(tag)) {
                            setFormData(prev => ({ ...prev, specialties: [...currentSpecs, tag].join(', ') }));
                          }
                        }}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-bold transition-colors"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {formData.specialties.split(',').map((specialty: string, index: number) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-[#00D084]/10 text-[#00D084] rounded-full text-sm font-medium"
                    >
                      {specialty.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Statistika</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-[#00D084]" />
                    <span className="text-gray-600">Tələbələr</span>
                  </div>
                  <span className="font-bold text-gray-900">{teacher?.studentCount}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-[#0082F3]" />
                    <span className="text-gray-600">Kurslar</span>
                  </div>
                  <span className="font-bold text-gray-900">{teacher?.courseCount}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-600">Reytinq</span>
                  </div>
                  <span className="font-bold text-gray-900">{teacher?.rating}/5</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sosial Şəbəkələr</h2>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                    <Input
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      placeholder="URL daxil edin"
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                    <Input
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      placeholder="URL daxil edin"
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                    <Input
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="URL daxil edin"
                      className="rounded-xl"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <a
                    href={formData.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-[#1877F2]/10 rounded-xl hover:bg-[#1877F2]/20 transition-colors"
                  >
                    <Facebook className="w-5 h-5 text-[#1877F2]" />
                    <span className="text-gray-700">Facebook</span>
                  </a>
                  <a
                    href={formData.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#833AB4]/10 via-[#E1306C]/10 to-[#F77737]/10 rounded-xl hover:from-[#833AB4]/20 hover:via-[#E1306C]/20 hover:to-[#F77737]/20 transition-colors"
                  >
                    <Instagram className="w-5 h-5 text-[#E1306C]" />
                    <span className="text-gray-700">Instagram</span>
                  </a>
                  <a
                    href={formData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-[#0A66C2]/10 rounded-xl hover:bg-[#0A66C2]/20 transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                    <span className="text-gray-700">LinkedIn</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
