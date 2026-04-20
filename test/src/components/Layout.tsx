import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const year = new Date().getFullYear();

  // Determine current page hint
  const getPageHint = () => {
    if (location.pathname === '/') return 'Home — Selected Works';
    if (location.pathname === '/grid') return 'Grid View — Portfolio Archive';
    if (location.pathname.startsWith('/project/')) return 'Project Details — Selected Works';
    if (location.pathname === '/about') return 'Studio Information — Profile';
    return 'Archive';
  };

  return (
    <div className="relative min-h-screen">
      <div className="page-transition">
        <Header />
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-grow"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Layout;
