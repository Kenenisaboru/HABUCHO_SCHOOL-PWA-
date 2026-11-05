import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Images,
  UploadCloud,
  Trash2,
  Plus,
  X,
  Eye,
  Sparkles,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatCard from "../../components/StatCard";
import {
  getGalleryImages,
  createGalleryImage,
  deleteGalleryImage,
} from "../../services/galleryService";

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await getGalleryImages();
      setImages(res.data?.data || res.data || []);
    } catch {
      toast.error("Failed to load gallery images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const onSubmit = async (data) => {
    if (!data.image || !data.image[0]) {
      toast.error("Please select an image file to upload");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title || "Campus Life");
      formData.append("caption", data.caption || "");
      formData.append("display_order", data.display_order || 0);
      formData.append("image", data.image[0]);

      await createGalleryImage(formData);
      toast.success("Image uploaded to gallery!");
      reset();
      setShowModal(false);
      fetchImages();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload image");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this image from the gallery?")) return;
    try {
      await deleteGalleryImage(id);
      toast.success("Image removed");
      fetchImages();
    } catch {
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Photo Gallery CMS
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Upload and curate high-resolution photos showcasing campus facilities and student life.
          </p>
        </div>
        <button
          onClick={() => {
            reset();
            setShowModal(true);
          }}
          className="btn-primary text-xs px-4 py-2 gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Upload Photo</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Images}
          label="Gallery Images"
          value={images.length}
          color="blue"
        />
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : images.length === 0 ? (
        <div className="card text-center py-16 border-dashed border-2">
          <UploadCloud className="mx-auto h-12 w-12 text-slate-400 mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No gallery images uploaded yet
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Click &quot;Upload Photo&quot; to publish your first campus photographs to the public website.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {images.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all hover:shadow-lg"
            >
              <div className="aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={item.image_path}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-xs text-slate-900 dark:text-white line-clamp-1">
                      {item.title}
                    </h3>
                    {item.caption && (
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {item.caption}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                    title="Delete image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="card max-w-md w-full p-6 bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                Upload Campus Photograph
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Photo Title *
                </label>
                <input
                  type="text"
                  {...register("title", { required: true })}
                  placeholder="e.g. Science Fair Exhibition"
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  {...register("caption")}
                  placeholder="Short context about the scene..."
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Image File (JPG, PNG, WebP) *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("image", { required: true })}
                  className="input-field text-xs file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[11px] file:bg-blue-50 file:text-primary dark:file:bg-blue-950 dark:file:text-blue-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  defaultValue={0}
                  {...register("display_order")}
                  className="input-field text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-outline px-4 py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-5 py-2 text-xs"
                >
                  {submitting ? "Uploading..." : "Upload Photo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
