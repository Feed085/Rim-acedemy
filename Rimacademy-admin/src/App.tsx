import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  LogOut,
  Plus,
  Search,
  MoreVertical,
  ArrowUpRight,
  X,
  Copy,
  Check
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

// --- Components ---

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <h3 className="text-xl font-black text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { icon: LayoutDashboard, label: 'Panel', path: '/' },
    { icon: Users, label: 'Müəllimlər', path: '/teachers' },
    { icon: BookOpen, label: 'Tələbələr', path: '/students' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col fixed h-full z-50">
      <div className="h-24 flex items-center px-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00D084] rounded-xl flex items-center justify-center shadow-lg shadow-[#00D084]/20">
            <span className="text-white font-black text-xl italic">R</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-gray-900 tracking-tight uppercase italic">Rim</span>
            <span className="text-[10px] font-bold text-[#00D084] tracking-[0.2em] uppercase leading-none mt-1">Academy</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                isActive 
                  ? 'bg-[#00D084] text-white font-bold shadow-lg shadow-[#00D084]/20' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-50">
        <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold">
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Çıxış</span>
        </button>
      </div>
    </aside>
  );
};

// --- Pages ---

const Dashboard = () => {
  const stats = [
    { label: 'Ümumi Tələbə', value: '1,245', trend: '+12%', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Müəllimlər', value: '18', trend: '+2', color: 'text-[#00D084]', bg: 'bg-[#00D084]/10' },
    { label: 'Aktiv Kurslar', value: '42', trend: '+5', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Aylıq Gəlir', value: '12,500 ₼', trend: '+18%', color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const activeCourses = [
    { name: 'IELTS Intensive', students: 450, growth: '+25%', instructor: 'Leyla Ə.' },
    { name: 'SAT Mathematics', students: 320, growth: '+15%', instructor: 'Elçin Q.' },
    { name: 'General English', students: 280, growth: '+10%', instructor: 'Kamran H.' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Xoş gəlmisiniz, Müdir!</h1>
          <p className="text-gray-500 mt-1">Kursun bugünkü vəziyyəti və analizi.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black text-gray-900 leading-none">{stat.value}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.bg} ${stat.color}`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-gray-900">Ən Aktiv Kurslar</h3>
            <button className="text-sm font-bold text-[#00D084] hover:underline">Hamısına bax</button>
          </div>
          <div className="space-y-6">
            {activeCourses.map((course, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#00D084] font-black group-hover:bg-[#00D084] group-hover:text-white transition-all">
                    {course.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-[#00D084] transition-colors">{course.name}</h4>
                    <p className="text-xs text-gray-500">{course.instructor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{course.students} tələbə</div>
                  <div className="text-[10px] font-black text-[#00D084] uppercase">{course.growth} artım</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0A0A0A] p-8 rounded-[32px] text-white relative overflow-hidden group">
          <div className="relative z-10 flex flex-col h-full justify-between">
             <div>
               <h3 className="text-2xl font-black mb-2 opacity-90">Yeni Müəllim Hesabı</h3>
               <p className="text-gray-400 text-sm leading-relaxed max-w-[280px]">
                 Müəllimlər üçün yeni giriş məlumatları yaradın və onlara təqdim edin.
               </p>
             </div>
             <Link 
              to="/teachers" 
              className="mt-8 bg-[#00D084] hover:bg-[#00B873] text-white w-fit px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-[#00D084]/20"
             >
               Hesab Yarat
               <ArrowUpRight className="w-5 h-5" />
             </Link>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D084]/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-[#00D084]/20 transition-all duration-700" />
        </div>
      </div>
    </div>
  );
};

const Teachers = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ name: '', surname: '', email: '', password: '' });
  const [createdInfo, setCreatedInfo] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('rim_acedemy_allowed_teachers');
    if (saved) setTeachers(JSON.parse(saved));
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const teacherData = { ...newTeacher, id: Date.now(), status: 'Aktiv', courses: 0 };
    const updated = [teacherData, ...teachers];
    setTeachers(updated);
    localStorage.setItem('rim_acedemy_allowed_teachers', JSON.stringify(updated));
    setCreatedInfo(newTeacher);
    setNewTeacher({ name: '', surname: '', email: '', password: '' });
    toast.success('Müəllim hesabı yaradıldı!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-gray-900">Müəllimlər</h1>
          <button 
            onClick={() => { setIsModalOpen(true); setCreatedInfo(null); }}
            className="bg-[#00D084] hover:bg-[#00B873] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-[#00D084]/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Yeni Hesab Yarat
          </button>
       </div>

       {createdInfo && (
         <div className="bg-[#00D084] p-8 rounded-[32px] text-white shadow-xl shadow-[#00D084]/20 animate-in slide-in-from-top-4 duration-500">
            <h3 className="text-xl font-black mb-4 flex items-center gap-2">
              <Check className="w-6 h-6" />
              Hesab Yaradıldı!
            </h3>
            <p className="opacity-90 mb-6 text-sm">Aşağıdakı məlumatları müəllimə göndərin:</p>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 space-y-4 border border-white/10">
               <div className="flex justify-between items-center group">
                  <span className="text-xs font-black uppercase tracking-widest opacity-60">Email</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{createdInfo.email}</span>
                    <button className="p-2 hover:bg-white/10 rounded-lg"><Copy className="w-4 h-4" /></button>
                  </div>
               </div>
               <div className="flex justify-between items-center group">
                  <span className="text-xs font-black uppercase tracking-widest opacity-60">Şifrə</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold tracking-wider">{createdInfo.password}</span>
                    <button className="p-2 hover:bg-white/10 rounded-lg"><Copy className="w-4 h-4" /></button>
                  </div>
               </div>
            </div>
            <button 
              onClick={() => setCreatedInfo(null)}
              className="mt-6 text-xs font-black uppercase tracking-widest hover:underline"
            >
              Bağla
            </button>
         </div>
       )}

       <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50">
             <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Müəllim adı və ya mail ilə axtar..." 
                  className="w-full bg-white pl-12 pr-4 py-3 rounded-xl border border-gray-100 focus:border-[#00D084] focus:ring-0 transition-all text-sm outline-none"
                />
             </div>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-gray-50/50">
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Müəllim</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Email</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Kurslar</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Status</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest italic text-right">Əməliyyat</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {teachers.map((t, i) => (
                     <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-6 font-bold text-gray-900">{t.name} {t.surname}</td>
                        <td className="px-8 py-6 text-gray-500 font-medium">{t.email}</td>
                        <td className="px-8 py-6 font-bold text-gray-900">{t.courses} kurs</td>
                        <td className="px-8 py-6">
                           <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                             t.status === 'Aktiv' ? 'bg-[#00D084]/10 text-[#00D084]' : 'bg-orange-100 text-orange-600'
                           }`}>
                             {t.status}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                              <MoreVertical className="w-5 h-5" />
                           </button>
                        </td>
                     </tr>
                   ))}
                   {teachers.length === 0 && (
                     <tr>
                       <td colSpan={5} className="px-8 py-12 text-center text-gray-400 italic">
                         Hələ ki, heç bir müəllim hesabı yaradılmayıb.
                       </td>
                     </tr>
                   )}
                </tbody>
             </table>
          </div>
       </div>

       <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Yeni Müəllim Hesabı Yaradın"
       >
         <form onSubmit={handleCreate} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 italic">Ad</label>
                  <input 
                    required
                    value={newTeacher.name}
                    onChange={e => setNewTeacher({...newTeacher, name: e.target.value})}
                    type="text" 
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#00D084] outline-none transition-all font-bold"
                    placeholder="Məryəm"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 italic">Soyad</label>
                  <input 
                    required
                    value={newTeacher.surname}
                    onChange={e => setNewTeacher({...newTeacher, surname: e.target.value})}
                    type="text" 
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#00D084] outline-none transition-all font-bold"
                    placeholder="Ələkbərli"
                  />
               </div>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500 italic">Email Ünvanı</label>
                <input 
                  required
                  value={newTeacher.email}
                  onChange={e => setNewTeacher({...newTeacher, email: e.target.value})}
                  type="email" 
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#00D084] outline-none transition-all font-bold"
                  placeholder="name@rimacademy.az"
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500 italic">Müvəqqəti Şifrə</label>
                <input 
                  required
                  value={newTeacher.password}
                  onChange={e => setNewTeacher({...newTeacher, password: e.target.value})}
                  type="text" 
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#00D084] outline-none transition-all font-bold font-mono tracking-widest"
                  placeholder="RIM2026!#"
                />
            </div>
            <button 
              type="submit"
              className="w-full bg-[#00D084] hover:bg-[#00B873] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-[#00D084]/20 transition-all active:scale-95 mt-4"
            >
              Hesabı Yarat
            </button>
         </form>
       </Modal>
    </div>
  );
};

const Students = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
           <h1 className="text-3xl font-black text-gray-900">Tələbə Siyahısı</h1>
           <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
              <p className="text-gray-500 italic">Tələbə siyahısı tezliklə burada əks olunacaq.</p>
           </div>
        </div>
    );
};

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
      <div className="flex min-h-screen bg-[#F8FAFC]">
        <Sidebar />
        <main className="flex-1 ml-72 p-12 transition-all">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/students" element={<Students />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

