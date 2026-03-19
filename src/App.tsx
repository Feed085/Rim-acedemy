import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import StudentDashboard from '@/pages/StudentDashboard';
import TeacherDashboard from '@/pages/TeacherDashboard';
import TeacherProfile from '@/pages/TeacherProfile';
import UploadVideo from '@/pages/UploadVideo';
import CreateTest from '@/pages/CreateTest';
import Courses from '@/pages/Courses';
import CourseDetail from '@/pages/CourseDetail';
import Teachers from '@/pages/Teachers';
import TeacherDetail from '@/pages/TeacherDetail';
import Tests from '@/pages/Tests';
import TestDetail from '@/pages/TestDetail';
import Contact from '@/components/student/Contact';

import './i18n';

// Protected Route Component
function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles?: ('student' | 'teacher' | 'admin')[];
}) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Layout with Navbar and Footer
function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

// Simple Layout without Footer (for auth pages)
function SimpleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        } 
      />
      <Route 
        path="/courses" 
        element={
          <MainLayout>
            <Courses />
          </MainLayout>
        } 
      />
      <Route 
        path="/courses/:id" 
        element={
          <MainLayout>
            <CourseDetail />
          </MainLayout>
        } 
      />
      <Route 
        path="/teachers" 
        element={
          <MainLayout>
            <Teachers />
          </MainLayout>
        } 
      />
      <Route 
        path="/teachers/:id" 
        element={
          <MainLayout>
            <TeacherDetail />
          </MainLayout>
        } 
      />
      <Route 
        path="/tests" 
        element={
          <MainLayout>
            <Tests />
          </MainLayout>
        } 
      />
      <Route 
        path="/tests/:id" 
        element={
          <MainLayout>
            <TestDetail />
          </MainLayout>
        } 
      />
      <Route 
        path="/contact" 
        element={
          <MainLayout>
            <Contact />
          </MainLayout>
        } 
      />

      {/* Auth Routes */}
      <Route 
        path="/login" 
        element={
          <SimpleLayout>
            <Login />
          </SimpleLayout>
        } 
      />
      <Route 
        path="/register" 
        element={
          <SimpleLayout>
            <Register />
          </SimpleLayout>
        } 
      />

      {/* Student Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <MainLayout>
              <StudentDashboard />
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      {/* Teacher Routes */}
      <Route 
        path="/teacher/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <MainLayout>
              <TeacherDashboard />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teacher/profile" 
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <MainLayout>
              <TeacherProfile />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teacher/upload" 
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <MainLayout>
              <UploadVideo />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teacher/test/create" 
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <MainLayout>
              <CreateTest />
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#00D084]/30 border-t-[#00D084] rounded-full animate-spin" />
          </div>
        }>
          <AppRoutes />
        </Suspense>
        <Toaster 
          position="top-right" 
          richColors 
          closeButton
          toastOptions={{
            style: {
              fontFamily: 'Inter, sans-serif',
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
