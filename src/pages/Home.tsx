import Hero from '@/components/student/Hero';
import Features from '@/components/student/Features';
import Stats from '@/components/student/Stats';
import Courses from '@/components/student/Courses';
import Teachers from '@/components/student/Teachers';
import Testimonials from '@/components/student/Testimonials';
import Contact from '@/components/student/Contact';

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <Features />
      <Stats />
      <Courses />
      <Teachers />
      <Testimonials />
      <Contact />
    </main>
  );
}
