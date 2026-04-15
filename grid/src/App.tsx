/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

// Images are now fetched from the /api/photos endpoint which reads the local "photos" folder

export default function App() {
  const [images, setImages] = useState<{ id: string; name: string; url: string }[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        // Fetch the static manifest from the public folder
        const response = await fetch('./photos.json');
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  // Sort images: Alphabetical Z to A and 9999 to 000
  const sortedImages = useMemo(() => {
    return [...images].sort((a, b) => {
      return b.name.localeCompare(a.name, undefined, { numeric: true, sensitivity: 'base' });
    });
  }, [images]);

  const handleNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % sortedImages.length);
    }
  };

  const handlePrev = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + sortedImages.length) % sortedImages.length);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setSelectedImageIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d]">
        <div className="meta-info animate-pulse">Scanning Archive...</div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0d0d] p-8 text-center">
        <div className="meta-info mb-4">Archive Empty</div>
        <p className="text-white/40 max-w-md italic">
          Please add image files (.jpg, .png, .webp) to the <code className="bg-white/10 px-1 rounded not-italic">/photos</code> directory to populate the gallery.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-[60px] grid grid-cols-3 gap-6">
        {sortedImages.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square overflow-hidden bg-[#1a1a1a] border border-white/5 cursor-pointer"
            onClick={() => setSelectedImageIndex(index)}
            id={`image-container-${image.id}`}
          >
            <img
              src={image.url}
              alt={image.name}
              referrerPolicy="no-referrer"
              loading={index < 9 ? "eager" : "lazy"}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </main>

      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/98 flex items-center justify-center p-8"
            onClick={() => setSelectedImageIndex(null)}
          >
            <button
              className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors z-50"
              onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(null); }}
              id="close-modal"
            >
              <X size={32} strokeWidth={1} />
            </button>

            <button
              className="absolute left-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors z-50 p-2"
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              id="prev-button"
            >
              <ChevronLeft size={64} strokeWidth={1} />
            </button>

            <button
              className="absolute right-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors z-50 p-2"
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              id="next-button"
            >
              <ChevronRight size={64} strokeWidth={1} />
            </button>

            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative max-w-6xl max-h-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={sortedImages[selectedImageIndex].url}
                alt={sortedImages[selectedImageIndex].name}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[75vh] object-contain border border-white/10"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
