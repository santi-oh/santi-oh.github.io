import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { projects, workProjects, ProjectImage } from '../data';

const VideoPlayer: React.FC<{ image: ProjectImage }> = ({ image }) => {
  const isYouTube = image.videoUrl?.includes('youtube.com') || image.videoUrl?.includes('youtu.be');
  const isGoogleDrive = image.videoUrl?.includes('drive.google.com');

  const getEmbedUrl = (url: string) => {
    if (isYouTube) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : url;
    }
    if (isGoogleDrive) {
      // Convert view link to preview link for embedding
      return url.replace(/\/view\?usp=sharing$/, '/preview').replace(/\/view$/, '/preview');
    }
    return url;
  };

  if (isYouTube || isGoogleDrive || image.videoUrl?.startsWith('http')) {
    return (
      <div className="aspect-video w-full">
        <iframe
          src={getEmbedUrl(image.videoUrl!)}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  // Local video file
  const videoPath = image.videoUrl?.startsWith('/') ? image.videoUrl.slice(1) : image.videoUrl;
  const fullVideoPath = `${import.meta.env.BASE_URL}${videoPath}`;

  return (
    <video 
      controls 
      className="w-full h-auto rounded-[4px]"
      referrerPolicy="no-referrer"
    >
      <source src={fullVideoPath} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);
  
  // Combine all projects to find the one we need
  const allProjects = [...projects, ...workProjects];
  const project = allProjects.find((p) => p.id === id);

  // Flatten images for the gallery modal (only include images, skip videos)
  const galleryImages = project ? project.images.flat().filter(img => !img.type || img.type === 'image') : [];

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
      setSelectedImageIndex((selectedImageIndex + 1) % galleryImages.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null) {
      isProgrammaticScroll.current = true;
      setSelectedImageIndex((selectedImageIndex - 1 + galleryImages.length) % galleryImages.length);
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
  }, [selectedImageIndex, galleryImages.length]);

  // Handle scroll sync for the modal
  useEffect(() => {
    if (selectedImageIndex !== null && scrollRef.current && isProgrammaticScroll.current) {
      const container = scrollRef.current;
      const targetElement = container.children[selectedImageIndex] as HTMLElement;
      
      if (targetElement) {
        const isSmooth = container.scrollLeft !== 0 || selectedImageIndex === 0;
        container.scrollTo({
          left: targetElement.offsetLeft,
          behavior: isSmooth ? 'smooth' : 'auto'
        });
        
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

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl mb-4">Project not found</h2>
        <Link to="/" className="uppercase tracking-widest opacity-60 hover:opacity-100 underline underline-offset-4">
          Return Home
        </Link>
      </div>
    );
  }

  const getImagePath = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${import.meta.env.BASE_URL}${cleanPath}`;
  };

  return (
    <div className="w-full">
      <div className="mb-16 md:mb-24">
        <h1 className="text-4xl md:text-6xl font-medium mb-4">{project.title}</h1>
        <div className="space-y-1 mb-12">
          <p className="text-lg opacity-80">{project.subtitle}</p>
          <p className="text-md opacity-60 font-light">{project.secondSubtitle}</p>
          {project.tags && project.tags.length > 0 && (
            <div className="flex gap-2 mt-4">
              {project.tags.map(tag => (
                <span key={tag} className="text-[10px] uppercase tracking-widest border border-white/20 px-2 py-1 rounded-full opacity-60">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="max-w-3xl">
          <p className="text-lg leading-relaxed opacity-90 font-light whitespace-pre-wrap">{project.mainCopy}</p>
        </div>
      </div>

      <div className="space-y-16 md:space-y-32">
        {(() => {
          let globalImgCount = 0;
          return project.images.map((row, rowIndex) => {
            // 3-Column Grid Logic for rows with more than 2 images
            if (row.length > 2) {
              return (
                <div key={rowIndex} className="grid grid-cols-3 gap-2 md:gap-4">
                  {row.map((image, imgIndex) => {
                    const isVideo = image.type === 'video';
                    const currentIdx = isVideo ? -1 : globalImgCount++;
                    return (
                      <div 
                        key={imgIndex} 
                        className={`aspect-square bg-brand-accent overflow-hidden rounded-[4px] ${!isVideo ? 'cursor-pointer' : ''}`}
                        onClick={() => !isVideo && openModal(currentIdx)}
                      >
                        <img
                          src={getImagePath(image.url || '')}
                          alt={`${project.title} - ${imgIndex}`}
                          className="w-full h-full object-cover block"
                          referrerPolicy="no-referrer"
                          loading={imgIndex < 9 ? 'eager' : 'lazy'}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            }

            // 1 or 2 Column Logic
            return (
              <div key={rowIndex} className="flex flex-col md:flex-row gap-8 md:gap-12 w-full justify-center">
                {row.map((image, imgIndex) => {
                  const isHalf = row.length === 1 && image.width === 'half';
                  const is75 = row.length === 1 && (image.width === '75%' || !image.width && image.type === 'video');
                  const isVideo = image.type === 'video';
                  const currentIdx = isVideo ? -1 : globalImgCount++;
                  
                  let containerClass = "flex-1 space-y-4";
                  if (isHalf) containerClass = "flex-1 md:max-w-[calc(50%-24px)] space-y-4";
                  if (is75) containerClass = "flex-1 md:max-w-[75%] space-y-4 mx-auto";

                  return (
                    <div key={imgIndex} className={containerClass}>
                      <div 
                        className={`overflow-hidden bg-brand-accent rounded-[4px] ${!isVideo ? 'cursor-pointer' : ''}`}
                        onClick={() => !isVideo && openModal(currentIdx)}
                      >
                        {image.type === 'video' ? (
                          <VideoPlayer image={image} />
                        ) : (
                          <img
                            src={getImagePath(image.url || '')}
                            alt={`${project.title} - ${imgIndex}`}
                            className="w-full h-auto block"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>
                      {image.caption && (
                        <p className="text-[1.1rem] opacity-60 leading-relaxed font-light md:max-w-xl">
                          {image.caption}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          });
        })()}
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
            {galleryImages.length > 1 && (
              <>
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
              </>
            )}

            {/* Main Image View Port */}
            <div 
              ref={scrollRef}
              className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar touch-pan-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onScroll={(e) => {
                if (isProgrammaticScroll.current) return;
                const container = e.currentTarget;
                const index = Math.round(container.scrollLeft / container.clientWidth);
                if (index !== selectedImageIndex && index >= 0 && index < galleryImages.length) {
                  setSelectedImageIndex(index);
                }
              }}
            >
              {galleryImages.map((image, index) => (
                <div 
                  key={`modal-${index}`}
                  className="w-full h-full flex-shrink-0 flex flex-col items-center justify-center snap-center p-4 md:p-20"
                >
                  <div className="max-w-full max-h-full flex flex-col">
                    <img
                      src={getImagePath(image.url || '')}
                      alt={`${project.title} gallery`}
                      className="max-w-full max-h-[85vh] object-contain pointer-events-none select-none"
                      referrerPolicy="no-referrer"
                    />
                    {image.caption && (
                      <div className="w-full mt-4 text-left">
                        <p className="text-white text-lg md:text-xl font-medium leading-relaxed max-w-3xl">
                          {image.caption}
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

export default ProjectDetail;
