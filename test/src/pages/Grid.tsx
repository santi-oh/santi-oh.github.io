import React from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../data';

const Grid: React.FC = () => {
  return (
    <div className="w-full">
      <div className="mb-16 md:mb-24">
        <h1 className="text-4xl md:text-6xl font-medium mb-8">Grid</h1>
          <div className="space-y-1 mb-12">
          <p className="text-sm opacity-60 font-light">2016—ongoing</p>
        </div>

        <div className="max-w-3xl space-y-6 text-lg leading-relaxed opacity-90 font-light italic">
          <p>
This collection began as individual pictures uploaded to Instagram. As time went by, it evolved into a compilation of textures, plants, urban details and visual insights in general, organised in groups of three more often than not.
I have removed all my pictures from Instagram following the ultra-commercialisation of the platform and the more extended use of AI in their products. I hope to keep updating this page with new findings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {projects.map((project) => (
          <Link 
            key={project.id} 
            to={`/project/${project.id}`} 
            className="aspect-square overflow-hidden bg-brand-accent rounded-[4px] group"
          >
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover opacity-90 transition-opacity duration-500"
              referrerPolicy="no-referrer"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Grid;
