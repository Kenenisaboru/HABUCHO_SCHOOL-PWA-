/**
 * Home Page — Landing page with hero, features, stats, testimonials, CTA
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import useFetch from "../hooks/useFetch";
import { getPublicStats } from "../services/publicService";

const Home = () => {
  const { data: statsData } = useFetch(getPublicStats, []);
  
  const heroImages = [
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600",
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600",
    "https://images.unsplash.com/photo-1627556704302-624286467c65?w=1600",
  ];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  const features = [
    { icon: "📚", title: "Quality Education", desc: "Comprehensive curriculum for Grades 11-12" },
    { icon: "👨‍🏫", title: "Expert Teachers", desc: "Dedicated and experienced faculty members" },
    { icon: "📊", title: "Grade Tracking", desc: "Real-time academic performance monitoring" },
    { icon: "📅", title: "Smart Scheduling", desc: "Organized timetables and class management" },
    { icon: "📢", title: "Announcements", desc: "Stay updated with school news and events" },
    { icon: "🔒", title: "Secure Portal", desc: "Role-based access for students and staff" },
  ];

  const defaultStats = [
    { value: "500+", label: "Students" },
    { value: "30+", label: "Teachers" },
    { value: "95%", label: "Pass Rate" },
    { value: "25+", label: "Years" },
  ];

  const stats = statsData ? [
    { value: statsData.students, label: "Students" },
    { value: statsData.teachers, label: "Teachers" },
    { value: statsData.passRate, label: "Pass Rate" },
    { value: statsData.years, label: "Years" },
  ] : defaultStats;

  const testimonials = [
    { name: "Abebe Kebede", role: "Parent", text: "Habucho School transformed my child's academic journey. The teachers are exceptional." },
    { name: "Sara Tadesse", role: "Alumni", text: "The foundation I received here prepared me for university and beyond." },
    { name: "Dr. Hailu", role: "Teacher", text: "A wonderful environment for both teaching and learning. Proud to be part of this community." },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 text-white">
        {/* Background Images Carousel */}
        <div className="absolute inset-0 z-0 bg-slate-950">
          {heroImages.map((src, index) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? "opacity-100 z-0" : "opacity-0 -z-10"
              }`}
            >
              <img
                src={src}
                alt={`Habucho School Background ${index + 1}`}
                className={`h-full w-full object-cover transition-transform duration-[6000ms] ease-out ${
                  index === currentImageIndex ? "scale-105" : "scale-100"
                }`}
              />
            </div>
          ))}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-teal-700/60 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-teal-700/30"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <h1 className="mb-6 animate-slide-up text-5xl font-extrabold text-white md:text-7xl">
            Welcome to Habucho Preparatory School
          </h1>
          <p className="mx-auto mb-8 max-w-2xl animate-fade-in text-lg text-blue-100 opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards]">
            Empowering the next generation through excellence in education,
            character building, and holistic development for Grades 11–12.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards]">
            <Link
              to="/login"
              className="rounded-xl bg-white px-8 py-4 font-bold text-blue-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              Student Portal
            </Link>
            <Link
              to="/about"
              className="rounded-xl border-2 border-white px-8 py-4 font-bold text-white transition-all hover:bg-white hover:text-blue-700"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-800 dark:text-white">About Our School</h2>
          <p className="mx-auto max-w-3xl text-gray-600 dark:text-gray-400">
            Founded in 1995, Habucho Preparatory School has been a beacon of educational
            excellence in the region. We prepare students for national exams and university
            admission with a focus on academic rigor and personal growth.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 px-4 py-16 dark:bg-gray-800/50">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-800 dark:text-white">
            Why Choose Habucho?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="card text-center">
                <div className="mb-4 text-4xl">{f.icon}</div>
                <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-blue-600 px-4 py-16 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-bold">{s.value}</p>
              <p className="mt-2 text-blue-200">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-800 dark:text-white">
            What People Say
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="card">
                <p className="mb-4 italic text-gray-600 dark:text-gray-400">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-emerald-600">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-emerald-500 to-blue-600 px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mb-8 text-emerald-100">
            Join our community of learners and educators. Access your dashboard today.
          </p>
          <Link to="/login" className="inline-block rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition hover:bg-blue-50">
            Login to Portal
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
