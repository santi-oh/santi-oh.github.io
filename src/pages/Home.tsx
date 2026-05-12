import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { projects, homeRows } from '../data';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col gap-[10px]">
      {homeRows.map((row, rowIndex) => (
        <DynamicRow key={rowIndex} items={row.items} rowIndex={rowIndex} />
      ))}
    </div>
  );
};

const DynamicRow: React.FC<{ items: any[], rowIndex: number }> = ({ items, rowIndex }) => {
  const [minHeight, setMinHeight] = useState<number | null>(null);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

  const handleImageLoad = () => {
    // Only apply height matching for rows with 3+ items
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
        const project = item.projectId ? projects.find(p => p.id === item.projectId) : null;
        const getImagePath = (path: string) => {
          if (path.startsWith('http')) return path;
          // Ensure path doesn't have double slashes
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
            <h3 className="text-6xl font-medium mb-4">{data.title}</h3>
            <p className="text-2xl tracking-[1px] opacity-80">{data.subtitle}</p>
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

export default Home;
