import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import ProjectDetail from './components/ProjectDetail';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Quote from './pages/Quote';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Showroom from './pages/Showroom';
import Policy from './pages/Policy';
import AboutUs from './pages/AboutUs';
import { Project } from './types';
import { getSettings } from './services/mockDatabase';
import PVCLaminaat from './pages/products/PVCLaminaat';
import Parket from './pages/products/Parket';
import Legservice from './pages/products/Legservice';
import Traprenovatie from './pages/products/Traprenovatie';
import Buitenparket from './pages/products/Buitenparket';
import Interieurwerken from './pages/products/Interieurwerken';
import AnnouncementBar from './components/AnnouncementBar';
import CookieBanner from './components/CookieBanner';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [chatbotEnabled, setChatbotEnabled] = useState(true);

  // Simple Hash Router logic
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1); // remove #
      if (hash) setCurrentPage(hash);
      else setCurrentPage('home');
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial check
    handleHashChange();

    // Check chatbot settings on load
    getSettings().then(settings => {
      setChatbotEnabled(settings.chatbotEnabled);
    });

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentPage]); // Re-check settings when navigating might be useful if we update it in admin

  const navigate = (page: string) => {
    window.location.hash = page;
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('admin');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('home');
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  const renderPage = () => {
    if (currentPage.startsWith('policy-')) {
      const policyId = currentPage.replace('policy-', '');
      return <Policy policyId={policyId} />;
    }

    switch (currentPage) {
      case 'home': return <Home onNavigate={navigate} onProjectSelect={handleProjectSelect} />;
      case 'projects': return <Projects onProjectSelect={handleProjectSelect} />;
      case 'quote': return <Quote />;
      case 'contact': return <Contact />;
      case 'showroom': return <Showroom />;
      case 'producten-pvc': return <PVCLaminaat />;
      case 'producten-parket': return <Parket />;
      case 'producten-legservice': return <Legservice />;
      case 'producten-trap': return <Traprenovatie />;
      case 'producten-buitenparket': return <Buitenparket />;
      case 'producten-interieur': return <Interieurwerken />;
      case 'over-ons': return <AboutUs onNavigate={navigate} />;
      case 'admin':
        return isAuthenticated ? <Admin onLogout={handleLogout} /> : <Login onLogin={handleLogin} onNavigate={navigate} />;
      case 'login':
        return <Login onLogin={handleLogin} onNavigate={navigate} />;
      default: return <Home onNavigate={navigate} onProjectSelect={handleProjectSelect} />;
    }
  };

  // Check if we are in a "fullscreen" page like Login/Admin to optionally hide Navbar/Footer
  const isFullscreenPage = currentPage === 'login' || (currentPage === 'admin' && !isAuthenticated);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {!isFullscreenPage && currentPage !== 'admin' && <AnnouncementBar />}
      {!isFullscreenPage && currentPage !== 'admin' && <Navbar onNavigate={navigate} currentPage={currentPage} />}

      <main className="flex-grow">
        {renderPage()}
      </main>

      {!isFullscreenPage && currentPage !== 'admin' && <Footer onNavigate={navigate} />}

      {/* Project Detail Overlay */}
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onRequestQuote={() => {
            setSelectedProject(null);
            navigate('quote');
          }}
        />
      )}

      {/* Chatbot is available on all public pages if enabled, not on admin/login */}
      {!isFullscreenPage && currentPage !== 'admin' && chatbotEnabled && <Chatbot />}

      {!isFullscreenPage && currentPage !== 'admin' && <CookieBanner />}
    </div>
  );
};

export default App;