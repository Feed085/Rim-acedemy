const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const buildUrl = (path: string) => `${API_BASE_URL}${path}`;

async function requestJson(path: string, init: RequestInit = {}) {
  const response = await fetch(buildUrl(path), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {})
    }
  });

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof body === 'object' && body && 'message' in body
      ? String((body as { message?: string }).message || 'İstek başarısız')
      : 'İstek başarısız';

    throw new Error(message);
  }

  return body;
}

export const adminApi = {
  getDashboard: () => requestJson('/admin/dashboard'),
  getTeachers: () => requestJson('/admin/teachers'),
  createTeacher: (payload: Record<string, unknown>) => requestJson('/teacher/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  updateTeacher: (teacherId: string, payload: Record<string, unknown>) => requestJson(`/admin/teachers/${teacherId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  }),
  deleteTeacher: (teacherId: string) => requestJson(`/admin/teachers/${teacherId}`, {
    method: 'DELETE'
  }),
  getStudents: () => requestJson('/admin/students'),
  assignStudentItem: (studentId: string, payload: Record<string, unknown>) => requestJson(`/admin/students/${studentId}/assignments`, {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getCourses: () => requestJson('/admin/courses'),
  getTests: () => requestJson('/admin/tests'),
  getCategories: () => requestJson('/admin/categories'),
  createCategory: (payload: Record<string, unknown>) => requestJson('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  deleteCategory: (categoryId: string) => requestJson(`/admin/categories/${categoryId}`, {
    method: 'DELETE'
  })
};

export type DashboardResponse = Awaited<ReturnType<typeof adminApi.getDashboard>>;
export type TeachersResponse = Awaited<ReturnType<typeof adminApi.getTeachers>>;
export type StudentsResponse = Awaited<ReturnType<typeof adminApi.getStudents>>;
export type CoursesResponse = Awaited<ReturnType<typeof adminApi.getCourses>>;
export type TestsResponse = Awaited<ReturnType<typeof adminApi.getTests>>;
export type CategoriesResponse = Awaited<ReturnType<typeof adminApi.getCategories>>;