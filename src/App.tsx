import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router';
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
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ServicesIndex from './pages/ServicesIndex';
import ServiceDetail from './pages/ServiceDetail';
import TechnologiesIndex from './pages/TechnologiesIndex';
import TechnologyDetail from './pages/TechnologyDetail';
import AuthorsIndex from './pages/AuthorsIndex';
import AuthorProfile from './pages/AuthorProfile';
import { canonicalUrl, ID } from './data/site';
import { SERVICES } from './data/services';
import { technologiesForService } from './data/technologies';
import {
  breadcrumbNode,
  localBusinessNode,
  logoNode,
  organizationNode,
  serviceNode,
  webPageNode,
  webSiteNode,
} from './lib/schema';

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
  const canonical = canonicalUrl('/');
  const crumbs = [{ name: 'Home' }];

  // The homepage carries the foundation nodes plus LocalBusiness and the four
  // Service entities, per the Phase 04 page implementation matrix. Organization
  // is emitted in full here and referenced by @id everywhere else on the site.
  useSeo({
    title: 'Developers Hub | Software & Training, Johor Bahru',
    description:
      'Developers Hub Sdn Bhd builds custom software, advises on technical decisions, trains development teams and automates business workflows — from Johor Bahru, for clients across Malaysia.',
    path: '/',
    crumbs,
    nodes: [
      organizationNode(),
      logoNode(),
      webSiteNode(),
      localBusinessNode(),
      webPageNode({
        canonical,
        name: 'Developers Hub | Software & Training, Johor Bahru',
        description:
          'Developers Hub Sdn Bhd builds custom software, advises on technical decisions, trains development teams and automates business workflows.',
        mainEntityId: ID.organization,
      }),
      ...SERVICES.map((service) => serviceNode(service, technologiesForService(service.slug))),
      breadcrumbNode(canonical, crumbs),
    ],
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

// App deliberately does NOT create a router. The browser supplies
// BrowserRouter from src/main.tsx and the prerender step supplies StaticRouter
// from src/entry-server.tsx — BrowserRouter reads `document` on construction,
// so a router baked in here would make the whole tree unrenderable on the
// server.
function App() {
  return (
    <DarkModeProvider>
      <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services" element={<ServicesIndex />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/technologies" element={<TechnologiesIndex />} />
          <Route path="/technologies/:slug" element={<TechnologyDetail />} />
          <Route path="/authors" element={<AuthorsIndex />} />
          <Route path="/authors/:slug" element={<AuthorProfile />} />
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
    </DarkModeProvider>
  );
}

export default App;
