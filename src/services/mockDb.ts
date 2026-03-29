import { courses as initialCourses } from '@/data/mockData';

// This is a simple in-memory store for the current session
class MockDB {
  private courses = [...initialCourses].map(c => {
    let courseTests = [
      {
        id: 'test-1',
        title: 'Yekun İmtahan Testi',
        questions: [
          { id: 1, text: 'IELTS imtahanı neçə hissədən ibarətdir?', options: ['2', '3', '4', '5'], correctAnswer: '4' },
          { id: 2, text: 'Listening hissəsi üçün nə qədər vaxt verilir?', options: ['20 dəq', '30 dəq', '40 dəq', '60 dəq'], correctAnswer: '30 dəq' }
        ]
      }
    ];

    if (c.id === '2') { // IELTS Intensive
      courseTests = [
        {
          id: 'ielts-test-1',
          title: 'IELTS General Mock Test',
          questions: [
            { id: 1, text: 'What is the maximum band score in IELTS?', options: ['7.0', '8.0', '9.0', '10.0'], correctAnswer: '9.0' },
            { id: 2, text: 'How many tasks are in the Writing section?', options: ['1', '2', '3', '4'], correctAnswer: '2' }
          ]
        },
        {
          id: 'ielts-test-2',
          title: 'IELTS Speaking Assessment',
          questions: [
            { id: 1, text: 'Which is a common topic in Part 1?', options: ['Philosophy', 'Hometown', 'Politics', 'Law'], correctAnswer: 'Hometown' },
            { id: 2, text: 'How long is the long turn (Part 2)?', options: ['1 min', '2 mins', '3 mins', '5 mins'], correctAnswer: '2 mins' }
          ]
        }
      ];
    }

    if (c.id === '1') { // SAT
      courseTests = [
        {
          id: 'sat-math-1',
          title: 'SAT Math Diagnostic',
          questions: [
            { id: 1, text: 'Solve for x: 3x - 5 = 10', options: ['3', '4', '5', '6'], correctAnswer: '5' },
            { id: 2, text: 'What is the square root of 225?', options: ['12', '15', '20', '25'], correctAnswer: '15' }
          ]
        }
      ];
    }

    if (c.id === '3') { // İngilis Dili - Başlanğıc
      courseTests = [
        {
          id: 'asas',
          title: 'asas',
          questions: [
            { id: 1, text: 'What is "Salam" in English?', options: ['Hello', 'Goodbye', 'Good morning', 'Good night'], correctAnswer: 'Hello' },
            { id: 2, text: 'How do you say "Sağ ol"?', options: ['Thank you', 'Please', 'Sorry', 'Welcome'], correctAnswer: 'Thank you' }
          ]
        }
      ];
    }

    return {
      ...c,
      lessons: [
        { 
          id: 1, 
          title: 'Giriş və Əsas Anlayışlar', 
          duration: '12:45',
          description: 'Kursun ümumi məqsədləri və öyrəniləcək mövzular haqqında giriş dərsi.',
          thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'
        },
        { 
          id: 2, 
          title: 'IELTS-ə dair ümumi məlumat', 
          duration: '15:20',
          description: 'İmtahan strukturu, bölmələr və qiymətləndirmə meyarları.',
          thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80'
        }
      ],
      tests: courseTests,
      learningPoints: [
        'Kursun əsas mövzuları üzrə dərin biliklər',
        'Praktiki tapşırıqlar və real layihələr',
        'Peşəkar vərdişlərin inkişafı',
        'İmtahanlara hazırlıq strategiyaları',
        'Sənaye standartlarına uyğun metodika',
        'Yaradıcı düşüncə və problem həll etmə'
      ],
      includes: [
        'Ömürlük giriş imkanı',
        'Tamamlama sertifikatı',
        '7/24 Dəstək xidməti'
      ],
      lastUpdated: new Date().toLocaleDateString('az-AZ')
    };
  });

  private teacherProfile = {
    id: '1',
    name: 'Məryəm',
    surname: 'Ələkbərli',
    email: 'maryam@rimacademy.com',
    phone: '+994 50 123 45 67',
    bio: '10 ildən artıq təcrübəyə malik IELTS eksperti. Yüzlərlə tələbəyə yüksək ballar qazandırmış mütəxəssis.',
    education: 'Azərbaycan Dillər Universiteti',
    experience: 12,
    specialties: ['IELTS', 'TOEFL', 'SAT'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    socialLinks: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    }
  };

  constructor() {
    // If we wanted persistence, we could use localStorage here
    const saved = localStorage.getItem('rim_acedemy_courses');
    if (saved) {
      this.courses = JSON.parse(saved);
    }
    const savedProfile = localStorage.getItem('rim_acedemy_teacher_profile');
    if (savedProfile) {
      this.teacherProfile = JSON.parse(savedProfile);
    }
  }

  private save() {
    localStorage.setItem('rim_acedemy_courses', JSON.stringify(this.courses));
  }

  private saveProfile() {
    localStorage.setItem('rim_acedemy_teacher_profile', JSON.stringify(this.teacherProfile));
  }

  getCourses() {
    return this.courses;
  }

  addCourse(course: any) {
    const newCourse = {
      ...course,
      id: `course-${Date.now()}`,
      studentCount: 0,
      rating: 0,
      lessonCount: 0,
      lessons: [],
      tests: [],
      learningPoints: [],
      includes: [
        'Ömürlük giriş imkanı',
        'Tamamlama sertifikatı',
        '7/24 Dəstək xidməti'
      ],
      lastUpdated: new Date().toLocaleDateString('az-AZ')
    };
    this.courses = [newCourse, ...this.courses];
    this.save();
    return newCourse;
  }

  updateCourse(courseId: string, data: any) {
    const index = this.courses.findIndex(c => c.id === courseId);
    if (index !== -1) {
      this.courses[index] = { 
        ...this.courses[index], 
        ...data,
        lastUpdated: new Date().toLocaleDateString('az-AZ')
      };
      this.save();
      return true;
    }
    return false;
  }

  deleteCourse(courseId: string) {
    this.courses = this.courses.filter(c => c.id !== courseId);
    this.save();
  }

  getTeacherCourses(teacherId: string) {
    // For now, since it's a mock, we'll just return first 4 as 'teacher' courses + new ones
    return this.courses.filter(c => c.teacherId === teacherId || c.id.startsWith('course-'));
  }

  addLessonToCourse(courseId: string, lessonTitle?: string) {
    const course = this.courses.find(c => c.id === courseId);
    if (course) {
      if (!course.lessons) course.lessons = [];
      const newLesson = {
        id: Date.now(),
        title: lessonTitle || `Yeni Video Dərs #${course.lessons.length + 1}`,
        duration: '10:00',
        description: '',
        thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80'
      };
      course.lessons.unshift(newLesson);
      course.lessonCount = course.lessons.length;
      this.save();
      return newLesson;
    }
  }

  getLessons(courseId: string) {
    const course = this.courses.find(c => c.id === courseId);
    return course?.lessons || [];
  }

  deleteLesson(courseId: string, lessonId: number) {
    const course = this.courses.find(c => c.id === courseId);
    if (course && course.lessons) {
      course.lessons = course.lessons.filter((l: any) => l.id !== lessonId);
      course.lessonCount = course.lessons.length;
      this.save();
    }
  }

  updateLesson(courseId: string, lessonId: number, data: any) {
    const course = this.courses.find(c => c.id === courseId);
    if (course && course.lessons) {
      const lesson = course.lessons.find((l: any) => l.id === lessonId);
      if (lesson) {
        Object.assign(lesson, data);
        this.save();
      }
    }
  }

  getTests(courseId: string) {
    const course = this.courses.find(c => c.id === courseId);
    return course?.tests || [];
  }

  addTestToCourse(courseId: string, test: any) {
    const course = this.courses.find(c => c.id === courseId);
    if (course) {
      if (!course.tests) course.tests = [];
      const newTest = {
        ...test,
        id: `test-${Date.now()}`
      };
      course.tests.push(newTest);
      this.save();
      return newTest;
    }
  }

  getTestById(testId: string) {
    for (const course of this.courses) {
      const test = (course.tests || []).find((t: any) => t.id === testId);
      if (test) return test;
    }
    return null;
  }

  getProfile() {
    return this.teacherProfile;
  }

  updateProfile(data: any) {
    this.teacherProfile = { ...this.teacherProfile, ...data };
    this.saveProfile();
    return true;
  }
}

export const mockDb = new MockDB();
