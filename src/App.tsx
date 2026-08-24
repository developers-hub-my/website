import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router';
import { DarkModeProvider } from './context/DarkModeContext';
import { initAnalytics, trackPageView } from './lib/analytics';
import { initMetaPixel, trackMetaPageView } from './lib/meta-pixel';
import { useSeo } from './hooks/useSeo';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import TrainingsIndex from './pages/TrainingsIndex';
import BlogIndex from './pages/BlogIndex';
import BlogPost from './pages/BlogPost';
import TrainingDetail from './pages/TrainingDetail';
import CompanyProfileRedirect from './pages/CompanyProfileRedirect';
import NotFound from './pages/NotFound';

// Reports SPA page views to GA4 and the Meta Pixel on every route change (both
// vendors' automatic page views are off — see lib/analytics.ts and
// lib/meta-pixel.ts). Each vendor is a no-op when its env var is unset.
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    initAnalytics();
    initMetaPixel();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
    trackMetaPageView();
  }, [location.pathname, location.search]);

  return null;
}

function Home() {
  useSeo({
    title: 'Developers Hub Sdn Bhd | Technology Education & Software Development in Malaysia',
    description:
      'Developers Hub is a leading technology company in Johor Bahru, Malaysia offering education & training, software development, IT consultation, and business solutions. Empowering businesses through innovation since 2020.',
    path: '/',
  });

  return (
    <>
      <Hero />
      <About />
      <Services />
      <Contact />
    </>
  );
}

function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trainings" element={<TrainingsIndex />} />
            <Route path="/trainings/:stage/:slug" element={<TrainingDetail />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            {/* Legacy URLs — /classes was replaced by /trainings; keep shared links alive */}
            <Route path="/classes" element={<Navigate to="/trainings" replace />} />
            <Route path="/classes/:slug" element={<Navigate to="/trainings" replace />} />
            <Route path="/company-profile" element={<CompanyProfileRedirect />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
        {/* After the routes so its page-view effect runs after each page's useSeo
            has set document.title (React flushes effects in tree order). */}
        <AnalyticsTracker />
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
