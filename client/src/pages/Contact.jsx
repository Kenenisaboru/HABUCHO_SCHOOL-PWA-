/**
 * Contact Page — Premium contact form with bug fix (useForm import),
 * SVG contact info cards, and map placeholder
 */
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import { submitContact } from "../services/authService";
import useAuthStore from "../context/authStore";

const contactItems = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Address",
    value: "Arsi Aseko Town, Oromia Region, Ethiopia",
    color: "from-emerald-400/20 to-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    title: "Phone",
    value: "+251 911 000 000",
    color: "from-blue-400/20 to-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Email",
    value: "info@habucho.edu",
    color: "from-violet-400/20 to-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Office Hours",
    value: "Mon – Fri, 8:00 AM – 4:00 PM",
    color: "from-amber-400/20 to-amber-500/10 text-amber-600 dark:text-amber-400",
  },
];

const Contact = () => {
  const token = useAuthStore((s) => s.token);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    if (!token) {
      toast.error("Please login to send a message");
      return;
    }
    try {
      await submitContact(data);
      toast.success("Message sent successfully! We'll get back to you soon.");
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message. Please try again.");
    }
  };

  return (
    <MainLayout>
      <PageHeader
        badge="Get in Touch"
        title="Contact Us"
        subtitle="Reach out to the school administration — we're always here to help you"
      />

      <section className="mx-auto max-w-6xl px-4 py-20 md:py-24">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* ── Contact Info ──────────────────────────────── */}
          <div className="space-y-4 lg:col-span-2">
            <span className="section-label">Info</span>
            <h2 className="section-title mt-2 mb-6 text-2xl">How to Reach Us</h2>

            {contactItems.map((item) => (
              <div
                key={item.title}
                className="group card card-hover flex items-start gap-4 !p-5 overflow-hidden relative"
              >
                <div className={`absolute inset-0 bg-linear-to-br ${item.color.split(" text-")[0]} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50">
                  <span className={item.color.split(" ")[2] + " " + item.color.split(" ")[3]}>{item.icon}</span>
                </div>
                <div className="relative">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{item.value}</p>
                </div>
              </div>
            ))}

            {/* Map placeholder */}
            <div className="card overflow-hidden p-0! mt-2">
              <div
                className="relative flex h-44 items-center justify-center"
                style={{ background: "linear-gradient(135deg, #064e3b, #065f46, #0f172a)" }}
              >
                <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(52,211,153,0.15) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                <div className="relative text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-white">Arsi Aseko, Oromia</p>
                  <p className="text-xs text-emerald-300/70">Ethiopia</p>
                </div>
              </div>
              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs text-slate-400 text-center">📍 Habucho Preparatory School Campus</p>
              </div>
            </div>
          </div>

          {/* ── Contact Form ──────────────────────────────── */}
          <form onSubmit={handleSubmit(onSubmit)} className="card card-gradient-border space-y-5 lg:col-span-3">
            <div className="border-b border-slate-100 pb-5 dark:border-slate-800">
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Send a Message</h2>
              <p className="mt-1 text-sm text-slate-500">We&apos;ll get back to you within 24 hours.</p>
            </div>

            {!token && (
              <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/40 dark:bg-amber-950/20">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  Please{" "}
                  <Link to="/login" className="font-bold underline underline-offset-2 hover:text-amber-900">
                    login
                  </Link>{" "}
                  to submit a message to the administration.
                </p>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <input
                  className="input-field"
                  placeholder="Abebe Kebede"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Subject
              </label>
              <input
                className="input-field"
                placeholder="What is this regarding?"
                {...register("subject")}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Message
              </label>
              <textarea
                rows={5}
                className="input-field resize-none"
                placeholder="Write your message here..."
                {...register("message", { required: "Message is required" })}
              />
              {errors.message && <p className="mt-1.5 text-xs text-red-500">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !token}
              className="btn-emerald w-full py-3.5 text-base gap-2"
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send Message
                </>
              )}
            </button>

            {!token && (
              <p className="text-center text-xs text-slate-400">
                You must be logged in to send messages to the administration.
              </p>
            )}
          </form>
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;
