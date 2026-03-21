import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { teachers } from '@/data/mockData';
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

export default function TeacherProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const teacher = teachers[0];
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: teacher?.name || '',
    surname: teacher?.surname || '',
    email: teacher?.email || '',
    phone: teacher?.phone || '',
    bio: teacher?.bio || '',
    education: teacher?.education || '',
    experience: teacher?.experience || 0,
    specialties: teacher?.specialties?.join(', ') || '',
    facebook: teacher?.socialLinks?.facebook || '',
    instagram: teacher?.socialLinks?.instagram || '',
    linkedin: teacher?.socialLinks?.linkedin || '',
  });

  const allSpecialties = Array.from(new Set(teachers.flatMap(t => t.specialties)));

  const handleSave = () => {
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
                src={teacher?.avatar}
                alt={`${teacher?.name} ${teacher?.surname}`}
                className="w-32 h-32 lg:w-40 lg:h-40 rounded-3xl object-cover border-4 border-white shadow-lg"
              />
              <button className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center hover:bg-gray-50">
                <Camera className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <Button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              variant="secondary"
              className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-xl"
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

            {/* About */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {t('teacher.profile.bio')}
              </h2>
              {isEditing ? (
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={5}
                  className="rounded-xl resize-none"
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">{formData.bio}</p>
              )}
            </div>

            {/* Education & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {t('teacher.profile.education')}
                </h2>
                {isEditing ? (
                  <Input
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="rounded-xl"
                  />
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#00D084]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-[#00D084]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{formData.education}</p>
                      <p className="text-sm text-gray-500">Ali təhsil</p>
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
                {t('teacher.profile.specialties')}
              </h2>
              {isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {allSpecialties.map((specialty) => {
                    const isSelected = formData.specialties.split(',').map(s => s.trim()).includes(specialty);
                    return (
                      <button
                        key={specialty}
                        type="button"
                        onClick={() => {
                          const currentSpecs = formData.specialties.split(',').map(s => s.trim()).filter(Boolean);
                          const newSpecs = isSelected
                            ? currentSpecs.filter(s => s !== specialty)
                            : [...currentSpecs, specialty];
                          setFormData(prev => ({ ...prev, specialties: newSpecs.join(', ') }));
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          isSelected
                            ? 'bg-[#00D084] text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {specialty}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {formData.specialties.split(',').map((specialty, index) => (
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
