import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DarkModeProvider } from './context/DarkModeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ClassesIndex from './pages/ClassesIndex';
import ClassDetail from './pages/ClassDetail';

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
            <Route path="/classes" element={<ClassesIndex />} />
            <Route path="/classes/:slug" element={<ClassDetail />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
