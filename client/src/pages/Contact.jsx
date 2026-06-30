/**
 * Contact Page — Contact form for students and visitors
 */
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import { submitContact } from "../services/authService";
import useAuthStore from "../context/authStore";

const contactItems = [
  { icon: "📍", title: "Address", value: "Arsi Aseko Town, Oromia Region, Ethiopia" },
  { icon: "📞", title: "Phone", value: "+251 911 000 000" },
  { icon: "✉️", title: "Email", value: "info@habucho.edu" },
  { icon: "🕐", title: "Office Hours", value: "Mon – Fri, 8:00 AM – 4:00 PM" },
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
      toast.success("Message sent successfully!");
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message");
    }
  };

  return (
    <MainLayout>
      <PageHeader
        badge="Get in Touch"
        title="Contact Us"
        subtitle="Reach out to the school administration — we're here to help"
      />

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Contact Info */}
          <div className="space-y-4 lg:col-span-2">
            <span className="section-label">Info</span>
            <h2 className="section-title mt-2 mb-6 text-2xl">How to Reach Us</h2>
            {contactItems.map((item) => (
              <div key={item.title} className="card flex items-start gap-4 !p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-lg dark:bg-emerald-500/20">
                  {item.icon}
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5 lg:col-span-3">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Send a Message</h2>
              <p className="mt-1 text-sm text-slate-500">We'll get back to you as soon as possible.</p>
            </div>

            {!token && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
                Please <Link to="/login" className="font-semibold underline">login</Link> to submit a message.
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
              <input className="input-field" {...register("name", { required: "Name is required" })} />
              {errors.name && <p className="mt-1.5 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <input type="email" className="input-field" {...register("email", { required: "Email is required" })} />
              {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
              <textarea rows={5} className="input-field resize-none" {...register("message", { required: "Message is required" })} />
              {errors.message && <p className="mt-1.5 text-sm text-red-500">{errors.message.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting || !token} className="btn-emerald w-full py-3">
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;
