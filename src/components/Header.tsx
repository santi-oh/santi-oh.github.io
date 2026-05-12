import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'projects', path: '/' },
    { name: 'work', path: '/work' },
    { name: 'grid', path: '/grid' },
    { name: 'about', path: '/about' },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="flex justify-between items-center mb-16 relative z-50">
      <div>
        <Link 
          to="/" 
          onClick={() => setIsMenuOpen(false)}
          className="text-[32px] md:text-[40px] font-light tracking-tight hover:opacity-70 transition-opacity leading-none"
        >
          santi.oh
        </Link>
      </div>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:block">
        <ul className="flex flex-row items-center gap-8">
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

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden p-2 -mr-2 z-50 text-white"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={32} strokeWidth={1.5} /> : <Menu size={32} strokeWidth={1.5} />}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-brand-bg z-40 p-10 pt-32 md:hidden"
          >
            <ul className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-4xl font-light opacity-80 hover:opacity-100 transition-opacity lowercase"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className={`text-4xl font-light transition-opacity lowercase ${
                        location.pathname === link.path ? 'opacity-100' : 'opacity-80'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
