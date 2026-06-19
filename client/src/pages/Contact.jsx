/**
 * Contact Page — Contact form for students and visitors
 */
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";
import { submitContact } from "../services/authService";
import useAuthStore from "../context/authStore";

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
      <section className="bg-gradient-to-r from-blue-600 to-emerald-500 px-4 py-12 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="mt-2 text-blue-100">Get in touch with the school administration</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="mb-2 font-semibold">📍 Address</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Habucho Town, Oromia Region, Ethiopia</p>
            </div>
            <div className="card">
              <h3 className="mb-2 font-semibold">📞 Phone</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">+251 911 000 000</p>
            </div>
            <div className="card">
              <h3 className="mb-2 font-semibold">✉️ Email</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">info@habucho.edu</p>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
            <h2 className="text-lg font-semibold">Send a Message</h2>

            {!token && (
              <p className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                Please login to submit a message.
              </p>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <input
                className="input-field"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="email"
                className="input-field"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Message</label>
              <textarea
                rows={4}
                className="input-field"
                {...register("message", { required: "Message is required" })}
              />
              {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting || !token} className="btn-emerald w-full">
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;
