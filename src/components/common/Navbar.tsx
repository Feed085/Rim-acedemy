import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, User, LogOut, BookOpen, Users, FileText, Phone, Home, ChevronDown } from 'lucide-react';
import logo from '@/photos/new_logo.png';
import { cn } from '@/lib/utils';
import { courses, teachers } from '@/data/mockData';


export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCoursesHovered, setIsCoursesHovered] = useState(false);
  const [isTeachersHovered, setIsTeachersHovered] = useState(false);
  
  const isDarkPage = location.pathname.startsWith('/courses/') || location.pathname === '/contact';
  
  const coursesTimer = useRef<any>(null);
  const teachersTimer = useRef<any>(null);

  const handleMouseEnter = (type: 'courses' | 'teachers') => {
    if (type === 'courses') {
      if (coursesTimer.current) clearTimeout(coursesTimer.current);
      setIsCoursesHovered(true);
      setIsTeachersHovered(false);
    } else {
      if (teachersTimer.current) clearTimeout(teachersTimer.current);
      setIsTeachersHovered(true);
      setIsCoursesHovered(false);
    }
  };

  const handleMouseLeave = (type: 'courses' | 'teachers') => {
    const timer = setTimeout(() => {
      if (type === 'courses') setIsCoursesHovered(false);
      else setIsTeachersHovered(false);
    }, 150);
    
    if (type === 'courses') coursesTimer.current = timer;
    else teachersTimer.current = timer;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t('nav.home'), href: '/', icon: Home },
    { label: t('nav.courses'), href: '/courses', icon: BookOpen },
    { label: t('nav.teachers'), href: '/teachers', icon: Users },
    ...(isAuthenticated ? [{ label: t('nav.tests'), href: '/tests', icon: FileText }] : []),
    { label: t('nav.contact'), href: '/contact', icon: Phone },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : location.pathname === '/contact'
          ? 'bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="RIM Academy Logo" 
              className="w-10 h-10 lg:w-12 lg:h-12 object-contain rounded-full border border-white/10"
            />
            <span className={`font-bold text-lg lg:text-2xl transition-colors ${
              isScrolled 
                ? 'text-gray-900' 
                : isDarkPage 
                ? 'text-white' 
                : 'text-gray-900'
            }`}>
              RIM Academy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const hasDropdown = item.href === '/courses' || item.href === '/teachers';
              const isHovered = item.href === '/courses' ? isCoursesHovered : isTeachersHovered;
              const type = item.href === '/courses' ? 'courses' : 'teachers';

              return (
                <div key={item.href} className="relative group">
                  <Link
                    to={item.href}
                    onMouseEnter={() => hasDropdown && handleMouseEnter(type)}
                    onMouseLeave={() => hasDropdown && handleMouseLeave(type)}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-[#00D084] px-3 py-1.5 rounded-lg flex items-center gap-1",
                      isActive(item.href)
                        ? 'text-[#00D084]'
                        : isScrolled
                        ? 'text-gray-700'
                        : isDarkPage
                        ? 'text-white/90'
                        : 'text-gray-700'
                    )}
                  >
                    {item.label}
                    {hasDropdown && (
                      <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isHovered && "rotate-180")} />
                    )}
                  </Link>

                  {hasDropdown && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className={cn(
                          "fixed top-[64px] lg:top-[80px] bottom-0 left-0 right-0 bg-black/30 backdrop-blur-[2px] z-[-1] transition-all duration-500 pointer-events-none",
                          isHovered ? "opacity-100 visible" : "opacity-0 invisible"
                        )}
                      />
                      {isHovered && (
                        <div 
                          className="fixed top-[64px] lg:top-[80px] -mt-[1px] left-0 right-0 w-screen bg-white shadow-[0_45px_100px_-25px_rgba(0,0,0,0.15)] border-b border-gray-100 animate-in fade-in slide-in-from-top-2 duration-500 ease-out z-[100] pointer-events-auto"
                          onMouseEnter={() => handleMouseEnter(type)}
                          onMouseLeave={() => handleMouseLeave(type)}
                        >
                          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                            <div className="grid grid-cols-4 gap-6">
                              <div className="col-span-4 mb-1 flex items-center justify-between">
                                <div>
                                  <h4 className="text-sm font-bold text-gray-900 tracking-tight">
                                    {item.href === '/courses' ? t('courses.title') : t('teachers.title')}
                                  </h4>
                                  <p className="text-[10px] text-gray-500">
                                    {item.href === '/courses' ? t('courses.subtitle') : t('teachers.subtitle')}
                                  </p>
                                </div>
                                <Link
                                  to={item.href}
                                  onClick={() => {
                                    setIsCoursesHovered(false);
                                    setIsTeachersHovered(false);
                                  }}
                                  className="text-[10px] font-bold text-[#00D084] hover:text-[#00B873] flex items-center gap-1 group transition-colors"
                                >
                                  {t('courses.view_all')}
                                  <ChevronDown className="w-2.5 h-2.5 -rotate-90 group-hover:translate-x-1 transition-transform" />
                                </Link>
                              </div>

                              {item.href === '/courses' ? (
                                courses.slice(0, 4).map((course) => (
                                  <Link
                                    key={course.id}
                                    to={`/courses`}
                                    onClick={() => setIsCoursesHovered(false)}
                                    className="group block select-none space-y-2 rounded-lg p-2 leading-none no-underline outline-none transition-all hover:bg-gray-50/80 border border-transparent hover:border-gray-100"
                                  >
                                    <div className="aspect-video w-full rounded-md overflow-hidden border border-gray-100 shadow-sm">
                                      <img 
                                        src={course.image} 
                                        alt={course.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <div className="text-[13px] font-bold leading-tight text-gray-900 group-hover:text-[#00D084] transition-colors line-clamp-1">
                                        {course.title}
                                      </div>
                                      <p className="line-clamp-1 text-[10px] leading-relaxed text-gray-500">
                                        {course.description}
                                      </p>
                                    </div>
                                  </Link>
                                ))
                              ) : (
                                teachers.slice(0, 4).map((teacher) => (
                                  <Link
                                    key={teacher.id}
                                    to={`/teachers`}
                                    onClick={() => setIsTeachersHovered(false)}
                                    className="group block select-none space-y-3 rounded-lg p-2 leading-none no-underline outline-none transition-all hover:bg-gray-50/80 border border-transparent hover:border-gray-100"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-[#00D084] transition-colors shrink-0">
                                        <img 
                                          src={teacher.avatar} 
                                          alt={teacher.name} 
                                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                        />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="text-[13px] font-bold leading-tight text-gray-900 group-hover:text-[#00D084] transition-colors line-clamp-1">
                                          {teacher.name} {teacher.surname}
                                        </div>
                                        <p className="line-clamp-1 text-[10px] text-gray-500 mt-0.5">
                                          {teacher.specialties.join(', ')}
                                        </p>
                                      </div>
                                    </div>
                                  </Link>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={cn(
                      "flex items-center gap-2 transition-colors",
                      isScrolled ? "text-gray-900" : isDarkPage ? "text-white" : "text-gray-900"
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#00D084] flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">{user?.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 z-[110]">
                  <DropdownMenuItem onClick={() => {
                    window.scrollTo(0, 0);
                    navigate(user?.role === 'teacher' ? '/teacher/dashboard' : '/dashboard');
                  }}>
                    <User className="w-4 h-4 mr-2" />
                    {t('nav.dashboard')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className={cn(
                    "font-medium transition-colors",
                    isScrolled ? "text-gray-900" : isDarkPage ? "text-white" : "text-gray-900"
                  )}
                >
                  {t('nav.login')}
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-[#00D084] hover:bg-[#00B873] text-white font-medium rounded-full px-6"
                >
                  {t('nav.register')}
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 text-lg font-medium transition-colors hover:text-[#00D084] ${
                      isActive(item.href) ? 'text-[#00D084]' : 'text-gray-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
                
                <div className="border-t pt-6 mt-4">
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#00D084] flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{user?.name} {user?.surname}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsOpen(false);
                          window.scrollTo(0, 0);
                          navigate(user?.role === 'teacher' ? '/teacher/dashboard' : '/dashboard');
                        }}
                      >
                        <User className="w-4 h-4 mr-2" />
                        {t('nav.dashboard')}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setIsOpen(false);
                          handleLogout();
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        {t('nav.logout')}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsOpen(false);
                          navigate('/login');
                        }}
                      >
                        {t('nav.login')}
                      </Button>
                      <Button
                        onClick={() => {
                          setIsOpen(false);
                          navigate('/register');
                        }}
                        className="bg-[#00D084] hover:bg-[#00B873]"
                      >
                        {t('nav.register')}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
