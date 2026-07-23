import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { DarkModeProvider } from './context/DarkModeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import TrainingsIndex from './pages/TrainingsIndex';
import TrainingDetail from './pages/TrainingDetail';
import CompanyProfileRedirect from './pages/CompanyProfileRedirect';
import NotFound from './pages/NotFound';

function Home() {
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
            {/* Legacy URLs — /classes was replaced by /trainings; keep shared links alive */}
            <Route path="/classes" element={<Navigate to="/trainings" replace />} />
            <Route path="/classes/:slug" element={<Navigate to="/trainings" replace />} />
            <Route path="/company-profile" element={<CompanyProfileRedirect />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
