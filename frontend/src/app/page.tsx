'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import CourseCard from '@/components/CourseCard';

function CountUpNumber({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted.current) {
        counted.current = true;
        let start = 0;
        const duration = 2000;
        const step = (timestamp: number) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          setCount(Math.floor(progress * end));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <div ref={ref} className="text-3xl md:text-4xl font-bold text-white">{count.toLocaleString('en-IN')}{suffix}</div>;
}

const featuredCourses = [
  { id: '1', title: 'BPSC Complete Course — 67th BPSC Special', thumbnail: '', price: 2999, category: 'BPSC', instructor: 'Dr. Rakesh Kumar', language: 'Hindi', lectureCount: 120, enrollmentCount: 2340 },
  { id: '2', title: 'UPSC Prelims + Mains — Complete Foundation', thumbnail: '', price: 4999, category: 'UPSC', instructor: 'Prof. Anita Singh', language: 'Hindi', lectureCount: 200, enrollmentCount: 1850 },
  { id: '3', title: 'SSC CGL 2025 — Complete Preparation', thumbnail: '', price: 1999, category: 'SSC', instructor: 'Amit Sharma', language: 'Hindi', lectureCount: 85, enrollmentCount: 3100 },
  { id: '4', title: 'Railway NTPC + Group D — Full Course', thumbnail: '', price: 1499, category: 'RAILWAY', instructor: 'Vijay Prakash', language: 'Hindi', lectureCount: 65, enrollmentCount: 4200 },
];

const examCategories = [
  { name: 'BPSC', icon: '🏛️', description: 'Bihar Public Service Commission', color: 'from-green-500 to-emerald-600' },
  { name: 'UPSC', icon: '🇮🇳', description: 'Union Public Service Commission', color: 'from-blue-500 to-blue-700' },
  { name: 'SSC', icon: '📋', description: 'Staff Selection Commission', color: 'from-purple-500 to-purple-700' },
  { name: 'RAILWAY', icon: '🚂', description: 'Railway Recruitment Board', color: 'from-red-500 to-red-700' },
  { name: 'BANKING', icon: '🏦', description: 'Bank PO, Clerk & SO', color: 'from-amber-500 to-orange-600' },
];

const testimonials = [
  { name: 'Rahul Kumar', exam: 'BPSC 2024', image: '', quote: 'Gyan Sammaan के video lectures और test series के कारण मैंने BPSC crack किया। बहुत ही systematic approach है।' },
  { name: 'Priya Sharma', exam: 'SSC CGL 2024', image: '', quote: 'Faculty बहुत experienced हैं। Doubt clearing sessions बहुत helpful थे। Thank you Gyan Sammaan! 🙏' },
  { name: 'Amit Singh', exam: 'UPSC Prelims 2024', image: '', quote: 'पहली बार में UPSC Prelims clear किया। Current affairs और mock tests बहुत अच्छे हैं।' },
];

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-700 via-green-800 to-blue-800 py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full text-green-200 text-sm font-medium mb-6 animate-fade-in">
              🎓 India&apos;s Trusted Coaching Platform
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight animate-fade-in">
              <span className="bg-gradient-to-r from-green-300 via-white to-blue-300 bg-clip-text text-transparent">
                BPSC | UPSC | Govt. Exam
              </span>
              <br />
              <span className="text-white">Preparation</span>
            </h1>
            <p className="text-lg md:text-xl text-green-100 mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              ज्ञान सम्मान — <span className="font-semibold text-amber-300">ज्ञान से सफलता तक</span>
            </p>
            <p className="text-base text-green-200/80 mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Join thousands of successful students preparing for competitive exams with expert faculty, comprehensive courses, and proven study material.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link href="/courses" className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
                Explore Courses →
              </Link>
              <Link href="/register" className="px-8 py-3.5 bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white text-lg font-bold rounded-xl transition-all">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gradient-to-r from-green-600 to-blue-700 py-8 -mt-1">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { end: 15000, suffix: '+', label: 'Students Enrolled' },
            { end: 50, suffix: '+', label: 'Expert Courses' },
            { end: 5000, suffix: '+', label: 'Success Stories' },
            { end: 200, suffix: '+', label: 'Video Lectures' },
          ].map((stat) => (
            <div key={stat.label} className="animate-count-up">
              <CountUpNumber end={stat.end} suffix={stat.suffix} />
              <p className="text-green-100 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-gradient-to-b from-[#F0FAF4] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Featured <span className="gradient-text">Courses</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">Top-rated courses by expert faculty to help you crack your dream exam</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/courses" className="inline-block px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all">
              View All Courses →
            </Link>
          </div>
        </div>
      </section>

      {/* Exam Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Exam <span className="gradient-text">Categories</span>
            </h2>
            <p className="text-gray-500">Choose your target exam and start preparing today</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {examCategories.map((exam) => (
              <Link key={exam.name} href={`/courses?category=${exam.name}`}
                className="card-hover group bg-white border-2 border-gray-100 rounded-2xl p-6 text-center hover:border-green-300">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${exam.color} flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform shadow-md`}>
                  {exam.icon}
                </div>
                <h3 className="font-bold text-gray-800 text-lg">{exam.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{exam.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-b from-[#F0FAF4] to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Student <span className="gradient-text">Success Stories</span>
            </h2>
            <p className="text-gray-500">Hear from our students who cracked their dream exams</p>
          </div>
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-green-100">
              <div className="text-5xl text-green-300 mb-4">&ldquo;</div>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed min-h-[80px]">
                {testimonials[currentTestimonial].quote}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonials[currentTestimonial].name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{testimonials[currentTestimonial].name}</h4>
                  <p className="text-sm text-green-600 font-medium">{testimonials[currentTestimonial].exam} ✅</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrentTestimonial(i)}
                  className={`w-3 h-3 rounded-full transition-all ${i === currentTestimonial ? 'bg-green-600 w-8' : 'bg-gray-300'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-8 md:p-12 border border-red-200">
            <div className="text-5xl mb-4">📺</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Free Video Lectures on YouTube</h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Watch free lectures, current affairs, and exam tips on our YouTube channel. Subscribe for daily updates!
            </p>
            <a href="https://www.youtube.com/@gyansammaan" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              Subscribe to Our Channel
            </a>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-green-700 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Preparation?
          </h2>
          <p className="text-green-100 text-lg mb-8">
            Join 15,000+ students who are already preparing with Gyan Sammaan
          </p>
          <Link href="/register" className="inline-block px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
            Get Started for Free →
          </Link>
        </div>
      </section>
    </div>
  );
}
