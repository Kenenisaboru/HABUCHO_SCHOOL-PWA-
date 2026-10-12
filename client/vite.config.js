import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/*.png"],
      manifest: {
        name: "Habucho Preparatory School",
        short_name: "Habucho School",
        description: "School Management System for Habucho Preparatory School",
        theme_color: "#2563eb",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          { src: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "google-fonts-cache", expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          {
            // Only cache public unauthenticated API endpoints
            urlPattern: /\/api\/public\/.*/i,
            handler: "NetworkFirst",
            options: { cacheName: "public-api-cache", networkTimeoutSeconds: 5, expiration: { maxEntries: 20, maxAgeSeconds: 60 * 5 } },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          charts: ["chart.js", "react-chartjs-2"],
          pdf: ["jspdf", "jspdf-autotable"],
        },
      },
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": { target: "http://localhost:5000", changeOrigin: true },
    },
  },
});
