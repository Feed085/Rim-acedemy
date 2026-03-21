import { courses as initialCourses } from '@/data/mockData';

// This is a simple in-memory store for the current session
class MockDB {
  private courses = [...initialCourses].map(c => ({
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
      },
      { 
        id: 3, 
        title: 'Listening bölməsi - Strategiyalar', 
        duration: '20:10',
        description: 'Dinləmə bölməsində istifadə olunan ən vacib texnikalar.',
        thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80'
      },
    ],
    tests: [
      {
        id: 'test-1',
        title: 'Yekun İmtahan Testi',
        questions: [
          {
            id: 1,
            text: 'IELTS imtahanı neçə hissədən ibarətdir?',
            options: ['2', '3', '4', '5'],
            correctAnswer: '4'
          },
          {
            id: 2,
            text: 'Listening hissəsi üçün nə qədər vaxt verilir?',
            options: ['20 dəq', '30 dəq', '40 dəq', '60 dəq'],
            correctAnswer: '30 dəq'
          }
        ]
      }
    ]
  }));

  constructor() {
    // If we wanted persistence, we could use localStorage here
    const saved = localStorage.getItem('rim_acedemy_courses');
    if (saved) {
      this.courses = JSON.parse(saved);
    }
  }

  private save() {
    localStorage.setItem('rim_acedemy_courses', JSON.stringify(this.courses));
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
      tests: []
    };
    this.courses = [newCourse, ...this.courses];
    this.save();
    return newCourse;
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

  updateTest(testId: string, data: any) {
    for (const course of this.courses) {
      const tests = course.tests || [];
      const testIndex = tests.findIndex((t: any) => t.id === testId);
      if (testIndex !== -1) {
        tests[testIndex] = { ...tests[testIndex], ...data };
        this.save();
        return true;
      }
    }
    return false;
  }
}

export const mockDb = new MockDB();
