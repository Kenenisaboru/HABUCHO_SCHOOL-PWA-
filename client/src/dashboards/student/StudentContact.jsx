/**
 * Student Contact — Send message to administration
 */
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import { submitContact } from "../../services/authService";

const studentLinks = [
  { to: "/student", label: "Dashboard", icon: "📊", end: true },
  { to: "/student/grades", label: "My Grades", icon: "📝" },
  { to: "/student/schedule", label: "Schedule", icon: "📅" },
  { to: "/student/announcements", label: "Announcements", icon: "📢" },
  { to: "/student/contact", label: "Contact", icon: "✉️" },
  { to: "/student/profile", label: "Profile", icon: "👤" },
];

const StudentContact = () => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await submitContact(data);
      toast.success("Message sent to administration!");
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send");
    }
  };

  return (
    <DashboardLayout links={studentLinks} title="Contact Administration">
      <div className="mx-auto max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
          <p className="text-sm text-gray-500">Send a message directly to the school administration.</p>
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input className="input-field" {...register("name", { required: true })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input type="email" className="input-field" {...register("email", { required: true })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Message</label>
            <textarea rows={5} className="input-field" {...register("message", { required: true })} />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-emerald w-full">
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default StudentContact;
