import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface Photo {
  id: string;
  name: string;
  url: string;
  text?: string;
}

const Grid: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}images/grid/photos.json`);
        if (!response.ok) throw new Error('Failed to fetch photos');
        const data = await response.json();
        setPhotos(data);
      } catch (error) {
        console.error('Error loading grid photos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const getImagePath = (url: string) => {
    // The URLs in photos.json are relative to the json file: ./photos/xxx.jpg
    // Since photos.json is at images/grid/photos.json, 
    // the actual path is images/grid/photos/xxx.jpg
    const cleanPath = url.startsWith('./') ? `images/grid/${url.slice(2)}` : url;
    return `${import.meta.env.BASE_URL}${cleanPath}`;
  };

  const openModal = (index: number) => {
    isProgrammaticScroll.current = true;
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = 'auto';
    isProgrammaticScroll.current = false;
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null) {
      isProgrammaticScroll.current = true;
      setSelectedImageIndex((selectedImageIndex + 1) % photos.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null) {
      isProgrammaticScroll.current = true;
      setSelectedImageIndex((selectedImageIndex - 1 + photos.length) % photos.length);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex]);

  // Handle scroll sync for the modal
  useEffect(() => {
    if (selectedImageIndex !== null && scrollRef.current && isProgrammaticScroll.current) {
      const container = scrollRef.current;
      const targetElement = container.children[selectedImageIndex] as HTMLElement;
      
      if (targetElement) {
        // Find if we should use smooth or instant (instant on initial open)
        const isSmooth = container.scrollLeft !== 0 || selectedImageIndex === 0;
        
        container.scrollTo({
          left: targetElement.offsetLeft,
          behavior: isSmooth ? 'smooth' : 'auto'
        });
        
        // Reset the flag after animation
        const resetFlag = () => {
          isProgrammaticScroll.current = false;
        };

        if ('onscrollend' in window) {
          container.addEventListener('scrollend', resetFlag, { once: true });
        } else {
          const timeout = setTimeout(resetFlag, 500);
          return () => clearTimeout(timeout);
        }
      }
    }
  }, [selectedImageIndex]);

  return (
    <div className="w-full">
      <div className="mb-16 md:mb-24">
        <h1 className="text-4xl md:text-6xl font-medium mb-8">Grid</h1>
          <div className="space-y-1 mb-12">
          <p className="text-md opacity-60 font-light">2016—ongoing</p>
        </div>

        <div className="max-w-3xl space-y-6 text-lg leading-relaxed opacity-90 font-light whitespace-pre-wrap">
          <p>
This collection began as individual pictures uploaded to Instagram. As time went by, it evolved into a compilation of textures, plants, urban details and visual insights in general, organised in groups of three more often than not.
I have removed all my pictures from Instagram following the ultra-commercialisation of the platform and the more extended use of AI in their products. I hope to keep updating this page with new findings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-4 pb-20">
        {photos.map((photo, index) => (
          <button 
            key={photo.id} 
            onClick={() => openModal(index)}
            onMouseEnter={() => setHoveredId(photo.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="aspect-square overflow-hidden bg-brand-accent rounded-[4px] cursor-pointer relative"
          >
            <img
              src={getImagePath(photo.url)}
              alt={photo.name}
              className="w-full h-full object-cover opacity-90"
              referrerPolicy="no-referrer"
              loading={index < 9 ? 'eager' : 'lazy'}
            />
            {photo.text && (
              <AnimatePresence>
                {hoveredId === photo.id && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex flex-col justify-end p-4 pointer-events-none"
                    style={{ 
                      background: 'linear-gradient(to top, rgba(34, 34, 85, 0.75) 0%, rgba(34, 34, 85, 0) 20%)'
                    }}
                  >
                    <p className="text-white text-md font-medium leading-snug text-left">
                      {photo.text}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </button>
        ))}
      </div>

      {/* Modal Gallery */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center pt-2"
          >
            {/* Close Button */}
            <button 
              onClick={closeModal}
              className="absolute top-8 right-8 z-[110] text-white/50 hover:text-white transition-colors"
            >
              <X size={40} strokeWidth={1} />
            </button>

            {/* Desktop Navigation Arrows */}
            <button 
              onClick={prevImage}
              className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-[110] text-white/50 hover:text-white transition-colors w-16 h-16 items-center justify-center"
            >
              <ChevronLeft size={60} strokeWidth={1} />
            </button>

            <button 
              onClick={nextImage}
              className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-[110] text-white/50 hover:text-white transition-colors w-16 h-16 items-center justify-center"
            >
              <ChevronRight size={60} strokeWidth={1} />
            </button>

            {/* Main Image View Port */}
            <div 
              ref={scrollRef}
              className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar touch-pan-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onScroll={(e) => {
                if (isProgrammaticScroll.current) return;
                const container = e.currentTarget;
                const index = Math.round(container.scrollLeft / container.clientWidth);
                if (index !== selectedImageIndex && index >= 0 && index < photos.length) {
                  setSelectedImageIndex(index);
                }
              }}
            >
              {photos.map((photo, index) => (
                <div 
                  key={`modal-${photo.id}`}
                  className="w-full h-full flex-shrink-0 flex flex-col items-center justify-center snap-center p-4 md:p-20"
                >
                  <div className="max-w-full max-h-full flex flex-col">
                    <img
                      src={getImagePath(photo.url)}
                      alt={photo.name}
                      className="max-w-full max-h-[85vh] object-contain pointer-events-none select-none"
                      referrerPolicy="no-referrer"
                    />
                    {photo.text && (
                      <div className="w-full mt-4 text-left">
                        <p className="text-white text-lg md:text-xl font-medium leading-relaxed max-w-3xl">
                          {photo.text}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Grid;
