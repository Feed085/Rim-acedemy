import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import {
  ArrowUpRight,
  BookOpen,
  Check,
  Copy,
  Edit3,
  GraduationCap,
  Grid,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Tag as TagIcon,
  Trash2,
  UserPlus,
  Users,
  X,
  Clock
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import AdminLoginScreen from './components/AdminLoginScreen';
import { adminApi, ADMIN_SESSION_TOKEN_KEY, ADMIN_SESSION_USER_KEY } from './services/api';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

type DashboardCard = {
  key: string;
  label: string;
  value: number | null;
  displayValue?: string;
  trendLabel: string;
  trendType: 'up' | 'down' | 'neutral';
  note?: string;
};

type DashboardData = {
  cards: DashboardCard[];
  topCourses: Array<{
    id: string;
    title: string;
    category: string;
    instructorName: string;
    studentCount: number;
  }>;
  latestStudents: Array<{
    id: string;
    name: string;
    email: string;
    activeCoursesCount: number;
    assignedTestsCount: number;
    createdAt: string;
  }>;
  latestTeachers: Array<{
    id: string;
    name: string;
    surname: string;
    email: string;
    categories: string[];
    courseCount: number;
    testCount: number;
    rating: number;
  }>;
};

type CategoryItem = {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
};

type TeacherItem = {
  id: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  categories: string[];
  rating: number;
  courseCount: number;
  testCount: number;
  education?: string;
  experience?: string;
  location?: string;
};

type StudentItem = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  educationLevel?: string;
  activeCourses: Array<{ _id: string; title: string; category: string }>;
  assignedTests: Array<{ _id: string; title: string; courseTitle?: string }>;
  activeCoursesCount: number;
  assignedTestsCount: number;
  completedTestsCount: number;
  createdAt: string;
};

type CourseItem = {
  id: string;
  title: string;
  category: string;
  instructor: string;
  courseTitle?: string;
  price: number;
  isActive: boolean;
  studentCount: number;
};

type TestItem = {
  id: string;
  title: string;
  courseTitle: string;
  instructorName: string;
  duration: number;
  questionCount: number;
};

type AssignmentMode = 'course' | 'test';

type AdminUser = {
  email: string;
  name: string;
  picture?: string;
};

type AdminSession = {
  token: string;
  user: AdminUser;
};

const ADMIN_LOGO_SRC = '/rim-academy-logo.jpeg';

const adminMenuItems = [
  { icon: LayoutDashboard, label: 'Panel', path: '/' },
  { icon: Users, label: 'Müəllimlər', path: '/teachers' },
  { icon: GraduationCap, label: 'Tələbələr', path: '/students' },
  { icon: Grid, label: 'Kateqoriyalar', path: '/categories' }
];

const adminRouteTitles: Record<string, string> = {
  '/': 'Panel',
  '/teachers': 'Müəllimlər',
  '/students': 'Tələbələr',
  '/categories': 'Kateqoriyalar'
};

const loadAdminSession = (): AdminSession | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const token = localStorage.getItem(ADMIN_SESSION_TOKEN_KEY);
  const userData = localStorage.getItem(ADMIN_SESSION_USER_KEY);

  if (!token || !userData) {
    return null;
  }

  try {
    const user = JSON.parse(userData) as AdminUser;
    if (!user?.email) {
      return null;
    }

    return { token, user };
  } catch {
    return null;
  }
};

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/40 px-3 py-4 backdrop-blur-sm sm:items-center sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md overflow-hidden rounded-[24px] bg-white shadow-2xl animate-in zoom-in-95 duration-200 sm:rounded-[32px]">
        <div className="flex items-center justify-between border-b border-gray-50 bg-gray-50/30 p-4 sm:p-6 lg:p-8">
          <h3 className="text-lg font-black text-gray-900 sm:text-xl">{title}</h3>
          <button onClick={onClose} className="rounded-xl p-2 transition-colors hover:bg-white">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
};

const formatNumber = (value: number | null | undefined) => {
  if (value === null || value === undefined) return '0';
  return new Intl.NumberFormat('az-AZ').format(value);
};

const formatDate = (value?: string) => {
  if (!value) return '-';
  return new Intl.DateTimeFormat('az-AZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(value));
};

const resolveCategoryName = (categoryId: string, categories: CategoryItem[]) => {
  return categories.find((category) => category.id === categoryId)?.name || categoryId || '---';
};

const AdminBrand = ({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) => (
  <Link to="/" onClick={onNavigate} className="flex items-center gap-3">
    <img
      src={ADMIN_LOGO_SRC}
      alt="Rim Academy"
      className="h-10 w-10 rounded-2xl object-cover ring-1 ring-black/5"
    />
    <div className="flex flex-col leading-none">
      <span className={`font-black uppercase italic tracking-tight text-gray-900 ${compact ? 'text-lg' : 'text-xl'}`}>
        Rim
      </span>
      <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] leading-none text-[#00D084]">
        Academy
      </span>
    </div>
  </Link>
);

const AdminNavigation = ({ onNavigate }: { onNavigate?: () => void }) => {
  const location = useLocation();

  return (
    <nav className="flex-1 space-y-2 px-4 py-4">
      {adminMenuItems.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={`flex items-center gap-4 rounded-2xl px-6 py-4 transition-all ${
              isActive
                ? 'bg-[#00D084] font-bold text-white shadow-lg shadow-[#00D084]/20'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-sm">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

const Sidebar = ({ onLogout, adminUser }: { onLogout: () => void; adminUser: AdminUser }) => {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden h-screen w-56 flex-col overflow-y-auto border-r border-gray-100 bg-white lg:flex">
      <div className="flex h-24 items-center px-8">
        <AdminBrand />
      </div>

      <AdminNavigation />

      <div className="border-t border-gray-50 p-4 space-y-3">
        <div className="rounded-2xl bg-gray-50 px-4 py-3">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Daxil olan hesab</p>
          <p className="mt-1 truncate text-sm font-bold text-gray-900">{adminUser.email}</p>
        </div>
        <button onClick={onLogout} className="flex w-full items-center gap-4 rounded-2xl px-6 py-4 font-bold text-red-500 transition-all hover:bg-red-50">
          <LogOut className="h-5 w-5" />
          <span className="text-sm">Çıxış</span>
        </button>
      </div>
    </aside>
  );
};

const MobileMenu = ({
  open,
  onOpenChange,
  onLogout,
  adminUser,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogout: () => void;
  adminUser: AdminUser;
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/45 backdrop-blur-sm lg:hidden" />
        <Dialog.Content className="fixed inset-y-0 left-0 z-[80] flex w-[88vw] max-w-sm flex-col bg-white shadow-2xl outline-none lg:hidden">
          <Dialog.Title className="sr-only">Admin menyu</Dialog.Title>

          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <AdminBrand onNavigate={() => onOpenChange(false)} />
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-full border border-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <AdminNavigation onNavigate={() => onOpenChange(false)} />
          </div>

          <div className="border-t border-gray-100 p-4 space-y-3">
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Daxil olan hesab</p>
              <p className="mt-1 truncate text-sm font-bold text-gray-900">{adminUser.email}</p>
            </div>
            <button
              onClick={() => {
                onOpenChange(false);
                onLogout();
              }}
              className="flex w-full items-center gap-4 rounded-2xl px-6 py-4 font-bold text-red-500 transition-all hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm">Çıxış</span>
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const MobileTopBar = ({
  title,
  onOpenMenu,
  onLogout,
}: {
  title: string;
  onOpenMenu: () => void;
  onLogout: () => void;
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur lg:hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={onOpenMenu}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-100 bg-white text-gray-700 shadow-sm transition-colors hover:border-[#00D084] hover:text-[#00D084]"
          aria-label="Menyunu aç"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <img
            src={ADMIN_LOGO_SRC}
            alt="Rim Academy"
            className="h-10 w-10 rounded-2xl object-cover ring-1 ring-black/5"
          />
          <div className="min-w-0">
            <p className="truncate text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              Rim Academy
            </p>
            <h1 className="truncate text-sm font-black text-gray-900">{title}</h1>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-50 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500"
          aria-label="Çıxış"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

const AdminShell = ({
  onLogout,
  adminUser,
  children,
}: {
  onLogout: () => void;
  adminUser: AdminUser;
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pageTitle = adminRouteTitles[location.pathname] || 'Admin panel';

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.title = `${pageTitle} — RIM Academy Admin`;
  }, [pageTitle]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] lg:pl-56">
      <Sidebar onLogout={onLogout} adminUser={adminUser} />
      <MobileMenu
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        onLogout={onLogout}
        adminUser={adminUser}
      />

      <div className="flex min-h-screen flex-col">
        <MobileTopBar
          title={pageTitle}
          onOpenMenu={() => setMobileMenuOpen(true)}
          onLogout={onLogout}
        />
        <main className="min-w-0 flex-1 p-4 pb-8 sm:p-6 lg:p-12">{children}</main>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const response = await adminApi.getDashboard();
      if (response.success) {
        setDashboard(response.data);
      } else {
        toast.error(response.message || 'Dashboard məlumatları alınmadı');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Dashboard məlumatları alınmadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const cards = dashboard?.cards || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Admin panel</h1>
          <p className="mt-1 text-gray-500">Kurs, tələbə və müəllim axınına canlı baxış.</p>
        </div>
        <button
          onClick={loadDashboard}
          className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 shadow-sm transition-all hover:border-[#00D084] hover:text-[#00D084]"
        >
          <RefreshCw className="h-4 w-4" />
          Yenilə
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {(loading ? Array.from({ length: 4 }, () => undefined) : cards as Array<DashboardCard | undefined>).map((card, index) => {
          if (loading) {
            return (
              <div key={index} className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-sm">
                <div className="mb-4 h-3 w-24 animate-pulse rounded-full bg-gray-100" />
                <div className="h-9 w-32 animate-pulse rounded-2xl bg-gray-100" />
                <div className="mt-4 h-5 w-28 animate-pulse rounded-full bg-gray-100" />
              </div>
            );
          }

          if (!card) return null;

          return (
            <div key={card.key} className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-gray-400">{card.label}</p>
              <div className="flex items-end justify-between gap-3">
                <h3 className="text-3xl font-black leading-none text-gray-900">
                  {card.displayValue || formatNumber(card.value)}
                </h3>
                <span
                  className={`rounded-lg px-2 py-1 text-xs font-bold ${
                    card.trendType === 'up'
                      ? 'bg-[#00D084]/10 text-[#00D084]'
                      : card.trendType === 'down'
                        ? 'bg-red-50 text-red-500'
                        : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {card.trendLabel}
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-500">{card.note}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-xl font-black text-gray-900">Ən aktiv kurslar</h3>
          <span className="rounded-full bg-gray-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-gray-500">
            Canlı
          </span>
        </div>
        <div className="space-y-5">
          {(dashboard?.topCourses || []).map((course) => (
            <div key={course.id} className="flex flex-col gap-4 rounded-2xl border border-gray-50 p-4 transition-colors hover:bg-gray-50/50 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 font-black text-[#00D084] transition-all group-hover:bg-[#00D084] group-hover:text-white">
                  {course.title[0]}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{course.title}</h4>
                  <p className="text-xs text-gray-500">{course.instructorName} · {course.category}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">{formatNumber(course.studentCount)} tələbə</div>
                <div className="text-[10px] font-black uppercase text-[#00D084]">Aktiv</div>
              </div>
            </div>
          ))}
          {!loading && dashboard && dashboard.topCourses.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
              Hələ aktiv kurs yoxdur.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00D084]/10">
                <Users className="h-6 w-6 text-[#00D084]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">Son müəllimlər</h3>
                <p className="text-sm text-gray-500">Backend-dən gələn ən son qeydiyyatlar</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {(dashboard?.latestTeachers || []).map((teacher) => (
              <div key={teacher.id} className="rounded-2xl border border-gray-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div>
                    <div className="font-bold text-gray-900">{teacher.name} {teacher.surname}</div>
                    <div className="text-sm text-gray-500">{teacher.email}</div>
                  </div>
                  <div className="text-left text-sm font-bold text-gray-900 sm:text-right">
                    {teacher.courseCount} kurs · {teacher.testCount} test
                  </div>
                </div>
              </div>
            ))}
            {!loading && dashboard && dashboard.latestTeachers.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
                Hələ müəllim yoxdur.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                <GraduationCap className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">Son tələbələr</h3>
                <p className="text-sm text-gray-500">Yeni qoşulan tələbələr</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {(dashboard?.latestStudents || []).map((student) => (
              <div key={student.id} className="rounded-2xl border border-gray-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div>
                    <div className="font-bold text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">{student.email}</div>
                  </div>
                  <div className="text-left text-sm font-bold text-gray-900 sm:text-right">
                    {student.activeCoursesCount} kurs · {student.assignedTestsCount} test
                  </div>
                </div>
              </div>
            ))}
            {!loading && dashboard && dashboard.latestStudents.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
                Hələ tələbə yoxdur.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Teachers = () => {
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [createdInfo, setCreatedInfo] = useState<{ email: string; password: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    category: '',
    phoneNumber: ''
  });

  const loadData = async () => {
    setLoading(true);

    try {
      const [teachersResponse, categoriesResponse] = await Promise.all([
        adminApi.getTeachers(),
        adminApi.getCategories()
      ]);

      if (teachersResponse.success) {
        setTeachers(teachersResponse.data);
      }

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Müəllim məlumatları alınmadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTeachers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return teachers;

    return teachers.filter((teacher) => {
      const categoryName = resolveCategoryName(teacher.categories?.[0] || '', categories);
      return [teacher.name, teacher.surname, teacher.email, categoryName]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [teachers, categories, search]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const payload = {
        name: newTeacher.name,
        surname: newTeacher.surname,
        email: newTeacher.email,
        phoneNumber: newTeacher.phoneNumber,
        categories: newTeacher.category ? [newTeacher.category] : []
      };

      const response = editingTeacherId
        ? await adminApi.updateTeacher(editingTeacherId, payload)
        : await adminApi.createTeacher({ ...payload, password: newTeacher.password });

      if (response.success) {
        if (!editingTeacherId) {
          setCreatedInfo({ email: newTeacher.email, password: newTeacher.password });
        } else {
          setCreatedInfo(null);
        }
        setNewTeacher({ name: '', surname: '', email: '', password: '', category: '', phoneNumber: '' });
        setIsModalOpen(false);
        setEditingTeacherId(null);
        toast.success('Müəllim hesabı yaradıldı');
        await loadData();
      } else {
        toast.error(response.message || 'Müəllim əməliyyatı uğursuz oldu');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Serverlə əlaqə qurula bilmədi');
    }
  };

  const copyCredentials = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success('Kopyalandı');
  };

  const openCreateModal = () => {
    setEditingTeacherId(null);
    setNewTeacher({ name: '', surname: '', email: '', password: '', category: '', phoneNumber: '' });
    setCreatedInfo(null);
    setIsModalOpen(true);
  };

  const openEditModal = (teacher: TeacherItem) => {
    setEditingTeacherId(teacher.id);
    setNewTeacher({
      name: teacher.name,
      surname: teacher.surname,
      email: teacher.email,
      password: '',
      category: teacher.categories?.[0] || '',
      phoneNumber: teacher.phoneNumber || ''
    });
    setCreatedInfo(null);
    setIsModalOpen(true);
  };

  const handleDeleteTeacher = async (teacher: TeacherItem) => {
    const confirmed = window.confirm(`${teacher.name} ${teacher.surname} silinsin?`);
    if (!confirmed) return;

    try {
      const response = await adminApi.deleteTeacher(teacher.id);
      if (response.success) {
        toast.success('Müəllim silindi');
        await loadData();
      } else {
        toast.error(response.message || 'Müəllim silinmədi');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Müəllim silinmədi');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Müəllimlər</h1>
          <p className="mt-1 text-gray-500">Yalnız müəllim hesabları burada göstərilir.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#00D084] px-6 py-3 font-bold text-white shadow-lg shadow-[#00D084]/20 transition-all active:scale-95 hover:bg-[#00B873]"
        >
          <Plus className="h-5 w-5" />
          Yeni Müəllim
        </button>
      </div>

      <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            type="text"
            placeholder="Müəllim adı, email və ya kateqoriya ilə axtar..."
            className="w-full rounded-xl border border-gray-100 bg-white py-3 pl-12 pr-4 text-sm outline-none transition-all focus:border-[#00D084] focus:ring-0"
          />
        </div>
      </div>

      {createdInfo && (
        <div className="animate-in slide-in-from-top-4 rounded-[32px] bg-[#00D084] p-8 text-white shadow-xl shadow-[#00D084]/20 duration-500">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-black">
            <Check className="h-6 w-6" />
            Hesab yaradıldı
          </h3>
          <p className="mb-6 text-sm opacity-90">Aşağıdakı giriş məlumatlarını müəllimə göndərin:</p>
          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-black uppercase tracking-widest opacity-60">Email</span>
              <div className="flex items-center gap-3">
                <span className="font-bold">{createdInfo.email}</span>
                <button onClick={() => copyCredentials(createdInfo.email)} className="rounded-lg p-2 transition-colors hover:bg-white/10">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-black uppercase tracking-widest opacity-60">Şifrə</span>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold tracking-wider">{createdInfo.password}</span>
                <button onClick={() => copyCredentials(createdInfo.password)} className="rounded-lg p-2 transition-colors hover:bg-white/10">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <button onClick={() => setCreatedInfo(null)} className="mt-6 text-xs font-black uppercase tracking-widest hover:underline">
            Bağla
          </button>
        </div>
      )}

      <div className="rounded-[32px] border border-gray-100 bg-white shadow-sm">
        <div className="space-y-3 p-3 sm:p-4">
          {loading && (
            <div className="rounded-2xl border border-gray-100 p-6 text-center text-gray-400">Müəllimlər yüklənir...</div>
          )}
          {!loading && filteredTeachers.map((teacher) => (
            <div key={teacher.id} className="rounded-2xl border border-gray-100 p-4 transition-colors hover:bg-gray-50/50 sm:p-5">
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1.2fr)_minmax(0,0.9fr)_auto] xl:items-center">
                <div className="min-w-0">
                  <div className="truncate font-bold text-gray-900">{teacher.name} {teacher.surname}</div>
                  <div className="truncate text-sm text-gray-500">Müəllim hesabı</div>
                </div>
                <div className="min-w-0 text-sm text-gray-500">
                  <div className="truncate font-medium text-gray-700">{teacher.email}</div>
                  <div className="truncate text-xs text-gray-400">Əlaqə emaili</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase text-blue-600">
                    {resolveCategoryName(teacher.categories?.[0] || '', categories)}
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-black uppercase text-gray-600">
                    {teacher.courseCount} kurs
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-black uppercase text-gray-600">
                    {teacher.testCount} test
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 xl:justify-end">
                  <button
                    onClick={() => openEditModal(teacher)}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-600 transition-colors hover:border-[#00D084] hover:text-[#00D084]"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Düzəlt
                  </button>
                  <button
                    onClick={() => handleDeleteTeacher(teacher)}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-red-500 transition-colors hover:border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!loading && filteredTeachers.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center italic text-gray-400">
              Hələ ki, heç bir müəllim hesabı yaradılmayıb.
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTeacherId(null); }}
        title={editingTeacherId ? 'Müəllim Redaktə Et' : 'Yeni Müəllim Hesabı'}
      >
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 italic">Ad</label>
              <input
                required
                value={newTeacher.name}
                onChange={(event) => setNewTeacher({ ...newTeacher, name: event.target.value })}
                type="text"
                className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 font-bold outline-none transition-all focus:border-[#00D084] focus:bg-white"
                placeholder="Məryəm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 italic">Soyad</label>
              <input
                required
                value={newTeacher.surname}
                onChange={(event) => setNewTeacher({ ...newTeacher, surname: event.target.value })}
                type="text"
                className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 font-bold outline-none transition-all focus:border-[#00D084] focus:bg-white"
                placeholder="Ələkbərli"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 italic">Email</label>
            <input
              required
              value={newTeacher.email}
              onChange={(event) => setNewTeacher({ ...newTeacher, email: event.target.value })}
              type="email"
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 font-bold outline-none transition-all focus:border-[#00D084] focus:bg-white"
              placeholder="name@rimacademy.az"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 italic">Telefon</label>
            <input
              value={newTeacher.phoneNumber}
              onChange={(event) => setNewTeacher({ ...newTeacher, phoneNumber: event.target.value })}
              type="text"
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 font-bold outline-none transition-all focus:border-[#00D084] focus:bg-white"
              placeholder="+994 50 000 00 00"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 italic">Müvəqqəti Şifrə</label>
            <input
              required={!editingTeacherId}
              value={newTeacher.password}
              onChange={(event) => setNewTeacher({ ...newTeacher, password: event.target.value })}
              type="text"
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 font-mono font-bold tracking-widest outline-none transition-all focus:border-[#00D084] focus:bg-white"
              placeholder={editingTeacherId ? 'Boş buraxın' : 'RIM2026!#'}
              disabled={Boolean(editingTeacherId)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 italic">Kateqoriya</label>
            <select
              required
              value={newTeacher.category}
              onChange={(event) => setNewTeacher({ ...newTeacher, category: event.target.value })}
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 font-bold outline-none transition-all focus:border-[#00D084] focus:bg-white"
            >
              <option value="">Kateqoriya seçin...</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="mt-4 w-full rounded-2xl bg-[#00D084] py-5 text-lg font-black text-white shadow-xl shadow-[#00D084]/20 transition-all active:scale-95 hover:bg-[#00B873]"
          >
            {editingTeacherId ? 'Düzəlişi Saxla' : 'Hesabı Yarat'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

const Students = () => {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null);
  const [assignmentType, setAssignmentType] = useState<AssignmentMode>('course');
  const [selectedTargetId, setSelectedTargetId] = useState('');
  const [assignmentSearch, setAssignmentSearch] = useState('');

  const loadData = async () => {
    setLoading(true);

    try {
      const [studentsResponse, coursesResponse, testsResponse] = await Promise.all([
        adminApi.getStudents(),
        adminApi.getCourses(),
        adminApi.getTests()
      ]);

      if (studentsResponse.success) setStudents(studentsResponse.data);
      if (coursesResponse.success) setCourses(coursesResponse.data);
      if (testsResponse.success) setTests(testsResponse.data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Tələbə məlumatları alınmadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return students;

    return students.filter((student) =>
      [student.name, student.email, student.phoneNumber || '', student.educationLevel || '']
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [students, search]);

  const openAssignment = (student: StudentItem, mode: AssignmentMode = 'course') => {
    setSelectedStudent(student);
    setAssignmentType(mode);
    setSelectedTargetId('');
    setAssignmentSearch('');
    setAssignmentModalOpen(true);
  };

  const handleAssign = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedStudent) return;

    try {
      const response = await adminApi.assignStudentItem(selectedStudent.id, {
        type: assignmentType,
        targetId: selectedTargetId
      });

      if (response.success) {
        toast.success(assignmentType === 'course' ? 'Kurs tələbəyə verildi' : 'Test tələbəyə verildi');
        setAssignmentModalOpen(false);
        setSelectedStudent(null);
        setSelectedTargetId('');
        setAssignmentSearch('');
        await loadData();
      } else {
        toast.error(response.message || 'Təyinat edilə bilmədi');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Təyinat edilə bilmədi');
    }
  };

  const filteredResources = useMemo(() => {
    const query = assignmentSearch.trim().toLowerCase();

    const toSearchableText = (value: unknown) => String(value ?? '').toLowerCase();

    if (!query) {
      return assignmentType === 'course' ? courses : tests;
    }

    if (assignmentType === 'course') {
      return courses.filter((course) => (
        toSearchableText(course.title).includes(query)
        || toSearchableText(course.category).includes(query)
        || toSearchableText(course.instructor).includes(query)
      ));
    }

    return tests.filter((test) => (
      toSearchableText(test.title).includes(query)
      || toSearchableText(test.courseTitle).includes(query)
      || toSearchableText(test.instructorName).includes(query)
    ));
  }, [courses, tests, assignmentSearch, assignmentType]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-3xl font-black text-gray-900">Tələbələr</h1>
          <p className="mt-1 text-gray-500">Tələbələr görünür və onlara kurs və ya test təyin edilir.</p>
        </div>
        <button
          onClick={() => loadData()}
          className="inline-flex items-center gap-2 self-start rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition-all hover:border-[#00D084] hover:text-[#00D084]"
        >
          <RefreshCw className="h-4 w-4" />
          Yenilə
        </button>
      </div>

      <div className="rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              type="text"
              placeholder="Tələbə adı, email və ya telefon ilə axtar..."
              className="w-full rounded-xl border border-gray-100 bg-white py-3 pl-12 pr-4 text-sm outline-none transition-all focus:border-[#00D084] focus:ring-0"
            />
          </div>
          <div className="rounded-2xl bg-gray-50 px-4 py-3 text-sm font-bold text-gray-600">
            {filteredStudents.length} tələbə
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-gray-100 bg-white shadow-sm">
        <div className="space-y-3 p-3 sm:p-4">
          {loading && (
            <div className="rounded-2xl border border-gray-100 p-6 text-center text-gray-400">Tələbələr yüklənir...</div>
          )}
          {!loading && filteredStudents.map((student) => (
            <div key={student.id} className="rounded-2xl border border-gray-100 p-4 transition-colors hover:bg-gray-50/50 sm:p-5">
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1.2fr)_minmax(0,1.5fr)_minmax(0,1.5fr)_auto] xl:items-center">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50">
                      <GraduationCap className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-bold text-sm text-gray-900">{student.name}</div>
                      <div className="truncate text-[11px] text-gray-400">{student.educationLevel || 'Təyin edilməyib'}</div>
                    </div>
                  </div>
                </div>
                <div className="min-w-0 text-xs text-gray-500">
                  <div className="truncate font-medium text-gray-700">{student.email}</div>
                  <div className="truncate">{student.phoneNumber || '-'}</div>
                </div>
                <div className="min-w-0">
                  <div className="mb-1 text-[10px] font-black uppercase tracking-[0.14em] text-gray-400 xl:hidden">Kurslar</div>
                  <div className="flex flex-wrap gap-1.5">
                    {student.activeCourses.map((course) => (
                      <span key={course._id} className="max-w-full rounded-md bg-gray-100 px-2 py-1 text-[10px] font-bold leading-tight text-gray-600 break-words">
                        {course.title}
                      </span>
                    ))}
                    {student.activeCourses.length === 0 && <span className="text-xs text-gray-400">Yoxdur</span>}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="mb-1 text-[10px] font-black uppercase tracking-[0.14em] text-gray-400 xl:hidden">Testlər</div>
                  <div className="flex flex-wrap gap-1.5">
                    {student.assignedTests.map((test) => (
                      <span key={test._id} className="max-w-full rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold leading-tight text-blue-600 break-words">
                        {test.title}
                      </span>
                    ))}
                    {student.assignedTests.length === 0 && <span className="text-xs text-gray-400">Yoxdur</span>}
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2 xl:items-end">
                  <div className="text-xs text-gray-500">{formatDate(student.createdAt)}</div>
                  <button
                    onClick={() => openAssignment(student)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#00D084] px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-lg shadow-[#00D084]/20 transition-all hover:bg-[#00B873] active:scale-95"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Kurs/Test ver
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!loading && filteredStudents.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center italic text-gray-400">
              Hələ ki, heç bir tələbə yoxdur.
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={assignmentModalOpen}
        onClose={() => setAssignmentModalOpen(false)}
        title={selectedStudent ? `${selectedStudent.name} üçün təyinat` : 'Təyinat'}
      >
        <form onSubmit={handleAssign} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 italic">Tip</label>
            <select
              value={assignmentType}
              onChange={(event) => {
                const nextType = event.target.value as AssignmentMode;
                setAssignmentType(nextType);
                setSelectedTargetId('');
                setAssignmentSearch('');
              }}
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 font-bold outline-none transition-all focus:border-[#00D084] focus:bg-white"
            >
              <option value="course">Kurs ver</option>
              <option value="test">Test ver</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 italic">
              {assignmentType === 'course' ? 'Kurs seçin' : 'Test seçin'}
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                value={assignmentSearch}
                onChange={(event) => setAssignmentSearch(event.target.value)}
                type="text"
                placeholder={assignmentType === 'course' ? 'Kurs axtar...' : 'Test axtar...'}
                className="mb-3 w-full rounded-2xl border border-gray-100 bg-gray-50 px-12 py-4 text-sm font-medium outline-none transition-all focus:border-[#00D084] focus:bg-white"
              />
            </div>
            <select
              required
              value={selectedTargetId}
              onChange={(event) => setSelectedTargetId(event.target.value)}
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 font-bold outline-none transition-all focus:border-[#00D084] focus:bg-white"
            >
              <option value="">Seçim edin...</option>
              {assignmentType === 'course'
                ? filteredResources.length > 0
                  ? filteredResources.map((course) => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                  ))
                  : <option value="" disabled>Axtarışa uyğun kurs tapılmadı</option>
                : filteredResources.map((test) => (
                  <option key={test.id} value={test.id}>{test.title} · {test.courseTitle || ''}</option>
                ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full rounded-2xl bg-[#00D084] py-5 text-lg font-black text-white shadow-xl shadow-[#00D084]/20 transition-all hover:bg-[#00B873] active:scale-95"
          >
            Təyin et
          </button>
        </form>
      </Modal>
    </div>
  );
};

const Categories = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const loadCategories = async () => {
    setLoading(true);

    try {
      const response = await adminApi.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Kateqoriyalar alınmadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return categories;
    }

    return categories.filter((category) => (
      category.name.toLowerCase().includes(query)
      || (category.description || '').toLowerCase().includes(query)
      || category.id.toLowerCase().includes(query)
    ));
  }, [categories, searchQuery]);

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await adminApi.createCategory({ name: newCategory.name });
      if (response.success) {
        toast.success('Yeni kateqoriya əlavə edildi');
        setIsModalOpen(false);
        setNewCategory({ name: '' });
        await loadCategories();
      } else {
        toast.error(response.message || 'Kateqoriya əlavə edilə bilmədi');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Kateqoriya əlavə edilə bilmədi');
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      const response = await adminApi.deleteCategory(categoryId);
      if (response.success) {
        toast.success('Kateqoriya silindi');
        await loadCategories();
      } else {
        toast.error(response.message || 'Kateqoriya silinmədi');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Kateqoriya silinmədi');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00D084]/10">
            <Grid className="h-6 w-6 text-[#00D084]" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Kateqoriyalar</h1>
            <p className="text-gray-500 font-medium">Kateqoriyalar artıq backend üzərində idarə olunur.</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-black px-6 py-3 font-bold text-white shadow-lg transition-all active:scale-95 hover:bg-gray-900"
        >
          <Plus className="h-5 w-5" />
          Yeni Kateqoriya
        </button>
      </div>

      <div className="flex flex-col gap-4 rounded-[28px] border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            type="text"
            placeholder="Kateqoriya axtar..."
            className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-12 py-4 font-medium outline-none transition-all focus:border-[#00D084] focus:bg-white"
          />
        </div>
        <div className="text-sm font-medium text-gray-500">
          {filteredCategories.length} kateqoriya
        </div>
      </div>

      <div className="overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-sm">
        <div className="space-y-3 p-3 sm:p-4 md:hidden">
          {loading && (
            <div className="rounded-2xl border border-gray-100 p-6 text-center text-gray-400">
              Kateqoriyalar yüklənir...
            </div>
          )}
          {!loading && filteredCategories.map((category) => (
            <div key={category.id} className="rounded-2xl border border-gray-100 p-4">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${category.color || '#E5E7EB'}22` }}
                >
                  <TagIcon className="h-5 w-5" style={{ color: category.color || '#9CA3AF' }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-bold text-gray-900">{category.name}</div>
                      <div className="mt-1 break-words text-sm leading-6 text-gray-500">
                        {category.description || 'Açıklama yoxdur'}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                      Sil
                    </button>
                  </div>
                  <code className="mt-3 inline-flex rounded-md bg-blue-50 px-2 py-1 text-xs font-black text-blue-500">
                    {category.id}
                  </code>
                </div>
              </div>
            </div>
          ))}
          {!loading && filteredCategories.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center italic text-gray-400">
              {searchQuery.trim() ? 'Axtarışa uyğun kateqoriya tapılmadı.' : 'Hələ kateqoriya yoxdur.'}
            </div>
          )}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[11px] font-black italic uppercase tracking-widest text-gray-400">Rəng</th>
                <th className="px-8 py-5 text-[11px] font-black italic uppercase tracking-widest text-gray-400">Kateqoriya</th>
                <th className="px-8 py-5 text-[11px] font-black italic uppercase tracking-widest text-gray-400">Sistem ID</th>
                <th className="px-8 py-5 text-[11px] font-black italic uppercase tracking-widest text-gray-400 text-right">Əməliyyat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-gray-400">Kateqoriyalar yüklənir...</td>
                </tr>
              )}
              {!loading && filteredCategories.map((category) => (
                <tr key={category.id} className="transition-colors hover:bg-gray-50/30">
                  <td className="px-8 py-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${category.color || '#E5E7EB'}22` }}>
                      <TagIcon className="h-5 w-5" style={{ color: category.color || '#9CA3AF' }} />
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-bold text-lg text-gray-900">{category.name}</div>
                    <div className="text-sm text-gray-500">{category.description || 'Açıklama yoxdur'}</div>
                  </td>
                  <td className="px-8 py-6">
                    <code className="rounded-md bg-blue-50 px-2 py-1 text-xs font-black text-blue-500">{category.id}</code>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center italic text-gray-400">
                    {searchQuery.trim() ? 'Axtarışa uyğun kateqoriya tapılmadı.' : 'Hələ kateqoriya yoxdur.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Yeni Kateqoriya">
        <form onSubmit={handleAdd} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 italic">Kateqoriya adı</label>
            <input
              required
              value={newCategory.name}
              onChange={(event) => setNewCategory({ name: event.target.value })}
              type="text"
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 font-bold outline-none transition-all focus:border-[#00D084] focus:bg-white"
              placeholder="Məs: Proqramlaşdırma"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-2xl bg-[#00D084] py-5 text-lg font-black text-white shadow-xl shadow-[#00D084]/20 transition-all hover:bg-[#00B873]"
          >
            Yarat
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default function AppAdmin() {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => loadAdminSession());

  useEffect(() => {
    const handleAuthExpired = () => {
      setAdminSession(null);
    };

    window.addEventListener('rim-admin-auth-expired', handleAuthExpired);

    return () => {
      window.removeEventListener('rim-admin-auth-expired', handleAuthExpired);
    };
  }, []);

  const handleAuthenticated = (session: AdminSession) => {
    localStorage.setItem(ADMIN_SESSION_TOKEN_KEY, session.token);
    localStorage.setItem(ADMIN_SESSION_USER_KEY, JSON.stringify(session.user));
    setAdminSession(session);
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_TOKEN_KEY);
    localStorage.removeItem(ADMIN_SESSION_USER_KEY);
    setAdminSession(null);
  };

  if (!adminSession) {
    return (
      <>
        <Toaster position="top-right" richColors closeButton />
        <AdminLoginScreen onAuthenticated={handleAuthenticated} />
      </>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
      <AdminShell onLogout={handleLogout} adminUser={adminSession.user}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/students" element={<Students />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </AdminShell>
    </BrowserRouter>
  );
}