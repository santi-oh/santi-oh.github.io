import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Work from './pages/Work';
import Grid from './pages/Grid';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/grid" element={<Grid />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
