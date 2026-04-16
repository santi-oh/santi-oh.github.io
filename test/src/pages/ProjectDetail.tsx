import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { projects } from '../data';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === id);

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

  return (
    <div className="w-full">
      <div className="mb-16 md:mb-24">
        <h1 className="text-4xl md:text-6xl font-medium mb-4">{project.title}</h1>
        <div className="space-y-1 mb-12">
          <p className="text-lg opacity-80">{project.subtitle}</p>
          <p className="text-sm opacity-60 font-light">{project.secondSubtitle}</p>
        </div>
        <div className="max-w-3xl">
          <p className="text-lg leading-relaxed opacity-90 font-light italic">{project.mainCopy}</p>
        </div>
      </div>

      <div className="space-y-16 md:space-y-32">
        {project.images.map((row, rowIndex) => (
          <div 
            key={rowIndex} 
            className={`grid gap-8 md:gap-12`}
            style={{ 
              gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))` 
            }}
          >
            {row.map((image, imgIndex) => (
              <div key={imgIndex} className="space-y-4">
                <div className="overflow-hidden bg-brand-accent rounded-[4px]">
                  <img
                    src={image.url}
                    alt={`${project.title} - ${imgIndex}`}
                    className="w-full h-auto opacity-90 block"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {image.caption && (
                  <p className="text-sm opacity-60 leading-snug max-w-xs italic font-light">
                    {image.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetail;
