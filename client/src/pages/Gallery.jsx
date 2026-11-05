import { useState, useEffect, useCallback } from "react";
import {
  Images,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Maximize2,
  Calendar,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import SkeletonLoader from "../components/SkeletonLoader";
import useFetch from "../hooks/useFetch";
import { getGalleryImages } from "../services/publicService";

const FALLBACK_GALLERY = [
  {
    id: 101,
    title: "Advanced Chemistry & Molecular Biology Lab",
    caption: "Senior Grade 12 students conducting titration experiments in our newly equipped science wing.",
    category: "Laboratories",
    image_path: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 102,
    title: "Central Academic Quadrangle & Study Gardens",
    caption: "Our peaceful green campus spaces where preparatory students collaborate during open study hours.",
    category: "Campus Life",
    image_path: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 103,
    title: "Habucho Robotics & Digital Systems Workshop",
    caption: "Students debugging automated micro-controller circuits for the regional innovation challenge.",
    category: "Laboratories",
    image_path: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 104,
    title: "Annual Commencement & Honors Convocation",
    caption: "Celebrating our top national exam achievers and university scholarship awardees.",
    category: "Graduation",
    image_path: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 105,
    title: "Interscholastic Athletics & Basketball Arena",
    caption: "Fostering athletic discipline and team camaraderie on our multipurpose sports grounds.",
    category: "Sports & Arts",
    image_path: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 106,
    title: "Digital Multimedia & Reading Hall",
    caption: "Quiet research floor with high-speed academic database access and collaborative cubicles.",
    category: "Campus Life",
    image_path: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
  },
];

const Gallery = () => {
  const { data: dbImages, loading, error } = useFetch(getGalleryImages);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");

  const images = Array.isArray(dbImages) && dbImages.length > 0 ? dbImages : FALLBACK_GALLERY;

  const categories = ["All", ...new Set(images.map((img) => img.category || "Campus Life"))];

  const filteredImages =
    filterCategory === "All"
      ? images
      : images.filter((img) => (img.category || "Campus Life") === filterCategory);

  const activeIndex = selectedImage
    ? filteredImages.findIndex((img) => img.id === selectedImage.id)
    : -1;

  const handlePrev = useCallback(() => {
    if (activeIndex > 0) {
      setSelectedImage(filteredImages[activeIndex - 1]);
    } else {
      setSelectedImage(filteredImages[filteredImages.length - 1]);
    }
  }, [activeIndex, filteredImages]);

  const handleNext = useCallback(() => {
    if (activeIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[activeIndex + 1]);
    } else {
      setSelectedImage(filteredImages[0]);
    }
  }, [activeIndex, filteredImages]);

  // Handle keyboard arrow & escape keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      if (e.key === "Escape") setSelectedImage(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, handlePrev, handleNext]);

  return (
    <MainLayout>
      <PageHeader
        badge="CAMPUS LIFE & FACILITIES"
        title="School Photo Gallery"
        subtitle="Explore our vibrant campus, state-of-the-art laboratory facilities, athletic spaces, and student academic achievements."
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
            <div>
              <span className="section-label">VISUAL TOUR</span>
              <h2 className="section-title text-2xl sm:text-3xl">Life at Habucho</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
                    filterCategory === cat
                      ? "bg-primary text-white shadow-md shadow-blue-500/25"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Loading Skeletons */}
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3">
                  <SkeletonLoader className="h-64 w-full rounded-xl mb-3" />
                  <SkeletonLoader className="h-4 w-3/4 mb-1" />
                  <SkeletonLoader className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredImages.map((img, idx) => (
                <Reveal key={img.id || idx} delay={idx * 0.05}>
                  <div
                    onClick={() => setSelectedImage(img)}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800/80 dark:bg-slate-900"
                  >
                    {/* Image with zoom effect */}
                    <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={img.image_path}
                        alt={img.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md">
                          <Maximize2 className="h-5 w-5" />
                        </span>
                      </div>
                      <span className="absolute top-3 left-3 rounded-lg bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-md">
                        {img.category || "Campus"}
                      </span>
                    </div>

                    {/* Title & Caption */}
                    <div className="p-5">
                      <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
                        {img.title}
                      </h3>
                      {img.caption && (
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {img.caption}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8 animate-fade-in">
          {/* Close button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-5 right-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Close preview"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Left Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Modal Content */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl"
          >
            <img
              src={selectedImage.image_path}
              alt={selectedImage.title}
              className="max-h-[70vh] w-auto max-w-full object-contain"
            />
            <div className="w-full bg-slate-900/90 p-5 backdrop-blur-md text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                {selectedImage.category || "Campus Life"}
              </span>
              <h3 className="font-display text-lg font-bold text-white mt-0.5">
                {selectedImage.title}
              </h3>
              {selectedImage.caption && (
                <p className="mt-1 text-xs text-slate-300 leading-relaxed max-w-3xl">
                  {selectedImage.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Gallery;
