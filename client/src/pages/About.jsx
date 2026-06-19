/**
 * About Page — School history, mission, vision, core values
 */
import MainLayout from "../layouts/MainLayout";

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
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-emerald-500 px-4 py-16 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold">About Habucho Preparatory School</h1>
          <p className="mt-4 text-lg text-blue-100">Excellence in Education Since 1995</p>
        </div>
      </section>

      {/* History */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Our History</h2>
          <p className="leading-relaxed text-gray-600 dark:text-gray-400">
            Habucho Preparatory School was established in 1995 with a vision to provide
            quality secondary education to students in the Habucho region and beyond.
            Over the past 25+ years, we have grown from a small institution to one of
            the most respected preparatory schools in the area, consistently producing
            top performers in national examinations.
          </p>
          <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-400">
            Our school serves Grade 11 and Grade 12 students, offering a comprehensive
            curriculum that includes Natural Science, Social Science, and other specialized
            tracks designed to prepare students for university and professional careers.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 px-4 py-16 dark:bg-gray-800/50">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
          <div className="card border-l-4 border-blue-600">
            <h2 className="mb-4 text-2xl font-bold text-blue-600">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400">
              To provide accessible, high-quality preparatory education that empowers
              students with knowledge, critical thinking skills, and moral values,
              enabling them to become responsible citizens and future leaders.
            </p>
          </div>
          <div className="card border-l-4 border-emerald-500">
            <h2 className="mb-4 text-2xl font-bold text-emerald-600">Our Vision</h2>
            <p className="text-gray-600 dark:text-gray-400">
              To be the leading preparatory school in the region, recognized for
              academic excellence, innovative teaching, and producing graduates who
              excel in higher education and contribute positively to society.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-800 dark:text-white">
            Core Values
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="card text-center">
                <div className="mb-3 text-3xl">{v.icon}</div>
                <h3 className="mb-2 font-semibold text-gray-800 dark:text-white">{v.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
