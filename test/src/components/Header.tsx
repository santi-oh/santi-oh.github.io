import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

const Header: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'grid', path: '/grid' },
    { name: 'about', path: '/about' },
    { name: 'instagram', path: 'https://instagram.com/santi.oh', external: true },
    { name: 'e-mail', path: 'mailto:ortega.haboud@gmail.com', external: true },
  ];

  return (
    <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-16 gap-4">
      <div>
        <Link to="/" className="text-[40px] font-light tracking-tight hover:opacity-70 transition-opacity leading-none">
          santi.oh
        </Link>
      </div>
      
      <nav>
        <ul className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              <div className="relative group w-fit">
                {link.external ? (
                  <a
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[20px] font-light opacity-80 hover:opacity-100 transition-opacity"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    to={link.path}
                    className={`text-[20px] font-light transition-opacity ${
                      location.pathname === link.path ? 'opacity-100' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
                {location.pathname === link.path && !link.external && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 w-full h-px bg-white"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
