import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  GraduationCap,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  UploadCloud,
  Copy,
  Check,
  Calendar,
  Sparkles,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Home,
  School,
  XCircle,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import { submitAdmission, checkAdmissionStatus } from "../services/publicService";

const Admissions = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);
  const [copied, setCopied] = useState(false);

  // Status Lookup state
  const [lookupRef, setLookupRef] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key !== "documents") {
          formData.append(key, data[key]);
        }
      });

      if (data.documents && data.documents.length > 0) {
        for (let i = 0; i < data.documents.length; i++) {
          formData.append("documents", data.documents[i]);
        }
      }

      const res = await submitAdmission(formData);
      const refCode = res.data?.data?.referenceNumber || "HAB-" + new Date().getFullYear() + "-SUBMITTED";
      setSubmittedRef(refCode);
      toast.success("Application submitted successfully!");
      reset();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit application. Please check your inputs.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!lookupRef.trim()) {
      toast.error("Please enter a valid reference code");
      return;
    }

    setLookupLoading(true);
    setLookupError("");
    setLookupResult(null);

    try {
      const res = await checkAdmissionStatus(lookupRef.trim());
      setLookupResult(res.data?.data || res.data);
    } catch (err) {
      const msg = err.response?.data?.message || "Application not found for that reference number.";
      setLookupError(msg);
    } finally {
      setLookupLoading(false);
    }
  };

  const copyRefToClipboard = () => {
    if (submittedRef) {
      navigator.clipboard.writeText(submittedRef);
      setCopied(true);
      toast.success("Reference code copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" /> Approved
          </span>
        );
      case "under_review":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            <Clock className="h-4 w-4" /> Under Review
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-600 dark:bg-red-500/20 dark:text-red-400">
            <XCircle className="h-4 w-4" /> Not Accepted
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-primary dark:bg-blue-500/20 dark:text-blue-400">
            <Clock className="h-4 w-4" /> Pending Review
          </span>
        );
    }
  };

  return (
    <MainLayout>
      <PageHeader
        badge="JOIN OUR COMMUNITY"
        title="Admissions & Application Portal"
        subtitle="Apply for Grade 11 or Grade 12 preparatory enrollment or track your ongoing application status with your personal reference code."
      />

      {/* Reference Tracker Bar */}
      <section className="relative -mt-10 z-20 mx-auto max-w-4xl px-4">
        <div className="card shadow-xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-6 dark:border-slate-800/90 dark:bg-slate-900/95">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Search className="h-4 w-4 text-primary dark:text-blue-400" />
                Track Submitted Application
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter your reference number (e.g. HAB-2026-A1B2C3) to check real-time status.
              </p>
            </div>

            <form onSubmit={handleLookup} className="flex w-full sm:w-auto items-center gap-2">
              <input
                type="text"
                placeholder="HAB-2026-XXXXXX"
                value={lookupRef}
                onChange={(e) => setLookupRef(e.target.value)}
                className="input-field text-xs py-2 w-full sm:w-48 uppercase tracking-wider font-mono"
              />
              <button
                type="submit"
                disabled={lookupLoading}
                className="btn-primary whitespace-nowrap text-xs px-4 py-2"
              >
                {lookupLoading ? "Checking..." : "Track Status"}
              </button>
            </form>
          </div>

          {/* Lookup Result Modal/Card */}
          {lookupResult && (
            <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800/80">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-primary dark:text-blue-400">
                      {lookupResult.referenceNumber}
                    </span>
                    {getStatusBadge(lookupResult.status)}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Applicant: <strong className="text-slate-900 dark:text-white">{lookupResult.applicantName}</strong>
                    {lookupResult.gradeLevel && ` • ${lookupResult.gradeLevel}`}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Submitted: {new Date(lookupResult.submittedAt || Date.now()).toLocaleDateString("en-US", { dateStyle: "medium" })}
                  </p>
                </div>
                <div className="text-xs text-right">
                  <span className="text-slate-500 block">Admissions Office Notice:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {lookupResult.status === "approved"
                      ? "Congratulations! Please check your email for enrollment instructions."
                      : lookupResult.status === "rejected"
                      ? "Unfortunately your application was not accepted for this term."
                      : "Your application is undergoing evaluation by the academic board."}
                  </span>
                </div>
              </div>
            </div>
          )}

          {lookupError && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{lookupError}</span>
            </div>
          )}
        </div>
      </section>

      {/* Submission Success Dialog */}
      {submittedRef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card max-w-md w-full p-8 text-center bg-white dark:bg-slate-900 shadow-2xl border border-blue-500/30">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 mb-4">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              Application Received!
            </h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Your application has been logged into the admissions ledger. Please write down or copy your unique tracking reference code:
            </p>

            <div className="my-6 flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50/80 p-3.5 dark:border-blue-900/50 dark:bg-blue-950/40">
              <span className="font-mono text-base font-extrabold tracking-widest text-primary dark:text-blue-400">
                {submittedRef}
              </span>
              <button
                onClick={copyRefToClipboard}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-white hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                title="Copy reference code"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            <button
              onClick={() => setSubmittedRef(null)}
              className="btn-primary w-full py-2.5 text-xs font-semibold"
            >
              Done & Return to Portal
            </button>
          </div>
        </div>
      )}

      {/* Main Form & Criteria Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Left Column: Requirements & Steps */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="section-label">ADMISSIONS PROCEDURE</span>
                <h2 className="section-title text-2xl sm:text-3xl">How to Apply</h2>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Admission to Habucho Preparatory School is competitive and based on academic achievement, character evaluation, and interview readiness.
                </p>
              </div>

              {/* Steps List */}
              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800/80 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Submit Online Application</h4>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Complete all personal, academic, and parent details on this portal, including uploading your Grade 10 transcript.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800/80 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Document Review & Screening</h4>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      The admissions committee verifies your prerequisite coursework and minimum grade thresholds (GPA ≥ 3.0).
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800/80 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Admission Confirmation & ID</h4>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Upon approval, receive your digital acceptance packet and student portal credentials to select class schedules.
                    </p>
                  </div>
                </div>
              </div>

              {/* Required Documents Card */}
              <div className="rounded-2xl border border-blue-200/60 bg-blue-50/50 p-6 dark:border-blue-900/40 dark:bg-blue-950/20">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary dark:text-blue-400 flex items-center gap-1.5 mb-3">
                  <ShieldCheck className="h-4 w-4" /> Checklist of Documents
                </h4>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-primary" /> Grade 10 Certificate or Official Transcript
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-primary" /> Copy of National ID or Birth Certificate
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-primary" /> 2 Recent Passport Size Photographs
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-primary" /> Letter of Conduct from Previous School
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Application Form */}
            <div className="lg:col-span-7">
              <div className="card shadow-md border border-slate-200/90 bg-white p-8 dark:border-slate-800/90 dark:bg-slate-900">
                <div className="border-b border-slate-100 pb-5 dark:border-slate-800/80 mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-500">2026/2027 In-Take</span>
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mt-1">
                    Student Enrollment Form
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Please provide accurate information. All fields marked with an asterisk (*) are mandatory.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Applicant Name & Email */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Applicant Full Name *
                      </label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          {...register("applicant_name", { required: "Applicant name is required" })}
                          placeholder="e.g. Samuel Kebede"
                          className="input-field pl-9 text-xs"
                        />
                      </div>
                      {errors.applicant_name && (
                        <p className="mt-1 text-[11px] text-red-500">{errors.applicant_name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          {...register("email", {
                            required: "Email is required",
                            pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                          })}
                          placeholder="student@example.com"
                          className="input-field pl-9 text-xs"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-[11px] text-red-500">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone & Date of Birth */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Applicant Phone *
                      </label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="tel"
                          {...register("phone", { required: "Phone number is required" })}
                          placeholder="+251 91 234 5678"
                          className="input-field pl-9 text-xs"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-[11px] text-red-500">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Date of Birth *
                      </label>
                      <div className="relative">
                        <Calendar className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="date"
                          {...register("date_of_birth", { required: "Date of birth is required" })}
                          className="input-field pl-9 text-xs"
                        />
                      </div>
                      {errors.date_of_birth && (
                        <p className="mt-1 text-[11px] text-red-500">{errors.date_of_birth.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Gender & Grade Level */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Gender *
                      </label>
                      <select
                        {...register("gender", { required: "Gender is required" })}
                        className="input-field text-xs"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.gender && (
                        <p className="mt-1 text-[11px] text-red-500">{errors.gender.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Grade Level Applying For *
                      </label>
                      <select
                        {...register("grade_level", { required: "Grade level is required" })}
                        className="input-field text-xs"
                      >
                        <option value="">Select Grade</option>
                        <option value="Grade 11">Grade 11 (Junior Year)</option>
                        <option value="Grade 12">Grade 12 (Senior / University Prep)</option>
                      </select>
                      {errors.grade_level && (
                        <p className="mt-1 text-[11px] text-red-500">{errors.grade_level.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Parent Details */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Parent / Guardian Name *
                      </label>
                      <input
                        type="text"
                        {...register("parent_name", { required: "Parent name is required" })}
                        placeholder="Parent / Guardian Name"
                        className="input-field text-xs"
                      />
                      {errors.parent_name && (
                        <p className="mt-1 text-[11px] text-red-500">{errors.parent_name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Parent Emergency Phone *
                      </label>
                      <input
                        type="tel"
                        {...register("parent_phone", { required: "Parent phone is required" })}
                        placeholder="+251 91 000 0000"
                        className="input-field text-xs"
                      />
                      {errors.parent_phone && (
                        <p className="mt-1 text-[11px] text-red-500">{errors.parent_phone.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Address & Previous School */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Residential Address
                      </label>
                      <input
                        type="text"
                        {...register("address")}
                        placeholder="City, Sub-city, Woreda"
                        className="input-field text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Previous School Attended *
                      </label>
                      <input
                        type="text"
                        {...register("previous_school", { required: "Previous school is required" })}
                        placeholder="Secondary School Name"
                        className="input-field text-xs"
                      />
                      {errors.previous_school && (
                        <p className="mt-1 text-[11px] text-red-500">{errors.previous_school.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Statement / Message */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Academic Interests & Aspirations
                    </label>
                    <textarea
                      rows={3}
                      {...register("message")}
                      placeholder="Briefly state your intended field of study (e.g. Medicine, Engineering, Law) and why you wish to join Habucho Prep..."
                      className="input-field text-xs"
                    />
                  </div>

                  {/* Supporting Documents Upload */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Supporting Documents (PDF or Images, max 5MB each)
                    </label>
                    <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-primary transition-colors dark:border-slate-800">
                      <UploadCloud className="mx-auto h-7 w-7 text-slate-400 mb-1" />
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Upload Grade 10 transcript or ID copies
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        {...register("documents")}
                        className="mt-2 text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 dark:file:bg-blue-950 dark:file:text-blue-300"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary w-full py-3 text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <span>Submitting Application...</span>
                      ) : (
                        <>
                          <GraduationCap className="h-4 w-4" />
                          <span>Submit Online Application</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Admissions;
