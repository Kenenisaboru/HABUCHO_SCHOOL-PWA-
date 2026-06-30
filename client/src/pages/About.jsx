/**
 * About Page — School history, mission, vision, core values
 */
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";

const About = () => {
  const values = [
    { title: "Excellence", desc: "Striving for the highest standards in all we do", icon: "⭐" },
    { title: "Integrity", desc: "Honesty and ethical behavior in every action", icon: "🤝" },
    { title: "Innovation", desc: "Embracing new ideas and modern teaching methods", icon: "💡" },
    { title: "Community", desc: "Building strong relationships among all stakeholders", icon: "🏫" },
    { title: "Respect", desc: "Valuing diversity and treating everyone with dignity", icon: "🙏" },
    { title: "Perseverance", desc: "Encouraging resilience and continuous improvement", icon: "💪" },
  ];

  return (
    <MainLayout>
      <PageHeader
        badge="Our Story"
        title="About Habucho Preparatory School"
        subtitle="Excellence in Education Since 1995"
      />

      {/* History */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <span className="section-label">History</span>
          <h2 className="section-title mt-2 mb-6">Our History</h2>
          <div className="space-y-4 leading-relaxed text-slate-600 dark:text-slate-400">
            <p>
              Habucho Preparatory School was established in 1995 with a vision to provide
              quality secondary education to students in the Habucho region and beyond.
              Over the past 25+ years, we have grown from a small institution to one of
              the most respected preparatory schools in the area, consistently producing
              top performers in national examinations.
            </p>
            <p>
              Our school serves Grade 11 and Grade 12 students, offering a comprehensive
              curriculum that includes Natural Science, Social Science, and other specialized
              tracks designed to prepare students for university and professional careers.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-slate-100/80 px-4 py-16 dark:bg-slate-900/50 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
          <div className="card card-hover border-l-4 border-l-emerald-500">
            <h2 className="mb-4 font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">Our Mission</h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              To provide accessible, high-quality preparatory education that empowers
              students with knowledge, critical thinking skills, and moral values,
              enabling them to become responsible citizens and future leaders.
            </p>
          </div>
          <div className="card card-hover border-l-4 border-l-teal-500">
            <h2 className="mb-4 font-display text-2xl font-bold text-teal-600 dark:text-teal-400">Our Vision</h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              To be the leading preparatory school in the region, recognized for
              academic excellence, innovative teaching, and producing graduates who
              excel in higher education and contribute positively to society.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="section-label">Values</span>
            <h2 className="section-title mt-2">Core Values</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="group card card-hover text-center">
                <div className="feature-icon">{v.icon}</div>
                <h3 className="mb-2 font-display font-semibold text-slate-900 dark:text-white">{v.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
