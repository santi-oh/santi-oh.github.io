import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { projects, homeRows } from '../data';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col gap-5">
      {homeRows.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className="flex gap-5 h-[240px] md:h-[320px]"
        >
          {row.items.map((item, itemIndex) => {
            const project = item.projectId ? projects.find(p => p.id === item.projectId) : null;
            const displayData = project ? {
              id: project.id,
              title: project.title,
              subtitle: project.subtitle,
              image: project.thumbnail,
              link: true,
              flex: item.flex || 1
            } : {
              id: `item-${rowIndex}-${itemIndex}`,
              title: item.title || '',
              subtitle: item.subtitle || '',
              image: item.imageUrl || '',
              link: false,
              flex: item.flex || 1
            };

            return (
              <ProjectCard 
                key={displayData.id} 
                data={displayData} 
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

const ProjectCard: React.FC<{ data: any }> = ({ data }) => {
  const content = (
    <div 
      className="group relative h-full rounded-[4px] overflow-hidden bg-brand-accent flex bg-center bg-cover"
      style={{ flex: data.flex }}
    >
      <motion.img
        src={data.image}
        alt={data.title}
        className="w-full h-full object-cover opacity-90 transition-opacity duration-700"
        referrerPolicy="no-referrer"
      />
      
      {data.link && (
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-6">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-medium mb-1">{data.title}</h3>
            <p className="text-[12px] tracking-[1px] opacity-80">{data.subtitle}</p>
          </motion.div>
        </div>
      )}
    </div>
  );

  if (data.link) {
    return (
      <Link 
        to={`/project/${data.id}`} 
        className="flex" 
        style={{ flex: data.flex }}
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default Home;
