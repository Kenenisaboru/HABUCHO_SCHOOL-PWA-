/**
 * Contact Page — Contact form for students and visitors
 */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";
import { submitContact } from "../services/authService";

const contactItems = [
  { icon: "📍", title: "Address", value: "Arsi Aseko Town, Oromia Region, Ethiopia" },
  { icon: "📞", title: "Phone", value: "+251 911 000 000" },
  { icon: "✉️", title: "Email", value: "info@habucho.edu.et" },
  { icon: "🕐", title: "Office Hours", value: "Mon – Fri, 8:00 AM – 4:00 PM" },
];

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    document.title = "Contact Us — Habucho Preparatory School";
  }, []);

  const onSubmit = async (data) => {
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
      <header className="relative isolate overflow-hidden border-b border-emerald-500/10 bg-slate-950 px-4 py-12 text-white sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(ellipse_at_right,rgba(16,185,129,0.16),transparent_70%)]"
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
              Get in touch
            </p>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              How can we help?
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-300">
              Contact the Habucho school team with questions about admissions,
              school life, or student support.
            </p>
          </div>
          <a href="#contact-form" className="btn-primary shrink-0">
            Send us a message
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Contact Info */}
          <div className="space-y-4 lg:col-span-2">
            <span className="section-label">Info</span>
            <h2 className="section-title mt-2 mb-6 text-2xl">How to Reach Us</h2>
            {contactItems.map((item) => (
              <div key={item.title} className="card flex items-start gap-4 p-5!">
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
          <form id="contact-form" onSubmit={handleSubmit(onSubmit)} className="card scroll-mt-24 space-y-5 lg:col-span-3">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Send a Message</h2>
              <p className="mt-1 text-sm text-slate-500">We'll get back to you as soon as possible.</p>
            </div>

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

            <button type="submit" disabled={isSubmitting} className="btn-emerald w-full py-3">
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;
