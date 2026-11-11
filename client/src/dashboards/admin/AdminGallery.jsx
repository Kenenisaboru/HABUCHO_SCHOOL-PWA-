import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Images, UploadCloud, Trash2, Plus, X, Eye, Sparkles } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatCard from "../../components/StatCard";
import {
  getGalleryImages,
  createGalleryImage,
  deleteGalleryImage,
} from "../../services/galleryService";
import { getAssetUrl } from "../../services/api";

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
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Photo Gallery CMS
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Upload and curate high-resolution photos showcasing campus facilities and student life.
          </p>
        </div>
        <button
          onClick={() => {
            reset();
            setShowModal(true);
          }}
          className="btn-primary gap-1.5 px-4 py-2 text-xs shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Upload Photo</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={<Images />} title="Gallery Images" value={images.length} color="blue" />
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : images.length === 0 ? (
        <div className="card border-2 border-dashed py-16 text-center">
          <UploadCloud className="mx-auto mb-2 h-12 w-12 text-slate-400" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No gallery images uploaded yet
          </p>
          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-400">
            Click &quot;Upload Photo&quot; to publish your first campus photographs to the public
            website.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={getAssetUrl(item.image_path)}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="line-clamp-1 text-xs font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    {item.caption && (
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">
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
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="card w-full max-w-md border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
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
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
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
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
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
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Image File (JPG, PNG, WebP) *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("image", { required: true })}
                  className="input-field file:text-primary text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-blue-50 file:px-2 file:py-1 file:text-[11px] dark:file:bg-blue-950 dark:file:text-blue-300"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Display Order
                </label>
                <input
                  type="number"
                  defaultValue={0}
                  {...register("display_order")}
                  className="input-field text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-2 dark:border-slate-800">
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
