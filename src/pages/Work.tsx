import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { workProjects, workRows } from '../data';

const Work: React.FC = () => {
  const [activeTag, setActiveTag] = useState<string>('All');

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    tags.add('All');
    workProjects.forEach(p => {
      p.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, []);

  // Filter rows based on active tag
  // A row is visible if at least one of its project items matches the active tag
  // (Or if the item is not a project and we decide to show it)
  const filteredRows = useMemo(() => {
    if (activeTag === 'All') return workRows;

    return workRows.map(row => {
      const filteredItems = row.items.filter(item => {
        if (!item.projectId) return true; // Keep static items? or hide them? Let's hide them if they don't have tags
        const project = workProjects.find(p => p.id === item.projectId);
        return project?.tags?.includes(activeTag);
      });
      return { ...row, items: filteredItems };
    }).filter(row => row.items.length > 0);
  }, [activeTag]);

  return (
    <div className="flex flex-col gap-12">
      {/* Filters */}
      <div className="flex flex-wrap gap-6 border-b border-white/10 pb-8">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`text-sm tracking-[2px] uppercase transition-all duration-300 ${
              activeTag === tag ? 'text-white' : 'text-white/40 hover:text-white/70'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-[10px]">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTag}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-[10px]"
          >
            {filteredRows.map((row, rowIndex) => (
              <DynamicRow key={`${activeTag}-${rowIndex}`} items={row.items} rowIndex={rowIndex} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const DynamicRow: React.FC<{ items: any[], rowIndex: number }> = ({ items, rowIndex }) => {
  const [minHeight, setMinHeight] = useState<number | null>(null);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

  const handleImageLoad = () => {
    if (items.length < 3) return;
    
    const heights = imgRefs.current
      .filter(img => img !== null && img.complete)
      .map(img => img!.clientHeight);
    
    if (heights.length === items.length) {
      setMinHeight(Math.min(...heights));
    }
  };

  useEffect(() => {
    setMinHeight(null);
  }, [items]);

  return (
    <div 
      className={`flex gap-[10px] w-full overflow-hidden ${items.length === 2 ? 'items-start' : 'items-stretch'}`}
      style={{ height: items.length >= 3 && minHeight ? `${minHeight}px` : 'auto' }}
    >
      {items.map((item, itemIndex) => {
        const project = item.projectId ? workProjects.find(p => p.id === item.projectId) : null;
        const getImagePath = (path: string) => {
          if (path.startsWith('http')) return path;
          const cleanPath = path.startsWith('/') ? path.slice(1) : path;
          return `${import.meta.env.BASE_URL}${cleanPath}`;
        };

        const displayData = project ? {
          id: project.id,
          title: project.title,
          subtitle: project.subtitle,
          secondSubtitle: project.secondSubtitle,
          image: getImagePath(project.thumbnail),
          link: true,
          flex: item.flex || 1
        } : {
          id: `item-${rowIndex}-${itemIndex}`,
          title: item.title || '',
          subtitle: item.subtitle || '',
          secondSubtitle: item.secondSubtitle || '',
          image: item.imageUrl ? getImagePath(item.imageUrl) : '',
          link: false,
          flex: item.flex || 1
        };

        return (
          <ProjectCard 
            key={displayData.id} 
            data={displayData} 
            itemCount={items.length}
            onLoad={handleImageLoad}
            imgRef={(el) => (imgRefs.current[itemIndex] = el)}
          />
        );
      })}
    </div>
  );
};

const ProjectCard: React.FC<{ data: any, itemCount: number, onLoad: () => void, imgRef: (el: HTMLImageElement | null) => void }> = ({ data, itemCount, onLoad, imgRef }) => {
  const isSingle = itemCount === 1;
  const isMulti = itemCount > 1;

  const content = (
    <div 
      className={`group relative rounded-[4px] overflow-hidden bg-brand-accent flex bg-center bg-cover ${isMulti ? 'aspect-square w-full h-auto' : 'w-full h-full'}`}
      style={{ flex: isSingle ? 'initial' : 1 }}
    >
      <motion.img
        ref={imgRef}
        src={data.image}
        alt={data.title}
        onLoad={onLoad}
        className={`w-full opacity-90 transition-opacity duration-700 block ${isMulti ? 'h-full object-cover' : 'h-auto'}`}
        referrerPolicy="no-referrer"
      />
      
      {data.link && (
        <div className="absolute inset-0 bg-black/70 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-6 hidden md:flex">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-4xl md:text-6xl font-medium mb-4">{data.title}</h3>
            <p className="text-xl md:text-2xl tracking-[1px] opacity-80">{data.subtitle}</p>
          </motion.div>
        </div>
      )}

      {/* Mobile Overlay */}
      {data.link && (
        <div 
          className="absolute inset-x-0 bottom-0 h-[20%] md:hidden flex flex-col justify-end p-3 pointer-events-none"
          style={{ 
            background: 'linear-gradient(to top, rgba(34, 34, 85, 0.6) 0%, rgba(34, 34, 85, 0) 100%)'
          }}
        >
          <div className="text-white">
            <h3 className="text-lg font-medium leading-tight">{data.title}</h3>
            <p className="text-xs opacity-70 font-light">{data.secondSubtitle}</p>
          </div>
        </div>
      )}
    </div>
  );

  if (data.link) {
    return (
      <Link 
        to={`/project/${data.id}`} 
        className="flex" 
        style={{ flex: isSingle ? 'initial' : 1, width: isSingle ? '100%' : 'auto' }}
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default Work;
